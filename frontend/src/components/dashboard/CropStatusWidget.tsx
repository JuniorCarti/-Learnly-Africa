import React, { useMemo } from "react";
import clsx from "clsx";
import { format, differenceInDays } from "date-fns";
import "../../styles/dashboard.css";

export interface CropIssue {
  id: string;
  label: string;
  severity: "low" | "medium" | "high";
}

export interface CropStatusWidgetProps {
  cropType: string;
  plantingDate: string;
  growthStage: "seedling" | "vegetative" | "flowering" | "tasseling" | "harvest";
  healthScore: number; // 0-100
  issues?: CropIssue[];
  acreage?: number;
  quickActions?: {
    onAddPhoto?: () => void;
    onRequestVisit?: () => void;
    onMarkHarvested?: () => void;
  };
}

const stageProgress: Record<CropStatusWidgetProps["growthStage"], number> = {
  seedling: 0.2,
  vegetative: 0.45,
  flowering: 0.65,
  tasseling: 0.85,
  harvest: 1,
};

export const CropStatusWidget: React.FC<CropStatusWidgetProps> = ({
  cropType,
  plantingDate,
  growthStage,
  healthScore,
  issues = [],
  acreage,
  quickActions,
}) => {
  const progress = stageProgress[growthStage];
  const healthColor = healthScore >= 75 ? "good" : healthScore >= 40 ? "warning" : "critical";
  const daysSincePlanting = differenceInDays(new Date(), new Date(plantingDate));

  return (
    <section className="crop-widget">
      <header>
        <div>
          <h3>{cropType}</h3>
          <p>Planted {format(new Date(plantingDate), "dd MMM yyyy")}</p>
          {acreage && <small>{acreage} acres</small>}
        </div>
        <span className={clsx("health-chip", healthColor)}>Health {healthScore}%</span>
      </header>

      <div className="progress-track">
        <div className="progress-bar" style={{ width: `${progress * 100}%` }} />
        <span className="progress-label">Stage: {growthStage}</span>
      </div>

      <div className="stats-grid">
        <div>
          <p className="stat-label">Days since planting</p>
          <p className="stat-value">{daysSincePlanting}</p>
        </div>
        <div>
          <p className="stat-label">Issues</p>
          <p className="stat-value">{issues.length}</p>
        </div>
      </div>

      {issues.length > 0 && (
        <ul className="issue-list">
          {issues.map((issue) => (
            <li key={issue.id} className={clsx("issue", issue.severity)}>
              <span>{issue.label}</span>
              <span>{issue.severity.toUpperCase()}</span>
            </li>
          ))}
        </ul>
      )}

      <footer className="crop-widget__actions">
        <button className="btn btn-outline" type="button" onClick={quickActions?.onAddPhoto}>
          Add Photo
        </button>
        <button className="btn btn-outline" type="button" onClick={quickActions?.onRequestVisit}>
          Request Visit
        </button>
        <button className="btn btn-primary" type="button" onClick={quickActions?.onMarkHarvested}>
          Mark Harvested
        </button>
      </footer>
    </section>
  );
};
