import { formatMoney, formatDate } from "../../utils/format.js";
import { IconTrash, IconRestore, IconTransferArrow } from "../common/Icons.jsx";

export default function RecentlyDeletedView({
  deletedTransactions = [],
  onRestore,
  onPurge,
  onClearAll,
  onBack,
}) {
  return (
    <div className="recently-deleted-view">
      <div className="card-header-neo">
        <div className="card-header-title-group">
          <div className="title-with-badge">
            <IconTrash className="header-trash-icon" />
            <h2>Recently Deleted</h2>
            <span className="card-header-badge warning">
              {deletedTransactions.length} in Trash
            </span>
          </div>
          <p className="card-header-desc">
            Deleted transactions remain preserved here until permanently purged or restored.
          </p>
        </div>

        <div className="card-header-actions-row">
          {deletedTransactions.length > 0 && (
            <button
              type="button"
              className="btn-neo-danger small"
              onClick={onClearAll}
              title="Permanently remove all items in trash"
            >
              Empty Trash
            </button>
          )}
          {onBack && (
            <button
              type="button"
              className="btn-neo-secondary small"
              onClick={onBack}
            >
              ← Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {deletedTransactions.length === 0 ? (
        <div className="empty-state-box trash-empty">
          <div className="empty-icon-circle">🗑</div>
          <h3 className="empty-title">Trash is Clean & Empty</h3>
          <p className="empty-text">
            Any income or expense entries you delete from the active list will remain here for recovery until you choose to permanently erase them.
          </p>
        </div>
      ) : (
        <div className="deleted-items-grid">
          {deletedTransactions.map((item) => (
            <div key={item.id} className="deleted-item-card-neo">
              <div className="deleted-item-left">
                <div className={`tx-icon-circle ${item.type === "Income" ? "income" : "expense"}`}>
                  <IconTransferArrow isIncome={item.type === "Income"} />
                </div>
                <div className="deleted-item-meta">
                  <div className="deleted-item-title-row">
                    <strong className="deleted-item-title">
                      {item.description || item.category}
                    </strong>
                    <span className="deleted-category-pill">{item.category}</span>
                  </div>
                  <span className="deleted-date-sub">
                    Transaction Date: {formatDate(item.date)} · Deleted recently
                  </span>
                </div>
              </div>

              <div className="deleted-item-right">
                <div className="deleted-amount-col">
                  <span className={`tx-amount ${item.type === "Income" ? "income" : "expense"}`}>
                    {item.type === "Income" ? "+" : "−"}{formatMoney(item.amount)}
                  </span>
                  <span className="deleted-status-tag">Soft-Deleted</span>
                </div>

                <div className="deleted-actions-group">
                  <button
                    type="button"
                    className="btn-action-restore"
                    onClick={() => onRestore(item.id)}
                    title="Restore back to active transactions"
                  >
                    <IconRestore />
                    <span>Restore</span>
                  </button>
                  <button
                    type="button"
                    className="btn-action-purge"
                    onClick={() => onPurge(item.id)}
                    title="Permanently erase from system"
                  >
                    <IconTrash />
                    <span>Delete Forever</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

