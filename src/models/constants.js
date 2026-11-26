export const TYPES = Object.freeze({ INCOME: "Income", EXPENSE: "Expense" });

export const EXPENSE_CATEGORIES = Object.freeze([
  "Food",
  "Rent",
  "Transport",
  "Utilities",
  "Leisure",
  "Others",
]);

export const INCOME_CATEGORIES = Object.freeze([
  "Salary",
  "Allowance",
  "Freelance",
  "Investment",
  "Bonus",
  "Others",
]);

export const CATEGORIES = Object.freeze([
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES.filter((c) => !EXPENSE_CATEGORIES.includes(c)),
]);

export const VIEWS = Object.freeze({
  DASHBOARD: "dashboard",
  ANALYTICS: "analytics",
  ADD: "add",
  HISTORY: "history",
  DELETED: "deleted",
});
