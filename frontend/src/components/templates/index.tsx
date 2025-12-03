import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z, ZodTypeAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { yupResolver } from "@hookform/resolvers/yup";
import type { AnyObjectSchema } from "yup";
import mapboxgl, { LngLatLike, Map as MapboxMap } from "mapbox-gl";
import clsx from "clsx";
import "mapbox-gl/dist/mapbox-gl.css";
import "../../styles/templates.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN ?? "";

/* -------------------------------- Shamba Page ------------------------------- */
export interface ShambaPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  isLoading?: boolean;
  error?: string;
}

export const ShambaPage: React.FC<ShambaPageProps> = ({
  title,
  subtitle,
  children,
  actions,
  isLoading,
  error,
}) => {
  return (
    <div className="shamba-page">
      <header className="page-header">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </header>

      {isLoading ? (
        <ShambaLoader message={`Loading ${title.toLowerCase()}...`} />
      ) : error ? (
        <ShambaError error={error} />
      ) : (
        <main className="page-content">{children}</main>
      )}

      <ShambaToast />
    </div>
  );
};

/* -------------------------------- Data Card -------------------------------- */
export type TrendDirection = "up" | "down" | "stable";
export type DataCardColor = "primary" | "secondary" | "warning" | "success";

export interface DataCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: TrendDirection;
  trendValue?: string;
  onClick?: () => void;
  color?: DataCardColor;
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  onClick,
  color = "primary",
}) => {
  return (
    <button
      type="button"
      className={clsx("data-card", `data-card--${color}`)}
      onClick={onClick}
    >
      <div className="data-card__icon">{icon}</div>
      <div className="data-card__body">
        <p className="data-card__title">{title}</p>
        <p className="data-card__value">{value}</p>
      </div>
      {trend && (
        <div className={clsx("data-card__trend", `trend-${trend}`)}>
          <span>{trend === "up" ? "▲" : trend === "down" ? "▼" : "➖"}</span>
          {trendValue && <small>{trendValue}</small>}
        </div>
      )}
    </button>
  );
};

/* --------------------------------- Forms ----------------------------------- */
export interface FormChildrenProps<T> {
  form: UseFormReturn<T>;
  isSubmitting: boolean;
  submitError?: string | null;
}

export interface ShambaFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validationSchema?: ZodTypeAny | AnyObjectSchema;
  children: (props: FormChildrenProps<T>) => React.ReactNode;
  submitText?: string;
}

export function ShambaForm<T>({
  initialValues,
  onSubmit,
  validationSchema,
  children,
  submitText = "Save",
}: ShambaFormProps<T>) {
  const resolver = useMemo(() => {
    if (!validationSchema) return undefined;
    if ("safeParse" in validationSchema) {
      return zodResolver(validationSchema as ZodTypeAny);
    }
    if ("validate" in validationSchema) {
      return yupResolver(validationSchema as AnyObjectSchema);
    }
    return undefined;
  }, [validationSchema]);

  const form = useForm<T>({
    defaultValues: initialValues,
    resolver,
    mode: "onChange",
  });

  const { handleSubmit, formState } = form;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitHandler = handleSubmit(async (values) => {
    try {
      setSubmitError(null);
      await onSubmit(values);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit");
    }
  });

  return (
    <form className="shamba-form" onSubmit={submitHandler} noValidate>
      {children({ form, isSubmitting: formState.isSubmitting, submitError })}
      {submitError && <p className="form-error">{submitError}</p>}
      <button className="btn btn-primary" type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Saving..." : submitText}
      </button>
    </form>
  );
}

/* --------------------------------- List ------------------------------------ */
export interface ShambaListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  emptyComponent?: React.ReactNode;
  loading?: boolean;
  onRefresh?: () => void;
  loadMore?: () => void;
  hasMore?: boolean;
  filters?: React.ReactNode;
  title?: string;
}

export function ShambaList<T>({
  items,
  renderItem,
  keyExtractor,
  emptyComponent,
  loading,
  onRefresh,
  loadMore,
  hasMore,
  filters,
  title,
}: ShambaListProps<T>) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMore || !hasMore || !sentinelRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        loadMore();
      }
    });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore, hasMore, items.length]);

  return (
    <section className="shamba-list">
      <header className="shamba-list__header">
        {title && <h2>{title}</h2>}
        <div className="shamba-list__actions">
          {filters}
          {onRefresh && (
            <button className="btn btn-outline" onClick={onRefresh} type="button">
              Refresh
            </button>
          )}
        </div>
      </header>
      {loading && <ShambaLoader compact message="Fetching latest data..." />}
      {!loading && items.length === 0 && (emptyComponent ?? <p className="empty">No records yet.</p>)}
      <div className="shamba-list__content">
        {items.map((item, index) => (
          <div key={keyExtractor(item, index)} className="shamba-list__item">
            {renderItem(item, index)}
          </div>
        ))}
        {hasMore && <div ref={sentinelRef} aria-hidden />}
      </div>
    </section>
  );
}

/* ---------------------------------- Map ------------------------------------ */
export type MarkerType = "farmer" | "market" | "agent" | "risk";

export interface ShambaMarker {
  id: string;
  position: [number, number];
  title: string;
  type: MarkerType;
}

export interface ShambaMapProps {
  center: [number, number];
  zoom: number;
  markers?: ShambaMarker[];
  onMarkerClick?: (markerId: string) => void;
  drawingMode?: boolean;
  onDrawComplete?: (coordinates: [number, number][]) => void;
}

export const ShambaMap: React.FC<ShambaMapProps> = ({
  center,
  zoom,
  markers = [],
  onMarkerClick,
  drawingMode,
  onDrawComplete,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [drawCoords, setDrawCoords] = useState<[number, number][]>([]);
  const drawCoordsRef = useRef<[number, number][]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: center as LngLatLike,
      zoom,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current.addControl(new mapboxgl.ScaleControl({ maxWidth: 150 }), "bottom-right");
  }, []);

  useEffect(() => {
    mapRef.current?.flyTo({ center: center as LngLatLike, zoom, duration: 1000 });
  }, [center[0], center[1], zoom]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const markerInstances: mapboxgl.Marker[] = [];

    markers.forEach((marker) => {
      const el = document.createElement("button");
      el.className = clsx("shamba-map__marker", `marker-${marker.type}`);
      el.setAttribute("aria-label", marker.title);
      el.innerHTML = marker.title.charAt(0).toUpperCase();
      el.onclick = () => onMarkerClick?.(marker.id);

      markerInstances.push(
        new mapboxgl.Marker({ element: el })
          .setLngLat(marker.position as LngLatLike)
          .addTo(map)
      );
    });

    return () => {
      markerInstances.forEach((m) => m.remove());
    };
  }, [JSON.stringify(markers), onMarkerClick]);

  useEffect(() => {
    drawCoordsRef.current = drawCoords;
  }, [drawCoords]);

  useEffect(() => {
    if (!drawingMode || !mapRef.current) return;
    const map = mapRef.current;

    const handleClick = (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
      const coords: [number, number] = [event.lngLat.lng, event.lngLat.lat];
      setDrawCoords((prev) => [...prev, coords]);
    };

    const handleDblClick = () => {
      if (drawCoordsRef.current.length && onDrawComplete) {
        onDrawComplete(drawCoordsRef.current);
      }
      setDrawCoords([]);
    };

    map.on("click", handleClick);
    map.on("dblclick", handleDblClick);

    return () => {
      map.off("click", handleClick);
      map.off("dblclick", handleDblClick);
    };
  }, [drawingMode, onDrawComplete]);

  const totalDistance = useMemo(() => {
    if (drawCoords.length < 2) return 0;
    return drawCoords.slice(1).reduce((acc, coord, index) => {
      const prev = drawCoords[index];
      return acc + haversine(prev, coord);
    }, 0);
  }, [drawCoords]);

  return (
    <div className="shamba-map">
      <div ref={mapContainerRef} className="shamba-map__canvas" />
      {drawingMode && drawCoords.length > 0 && (
        <div className="shamba-map__drawer">
          <p>Points: {drawCoords.length}</p>
          <p>Total distance: {totalDistance.toFixed(2)} km</p>
        </div>
      )}
    </div>
  );
};

function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371; // Earth radius km
  const dLat = degToRad(b[1] - a[1]);
  const dLon = degToRad(b[0] - a[0]);
  const lat1 = degToRad(a[1]);
  const lat2 = degToRad(b[1]);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

function degToRad(value: number) {
  return (value * Math.PI) / 180;
}

/* ---------------------------- Helper Components ----------------------------- */
export const ShambaLoader: React.FC<{ message?: string; compact?: boolean }> = ({
  message = "Loading...",
  compact,
}) => (
  <div className={clsx("shamba-loader", { compact })} role="status" aria-live="polite">
    <span className="spinner" aria-hidden />
    <span>{message}</span>
  </div>
);

export const ShambaError: React.FC<{ error: string }> = ({ error }) => (
  <div className="shamba-error" role="alert">
    <strong>Something went wrong.</strong>
    <p>{error}</p>
    <button type="button" className="btn btn-outline" onClick={() => window.location.reload()}>
      Retry
    </button>
  </div>
);

export const ShambaToast: React.FC<{ message?: string; type?: "success" | "error" | "info" }> = ({
  message,
  type = "info",
}) => {
  const [visible, setVisible] = useState(Boolean(message));
  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!visible || !message) return null;
  return (
    <div className={clsx("shamba-toast", type)}>
      <span>{message}</span>
      <button onClick={() => setVisible(false)} aria-label="Dismiss toast">
        ×
      </button>
    </div>
  );
};
