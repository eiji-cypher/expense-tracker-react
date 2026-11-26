import { useState, useMemo } from "react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../../models/constants.js";
import { formatMoney } from "../../utils/format.js";
import WaveChart from "./WaveChart.jsx";
import {
  IconShoppingBag,
  IconArrowDown,
} from "../common/Icons.jsx";

export default function AnalyticsScreen({
  summary,
  transactions = [],
}) {
  const [activeTab, setActiveTab] = useState("Categories");
  const [distTab, setDistTab] = useState("Expense");

  const currentMonthLabel = useMemo(() => {
    return new Date().toLocaleString("en-US", { month: "short", year: "numeric" });
  }, []);

  const expenseStats = useMemo(() => {
    const expenses = transactions.filter(
      (t) => (t.isExpense ? t.isExpense() : t.type === "Expense")
    );
    const totalExp = expenses.reduce((s, t) => s + Number(t.amount || 0), 0);

    return EXPENSE_CATEGORIES.map((cat) => {
      const catTransactions = expenses.filter((t) => t.category === cat);
      const sum = catTransactions.reduce((s, t) => s + Number(t.amount || 0), 0);
      const percent = totalExp > 0 ? Math.round((sum / totalExp) * 100) : 0;
      return {
        category: cat,
        amount: sum,
        count: catTransactions.length,
        percent,
      };
    })
      .filter((item) => item.count > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const incomeStats = useMemo(() => {
    const incomes = transactions.filter(
      (t) => (t.isIncome ? t.isIncome() : t.type === "Income")
    );
    const totalInc = incomes.reduce((s, t) => s + Number(t.amount || 0), 0);

    return INCOME_CATEGORIES.map((cat) => {
      const catTransactions = incomes.filter((t) => t.category === cat);
      const sum = catTransactions.reduce((s, t) => s + Number(t.amount || 0), 0);
      const percent = totalInc > 0 ? Math.round((sum / totalInc) * 100) : 0;
      return {
        category: cat,
        amount: sum,
        count: catTransactions.length,
        percent,
      };
    })
      .filter((item) => item.count > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const expenseCount = transactions.filter(
    (t) => (t.isExpense ? t.isExpense() : t.type === "Expense")
  ).length;
  const incomeCount = transactions.filter(
    (t) => (t.isIncome ? t.isIncome() : t.type === "Income")
  ).length;

  const latestExpense = useMemo(() => {
    return transactions.find((t) => (t.isExpense ? t.isExpense() : t.type === "Expense"));
  }, [transactions]);

  const latestIncome = useMemo(() => {
    return transactions.find((t) => (t.isIncome ? t.isIncome() : t.type === "Income"));
  }, [transactions]);

  return (
    <div className="analytics-view-content">
      <div className="segmented-tabs-bar" role="tablist">
        {["Overviews", "Categories", "Budget"].map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`segmented-tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="spending-breakdown-section">
        <div className="breakdown-header-row">
          <h2 className="breakdown-title">Spending Breakdown</h2>
          <div className="period-dropdown-pill">
            <span>Year {new Date().getFullYear()}</span>
          </div>
        </div>

        <div className="breakdown-main-amount">
          −{formatMoney(summary.expense)}
        </div>

        <div className="breakdown-trend-row">
          <span className="trend-text">
            {expenseCount === 0
              ? "No expenses recorded this period"
              : `${expenseCount} ${expenseCount === 1 ? "expense" : "expenses"} recorded this period`}
          </span>
        </div>

        <WaveChart transactions={transactions} currentSpend={summary.expense} />
      </section>

      <section className="latest-metrics-section">
        <h3 className="sub-section-title">Latest Transaction</h3>
        <div className="metrics-dual-cards">
          <div className="metric-pill-card spend">
            <div className="metric-card-top">
              <span className="metric-card-label">Spend</span>
              <div className="metric-icon-badge">
                <IconShoppingBag />
              </div>
            </div>
            <div className="metric-card-value">
              {formatMoney(summary.expense, { compact: true })}
            </div>
            <div className="metric-card-sub">
              {latestExpense
                ? `${latestExpense.category} · ${latestExpense.date}`
                : `${expenseCount} Records`}
            </div>
          </div>

          <div className="metric-pill-card income">
            <div className="metric-card-top">
              <span className="metric-card-label">Income</span>
              <div className="metric-icon-badge">
                <IconArrowDown />
              </div>
            </div>
            <div className="metric-card-value">
              {formatMoney(summary.income, { compact: true })}
            </div>
            <div className="metric-card-sub">
              {latestIncome
                ? `${latestIncome.category} · ${latestIncome.date}`
                : `${incomeCount} Records`}
            </div>
          </div>
        </div>
      </section>

      {activeTab === "Categories" && (
        <section className="category-breakdown-list">
          <div className="cat-breakdown-header">
            <h3 className="sub-section-title">Categories Distribution</h3>

            <div className="cat-dist-subtabs-bar" role="tablist">
              <button
                type="button"
                className={`cat-dist-tab ${distTab === "Expense" ? "active expense" : ""}`}
                onClick={() => setDistTab("Expense")}
              >
                Expenses ({formatMoney(summary.expense)})
              </button>
              <button
                type="button"
                className={`cat-dist-tab ${distTab === "Income" ? "active income" : ""}`}
                onClick={() => setDistTab("Income")}
              >
                Income ({formatMoney(summary.income)})
              </button>
            </div>
          </div>

          {distTab === "Expense" && (
            <div className="cat-items-list">
              {expenseStats.length === 0 ? (
                <div className="empty-category-notice">
                  <p>No expenses recorded yet. Record an expense to see category spending.</p>
                </div>
              ) : (
                expenseStats.map((item) => (
                  <div key={item.category} className="cat-item-row">
                    <div className="cat-item-header">
                      <span className="cat-name">{item.category}</span>
                      <span className="cat-amount">{formatMoney(item.amount)}</span>
                    </div>
                    <div className="cat-progress-track">
                      <div
                        className="cat-progress-fill expense"
                        style={{ width: `${Math.max(item.percent, 8)}%` }}
                      />
                    </div>
                    <div className="cat-item-meta">
                      <span>
                        {item.count} {item.count === 1 ? "transaction" : "transactions"}
                      </span>
                      <span>{item.percent}% of expenses</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {distTab === "Income" && (
            <div className="cat-items-list">
              {incomeStats.length === 0 ? (
                <div className="empty-category-notice">
                  <p>No income recorded yet. Record an income entry to see source distribution.</p>
                </div>
              ) : (
                incomeStats.map((item) => (
                  <div key={item.category} className="cat-item-row">
                    <div className="cat-item-header">
                      <span className="cat-name">{item.category}</span>
                      <span className="cat-amount income">{formatMoney(item.amount)}</span>
                    </div>
                    <div className="cat-progress-track">
                      <div
                        className="cat-progress-fill income"
                        style={{ width: `${Math.max(item.percent, 8)}%` }}
                      />
                    </div>
                    <div className="cat-item-meta">
                      <span>
                        {item.count} {item.count === 1 ? "transaction" : "transactions"}
                      </span>
                      <span>{item.percent}% of income</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      )}

      {activeTab === "Budget" && (
        <section className="category-breakdown-list">
          <h3 className="sub-section-title">Monthly Budget Goals</h3>
          <div className="cat-items-list">
            <div className="cat-item-row">
              <div className="cat-item-header">
                <span className="cat-name">Monthly Cap</span>
                <span className="cat-amount">₱10,000.00</span>
              </div>
              <div className="cat-progress-track">
                <div
                  className="cat-progress-fill expense"
                  style={{
                    width: `${Math.min(Math.round((summary.expense / 10000) * 100), 100)}%`,
                  }}
                />
              </div>
              <div className="cat-item-meta">
                <span>Spent {formatMoney(summary.expense)}</span>
                <span>Remaining {formatMoney(Math.max(10000 - summary.expense, 0))}</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
