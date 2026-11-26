import { VIEWS } from "../../models/constants.js";
import { formatMoney } from "../../utils/format.js";
import SplineChart from "./SplineChart.jsx";
import {
  IconPlus,
  IconTransferArrow,
} from "../common/Icons.jsx";

export default function DashboardScreen({
  summary,
  transactions = [],
  onNavigate,
  onOpenAdd,
  onEdit,
  onDelete,
}) {
  const recentList = transactions.slice(0, 5);

  return (
    <div className="dashboard-view-content">
      <section className="balance-section">
        <div className="balance-meta-row">
          <div className="balance-label-group">
            <span className="balance-label">Total Balance</span>
            <span className="currency-pill">PHP</span>
          </div>
          <div className="trend-badge-group">
            <span className={`trend-badge-pill ${summary.balance > 0 ? "positive" : summary.balance < 0 ? "negative" : ""}`}>
              {summary.balance > 0 ? "Active Balance" : summary.balance < 0 ? "Deficit" : "0 Records"}
            </span>
          </div>
        </div>
        <div className="balance-main-amount">
          {formatMoney(summary.balance)}
        </div>
        <div className="mobile-wallet-substats only-mobile">
          <div className="wallet-substat-pill income">
            <span className="substat-label">Inflow</span>
            <strong className="substat-val">+{formatMoney(summary.income)}</strong>
          </div>
          <div className="wallet-substat-pill expense">
            <span className="substat-label">Outflow</span>
            <strong className="substat-val">−{formatMoney(summary.expense)}</strong>
          </div>
        </div>
      </section>

      <section className="quick-actions-bar" aria-label="Quick Actions">
        <button
          type="button"
          className="quick-action-pill add-action"
          onClick={onOpenAdd}
        >
          <div className="action-icon-circle">
            <IconPlus />
          </div>
          <span className="action-label">Add Transaction</span>
        </button>
      </section>

      <section className="overviews-section">
        <div className="section-header-row">
          <div className="section-title-wrap">
            <h2 className="section-title">Overviews</h2>
            <span className="section-subtitle">Live Monthly Balance</span>
          </div>
          <button
            type="button"
            className="view-history-link"
            onClick={() => onNavigate(VIEWS.HISTORY)}
          >
            View History
          </button>
        </div>

        <SplineChart transactions={transactions} />
      </section>

      <section className="recent-activity-section">
        <div className="section-header-row">
          <div className="section-title-wrap">
            <h3 className="section-sub-title">Recent Activity</h3>
          </div>
        </div>
        <div className="activity-list">
          {recentList.length === 0 ? (
            <div className="empty-activity-card">
              <p>No transactions recorded yet.</p>
              <button
                type="button"
                className="btn-link"
                onClick={onOpenAdd}
              >
                + Add your first transaction
              </button>
            </div>
          ) : (
            recentList.map((t) => (
              <div key={t.id} className="transaction-card-neo">
                <div className={`tx-icon-circle ${t.isIncome() ? "income" : "expense"}`}>
                  <IconTransferArrow isIncome={t.isIncome()} />
                </div>
                <div className="tx-details">
                  <span className="tx-title">
                    {t.description || t.category}
                  </span>
                  <span className="tx-subtitle">
                    {t.description ? t.category : (t.isIncome() ? "Deposit" : "Payment")} · {t.date}
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
                    className="icon-mini-btn"
                    onClick={() => onEdit(t)}
                    title="Edit transaction"
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    className="icon-mini-btn danger"
                    onClick={() => onDelete(t)}
                    title="Delete transaction"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
