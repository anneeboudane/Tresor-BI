import { useState } from "react";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { formatFCFA } from "./theme";

/**
 * Recursive drill-down panel.
 * `root` is a node: { name, amount, children?: [node, ...] }.
 * Clicking a child with its own children pushes it onto the path (going one level deeper).
 * Breadcrumb lets the user jump back to any previous level; `onClose` collapses the panel entirely.
 */
export default function DrillDown({ root, onClose }) {
  const [path, setPath] = useState([root]);
  const current = path[path.length - 1];
  const canGoBack = path.length > 1;

  const goTo = (index) => setPath(path.slice(0, index + 1));
  const goBack = () => canGoBack && setPath(path.slice(0, -1));
  const drillInto = (child) => {
    if (child.children && child.children.length > 0) {
      setPath([...path, child]);
    }
  };

  return (
    <div className="panel panel--highlight">
      <div className="panel__header">
        <div className="breadcrumb">
          {canGoBack && (
            <button className="breadcrumb__back" onClick={goBack} aria-label="Retour">
              <ChevronLeft size={14} />
            </button>
          )}
          {path.map((node, i) => (
            <span key={i} className="breadcrumb__item">
              {i > 0 && <span className="breadcrumb__sep">/</span>}
              <button
                className={`breadcrumb__crumb${i === path.length - 1 ? " current" : ""}`}
                onClick={() => goTo(i)}
                disabled={i === path.length - 1}
              >
                {node.name}
              </button>
            </span>
          ))}
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Fermer">
          <X size={16} />
        </button>
      </div>

      <div className="drilldown__total">
        <span>Total — {current.name}</span>
        <span className="drilldown__total-amount">{formatFCFA(current.amount)}</span>
      </div>

      {current.children && current.children.length > 0 ? (
        current.children.map((child) => {
          const hasChildren = child.children && child.children.length > 0;
          return (
            <button
              key={child.name}
              className={`breakdown-row breakdown-row--btn${hasChildren ? "" : " leaf"}`}
              onClick={() => drillInto(child)}
              disabled={!hasChildren}
            >
              <span className="breakdown-row__name">{child.name}</span>
              <span className="breakdown-row__right">
                <span className="breakdown-row__amount">{formatFCFA(child.amount)}</span>
                {hasChildren && <ChevronRight size={15} />}
              </span>
            </button>
          );
        })
      ) : (
        <p className="placeholder-page">Aucune sous-entité — niveau le plus détaillé atteint.</p>
      )}
    </div>
  );
}
