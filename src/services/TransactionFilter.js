export class TransactionFilter {
  static ALL = "All";
  constructor({ search = "", category = TransactionFilter.ALL, type = TransactionFilter.ALL } = {}) {
    this.search = search.trim().toLowerCase();
    this.category = category;
    this.type = type;
  }
  matches(t) {
    const all = TransactionFilter.ALL;
    if (this.category !== all && t.category !== this.category) return false;
    if (this.type !== all && t.type !== this.type) return false;
    if (!this.search) return true;
    return `${t.description} ${t.category} ${t.amount}`.toLowerCase().includes(this.search);
  }
  apply(transactions) {
    return transactions.filter((t) => this.matches(t)).sort((a, b) => b.date.localeCompare(a.date));
  }
}
