import { VIEWS } from "../../models/constants.js";
import {
  IconHome,
  IconWave,
  IconWallet,
  IconTrash,
} from "../common/Icons.jsx";

const NAV_ITEMS = [
  { id: VIEWS.DASHBOARD, label: "Dashboard", icon: IconHome },
  { id: VIEWS.ANALYTICS, label: "Analytics", icon: IconWave },
  { id: VIEWS.HISTORY, label: "Transactions", icon: IconWallet },
  { id: VIEWS.DELETED, label: "Recently Deleted", icon: IconTrash, isTrash: true },
];

export default function Sidebar({
  view,
  onChange,
  userName,
  onEditName,
  deletedCount = 0,
}) {
  return (
    <aside className="web-sidebar">
      <nav className="sidebar-nav" aria-label="Web Navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-btn ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onChange(item.id)}
            >
              <span className="btn-icon">
                <Icon />
              </span>
              <span className="btn-text">{item.label}</span>
              {item.isTrash && deletedCount > 0 && (
                <span className="sidebar-nav-badge warning">{deletedCount}</span>
              )}
              {isActive && <div className="active-pill-dot" />}
            </button>
          );
        })}
      </nav>

      {userName && (
        <div className="sidebar-user-card" onClick={onEditName} title="Change Display Name">
          <div className="user-avatar-circle">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="user-text-meta">
            <span className="user-name">{userName}</span>
            <span className="user-email">Account Owner</span>
          </div>
          <button
            type="button"
            className="user-logout-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEditName();
            }}
            title="Change Your Name"
            aria-label="Change Your Name"
          >
            ✎
          </button>
        </div>
      )}
    </aside>
  );
}
