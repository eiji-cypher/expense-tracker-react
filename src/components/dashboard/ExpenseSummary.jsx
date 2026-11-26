import { formatMoney } from "../../utils/format.js";
import { IconShoppingBag, IconArrowDown } from "../common/Icons.jsx";

export default function ExpenseSummary({ summary }) {
  const isPositive = summary.balance > 0;
  const isNegative = summary.balance < 0;

  return (
    <section className="summary-cards-container">
      <div className="summary-pill-card balance">
        <div className="card-top-row">
          <span className="card-label">Total Balance</span>
          <span className="currency-pill">PHP</span>
        </div>
        <strong className="card-main-value">{formatMoney(summary.balance)}</strong>
        <div className={`card-trend-badge ${isPositive ? "positive" : isNegative ? "negative" : ""}`}>
          <span>{isPositive ? "+ Net Positive" : isNegative ? "− Deficit" : "₱0.00"}</span>
        </div>
      </div>

      <div className="summary-pill-card spend">
        <div className="card-top-row">
          <span className="card-label">Total Expense</span>
          <div className="card-icon-dark">
            <IconShoppingBag />
          </div>
        </div>
        <strong className="card-main-value">{formatMoney(summary.expense)}</strong>
        <div className="card-trend-badge negative">
          <span>Total Outflow</span>
        </div>
      </div>

      <div className="summary-pill-card income">
        <div className="card-top-row">
          <span className="card-label">Total Income</span>
          <div className="card-icon-dark">
            <IconArrowDown />
          </div>
        </div>
        <strong className="card-main-value">{formatMoney(summary.income)}</strong>
      </div>
    </section>
  );
}
