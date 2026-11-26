export class BudgetCalculator {
  static summarize(transactions) {
    const income = transactions.filter((t) => t.isIncome()).reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter((t) => t.isExpense()).reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }
}
