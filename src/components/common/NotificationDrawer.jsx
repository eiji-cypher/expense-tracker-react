import { useState } from "react";
import { IconTransferArrow, IconBell } from "./Icons.jsx";

export default function NotificationDrawer({
  isOpen,
  onClose,
  activities = [],
  onSelectActivity,
  onClear,
}) {
  const [filter, setFilter] = useState("all");

  if (!isOpen) return null;

  const filtered = activities.filter((act) => {
    if (filter === "income") return act.type === "income";
    if (filter === "expense") return act.type === "expense";
    if (filter === "modified") return act.type === "edit" || act.type === "delete";
    return true;
  });

  const getEventBadge = (type) => {
    switch (type) {
      case "income":
        return <span className="notif-tag income">Income</span>;
      case "expense":
        return <span className="notif-tag expense">Expense</span>;
      case "edit":
        return <span className="notif-tag edit">Modified</span>;
      case "delete":
        return <span className="notif-tag delete">Removed</span>;
      default:
        return <span className="notif-tag edit">Activity</span>;
    }
  };

  const getEventIcon = (type) => {
    if (type === "income") {
      return (
        <div className="notif-icon-circle income">
          <IconTransferArrow isIncome={true} />
        </div>
      );
    }
    if (type === "expense") {
      return (
        <div className="notif-icon-circle expense">
          <IconTransferArrow isIncome={false} />
        </div>
      );
    }
    if (type === "edit") {
      return <div className="notif-icon-circle edit">✎</div>;
    }
    return <div className="notif-icon-circle delete">✕</div>;
  };

  return (
    <div className="backdrop-neo notif-backdrop" onClick={onClose}>
      <aside
        className="notif-drawer-neo"
        role="dialog"
        aria-label="Transaction Activity Notifications"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="notif-drawer-header">
          <div className="notif-header-left">
            <div className="notif-bell-icon">
              <IconBell />
            </div>
            <div className="notif-title-group">
              <h2 className="notif-title">Transaction Activity</h2>
              <span className="notif-subtitle">{activities.length} CRUD Events Recorded</span>
            </div>
          </div>

          <div className="notif-header-actions">
            {activities.length > 0 && (
              <button
                type="button"
                className="notif-clear-btn"
                onClick={onClear}
                title="Clear activity log"
              >
                Clear Log
              </button>
            )}
            <button
              type="button"
              className="notif-close-btn"
              onClick={onClose}
              aria-label="Close activity log"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="notif-tabs-bar" role="tablist">
          <button
            type="button"
            className={`notif-tab-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({activities.length})
          </button>
          <button
            type="button"
            className={`notif-tab-btn ${filter === "income" ? "active" : ""}`}
            onClick={() => setFilter("income")}
          >
            Income
          </button>
          <button
            type="button"
            className={`notif-tab-btn ${filter === "expense" ? "active" : ""}`}
            onClick={() => setFilter("expense")}
          >
            Expenses
          </button>
          <button
            type="button"
            className={`notif-tab-btn ${filter === "modified" ? "active" : ""}`}
            onClick={() => setFilter("modified")}
          >
            Edits/Deletes
          </button>
        </div>

        <div className="notif-list-body">
          {filtered.length === 0 ? (
            <div className="notif-empty-state">
              <span className="empty-bell-icon">🔔</span>
              <p className="empty-title">No CRUD events yet</p>
              <p className="empty-desc">
                When you create, edit, or delete transactions, immediate logs will appear here.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="notif-item-card"
                role="button"
                tabIndex={0}
                onClick={() => onSelectActivity && onSelectActivity(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectActivity && onSelectActivity(item);
                  }
                }}
                title={item.targetView === "deleted" ? "View in Recently Deleted" : "View in Transactions"}
              >
                <div className="notif-item-left">
                  {getEventIcon(item.type)}
                </div>

                <div className="notif-item-center">
                  <div className="notif-item-title-row">
                    <strong className="notif-item-title">{item.title}</strong>
                    {getEventBadge(item.type)}
                  </div>

                  <p className="notif-item-desc">{item.description}</p>
                  <span className="notif-item-time">{item.displayTime}</span>
                </div>

                <div className="notif-item-arrow" aria-hidden="true">
                  ›
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
