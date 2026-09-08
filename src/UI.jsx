import { ChevronRight } from "lucide-react";
import { formatFCFA } from "./theme";

export function MetricCard({ label, amount, icon: Icon, onClick, big, span2 }) {
  return (
    <button
      onClick={onClick}
      className={`metric-card${onClick ? " clickable" : ""}${span2 ? " span-2" : ""}`}
    >
      <div className="metric-card__top">
        <div className="metric-card__icon">
          <Icon size={17} color="#22d3ee" />
        </div>
        {onClick && <ChevronRight size={16} color="#7c93a8" />}
      </div>
      <p className="metric-card__label">{label}</p>
      <p className={`metric-card__value${big ? " big" : ""}`}>{formatFCFA(amount)}</p>
    </button>
  );
}

export function PanelHeader({ title, action }) {
  return (
    <div className="panel__header">
      <p className="panel__title">{title}</p>
      {action}
    </div>
  );
}
