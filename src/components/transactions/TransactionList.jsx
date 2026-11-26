import { formatMoney, formatDate } from "../../utils/format.js";
import { IconTransferArrow } from "../common/Icons.jsx";

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  emptyText,
}) {
  if (!transactions.length) {
    return (
      <div className="empty-state-box">
        <div className="empty-icon-circle">∅</div>
        <p className="empty-text">
          {emptyText ?? "No transactions yet. Add your first one to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="transaction-list-wrap">
      <div className="transaction-cards-grid">
        {transactions.map((t) => (
          <div key={t.id} className="transaction-card-neo">
            <div className={`tx-icon-circle ${t.isIncome() ? "income" : "expense"}`}>
              <IconTransferArrow isIncome={t.isIncome()} />
            </div>

            <div className="tx-details">
              <span className="tx-title">{t.description || t.category}</span>
              <span className="tx-subtitle">
                <span className="tx-cat-chip">{t.category}</span> · {formatDate(t.date)}
              </span>
            </div>

            <div className="tx-amount-col">
              <span className={`tx-amount ${t.isIncome() ? "income" : "expense"}`}>
                {t.isIncome() ? "+" : "−"}{formatMoney(t.amount)}
              </span>
              <span className="tx-time">12:11 PM</span>
            </div>

            <div className="tx-quick-actions">
              <button
                type="button"
                className="btn-action-pill edit"
                onClick={() => onEdit(t)}
                title="Edit transaction"
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-action-pill danger"
                onClick={() => onDelete(t)}
                title="Delete transaction"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
