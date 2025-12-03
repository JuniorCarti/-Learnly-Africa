import React, { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap, LngLatLike } from "mapbox-gl";
import clsx from "clsx";
import { ShambaMarker } from "../templates";
import "mapbox-gl/dist/mapbox-gl.css";
import "../../styles/dashboard.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN ?? "";

export interface MapViewProps {
  center: [number, number];
  zoom: number;
  markers?: ShambaMarker[];
  layers?: { id: string; label: string; style: string }[];
  onMarkerClick?: (markerId: string) => void;
  enableDrawing?: boolean;
  onDrawComplete?: (coordinates: [number, number][]) => void;
}

const DEFAULT_LAYERS: MapViewProps["layers"] = [
  { id: "light", label: "Roads", style: "mapbox://styles/mapbox/light-v11" },
  { id: "satellite", label: "Satellite", style: "mapbox://styles/mapbox/satellite-streets-v12" },
  { id: "terrain", label: "Terrain", style: "mapbox://styles/mapbox/outdoors-v12" },
];

export const MapView: React.FC<MapViewProps> = ({
  center,
  zoom,
  markers = [],
  layers = DEFAULT_LAYERS,
  onMarkerClick,
  enableDrawing,
  onDrawComplete,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [activeLayer, setActiveLayer] = useState(layers[0]);
  const [drawCoords, setDrawCoords] = useState<[number, number][]>([]);
  const drawCoordsRef = useRef<[number, number][]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: activeLayer.style,
      center: center as LngLatLike,
      zoom,
    });
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(activeLayer.style);
  }, [activeLayer]);

  useEffect(() => {
    mapRef.current?.flyTo({ center: center as LngLatLike, zoom, speed: 0.8 });
  }, [center[0], center[1], zoom]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const instances: mapboxgl.Marker[] = [];

    markers.forEach((marker) => {
      const el = document.createElement("div");
      el.className = clsx("dashboard-marker", marker.type);
      el.innerHTML = marker.title.slice(0, 2).toUpperCase();
      el.onclick = () => onMarkerClick?.(marker.id);
      instances.push(new mapboxgl.Marker({ element: el }).setLngLat(marker.position as LngLatLike).addTo(map));
    });

    return () => instances.forEach((item) => item.remove());
  }, [JSON.stringify(markers), onMarkerClick]);

  useEffect(() => {
    drawCoordsRef.current = drawCoords;
  }, [drawCoords]);

  useEffect(() => {
    if (!enableDrawing || !mapRef.current) return;
    const map = mapRef.current;

    const onClick = (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
      const coords: [number, number] = [event.lngLat.lng, event.lngLat.lat];
      setDrawCoords((prev) => [...prev, coords]);
    };

    const onFinish = () => {
      if (drawCoordsRef.current.length && onDrawComplete) {
        onDrawComplete(drawCoordsRef.current);
      }
      setDrawCoords([]);
    };

    map.on("click", onClick);
    map.on("contextmenu", onFinish);

    return () => {
      map.off("click", onClick);
      map.off("contextmenu", onFinish);
    };
  }, [enableDrawing, onDrawComplete]);

  const measurement = useMemo(() => {
    if (drawCoords.length < 2) return 0;
    return drawCoords.slice(1).reduce((acc, point, index) => acc + haversine(drawCoords[index], point), 0);
  }, [drawCoords]);

  return (
    <section className="map-view">
      <div className="map-view__toolbar">
        <div className="layer-switch">
          {layers.map((layer) => (
            <button
              key={layer.id}
              className={clsx(activeLayer.id === layer.id && "active")}
              onClick={() => setActiveLayer(layer)}
              type="button"
            >
              {layer.label}
            </button>
          ))}
        </div>
        {enableDrawing && drawCoords.length > 0 && (
          <span className="distance-chip">{measurement.toFixed(2)} km</span>
        )}
      </div>
      <div ref={mapContainerRef} className="map-view__canvas" />
    </section>
  );
};

function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371;
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
