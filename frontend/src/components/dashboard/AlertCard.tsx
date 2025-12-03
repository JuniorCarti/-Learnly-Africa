import React, { useMemo, useState } from "react";
import clsx from "clsx";
import "../../styles/dashboard.css";

export type AlertSeverity = "urgent" | "warning" | "advisory" | "market";
export type AlertType = "climate" | "insurance" | "market" | "system";

export interface AlertAction {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
}

export interface AlertCardProps {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  details?: string;
  actions?: AlertAction[];
  onAcknowledge?: () => void;
  isAcknowledged?: boolean;
}

const severityConfig: Record<AlertSeverity, { label: string; color: string }> = {
  urgent: { label: "URGENT", color: "red" },
  warning: { label: "WARNING", color: "orange" },
  advisory: { label: "ADVISORY", color: "blue" },
  market: { label: "MARKET", color: "green" },
};

export const AlertCard: React.FC<AlertCardProps> = ({
  type,
  severity,
  title,
  message,
  timestamp,
  details,
  actions,
  onAcknowledge,
  isAcknowledged,
}) => {
  const [expanded, setExpanded] = useState(false);
  const badge = severityConfig[severity];

  const icon = useMemo(() => {
    switch (severity) {
      case "urgent":
        return "⚠️";
      case "warning":
        return "🟠";
      case "market":
        return "💰";
      default:
        return "ℹ️";
    }
  }, [severity]);

  return (
    <article
      className={clsx("alert-card", `severity-${badge.color}`, {
        acknowledged: isAcknowledged,
      })}
    >
      <header className="alert-card__header">
        <div>
          <span className="alert-card__icon" aria-hidden>
            {icon}
          </span>
          <span className="alert-card__badge">{badge.label}</span>
          <span className="alert-card__type">{type}</span>
        </div>
        <time>{timestamp}</time>
      </header>
      <h3>{title}</h3>
      <p className="alert-card__message">{message}</p>

      {details && (
        <button className="link" type="button" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? "Hide details" : "See details"}
        </button>
      )}

      {expanded && details && <p className="alert-card__details">{details}</p>}

      <footer className="alert-card__footer">
        <div className="alert-card__actions">
          {actions?.map((action) => (
            <button
              key={action.label}
              className={clsx("btn", action.variant === "ghost" && "btn-ghost", action.variant === "secondary" && "btn-outline")}
              type="button"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
          {onAcknowledge && !isAcknowledged && (
            <button className="btn btn-primary" onClick={onAcknowledge} type="button">
              Acknowledge
            </button>
          )}
          {isAcknowledged && <span className="acknowledged-pill">Acknowledged</span>}
        </div>
      </footer>
    </article>
  );
};
