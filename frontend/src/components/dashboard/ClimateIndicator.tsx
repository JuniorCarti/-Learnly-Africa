import React from "react";
import clsx from "clsx";
import "../../styles/dashboard.css";

export type Trend = "up" | "down" | "stable";

export interface ClimateIndicatorProps {
  metricType: string;
  currentValue: number;
  unit?: string;
  threshold: number;
  trend: Trend;
  history: { label: string; value: number }[];
}

export const ClimateIndicator: React.FC<ClimateIndicatorProps> = ({
  metricType,
  currentValue,
  unit = "",
  threshold,
  trend,
  history,
}) => {
  const percent = Math.min(100, Math.round((currentValue / threshold) * 100));
  const trendSymbol = trend === "up" ? "▲" : trend === "down" ? "▼" : "➖";
  const thresholdState = currentValue >= threshold ? "warning" : "normal";

  return (
    <section className={clsx("climate-indicator", thresholdState)}>
      <header>
        <h3>{metricType}</h3>
        <span className="trend">
          {trendSymbol} {trend}
        </span>
      </header>
      <div className="gauge">
        <div className="gauge__fill" style={{ width: `${percent}%` }} />
        <span className="gauge__value">
          {currentValue}
          {unit}
        </span>
        <span className="gauge__threshold">Threshold: {threshold}</span>
      </div>
      <div className="history">
        {history.map((item) => (
          <div key={item.label}>
            <small>{item.label}</small>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};
