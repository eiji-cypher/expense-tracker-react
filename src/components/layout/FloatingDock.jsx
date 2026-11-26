import { VIEWS } from "../../models/constants.js";
import {
  IconHome,
  IconWallet,
  IconStarPlus,
  IconWave,
  IconTrash,
} from "../common/Icons.jsx";

export default function FloatingDock({ view, onChange, onQuickAdd, deletedCount = 0 }) {
  return (
    <div className="floating-dock-wrapper">
      <nav className="floating-dock" aria-label="Main Navigation">
        <button
          type="button"
          className={`dock-btn ${view === VIEWS.DASHBOARD ? "active" : ""}`}
          onClick={() => onChange(VIEWS.DASHBOARD)}
          title="Dashboard"
          aria-label="Dashboard"
        >
          <IconHome />
        </button>

        <button
          type="button"
          className={`dock-btn ${view === VIEWS.HISTORY ? "active" : ""}`}
          onClick={() => onChange(VIEWS.HISTORY)}
          title="Transactions"
          aria-label="Transactions"
        >
          <IconWallet />
        </button>

        <button
          type="button"
          className="dock-action-chrome-btn"
          onClick={onQuickAdd}
          title="Add Transaction"
          aria-label="Add Transaction"
        >
          <div className="chrome-reflection-highlight" />
          <IconStarPlus />
        </button>

        <button
          type="button"
          className={`dock-btn ${view === VIEWS.ANALYTICS ? "active" : ""}`}
          onClick={() => onChange(VIEWS.ANALYTICS)}
          title="Analytics"
          aria-label="Analytics"
        >
          <IconWave />
        </button>

        <button
          type="button"
          className={`dock-btn ${view === VIEWS.DELETED ? "active" : ""}`}
          onClick={() => onChange(VIEWS.DELETED)}
          title="Recently Deleted"
          aria-label="Recently Deleted"
        >
          <div className="dock-icon-rel">
            <IconTrash />
            {deletedCount > 0 && <span className="dock-badge-dot" />}
          </div>
        </button>
      </nav>
      <div className="mobile-home-indicator" />
    </div>
  );
}
