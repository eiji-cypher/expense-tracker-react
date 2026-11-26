import { LocalStorageService } from "./StorageService.js";
import { formatMoney } from "../utils/format.js";

const ACTIVITY_KEY = "eijidev-budget-pocket.crud_activities.v1";

export class ActivityLogService {
  #storage;
  #key;

  constructor(storageService = new LocalStorageService(), key = ACTIVITY_KEY) {
    this.#storage = storageService;
    this.#key = key;
    this.#purgeLegacy();
  }

  #purgeLegacy() {
    try {
      if (typeof localStorage !== "undefined") {
        const legacy = [
          "eijidev.budget_pocket.activities",
          "pocket-ledger.activities",
          "eijidev-budget-pocket.activities.v3",
          "eijidev-budget-pocket.activities.v4",
          "eijidev-budget-pocket.activities.v5",
        ];
        for (const k of legacy) {
          localStorage.removeItem(k);
        }
      }
    } catch {}
  }

  getAll() {
    this.#purgeLegacy();
    let list = this.#storage.read(this.#key, null);
    if (list === null) {
      list = [];
      this.#storage.write(this.#key, list);
    }
    return list.filter(
      (item) =>
        item &&
        item.type !== "system" &&
        item.type !== "auth" &&
        !/^act-[1-6]$/.test(item.id) &&
        !String(item.id).startsWith("seed")
    );
  }

  logTransactionAdd(transaction) {
    const isIncome = transaction.isIncome ? transaction.isIncome() : transaction.type === "Income";
    const item = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: isIncome ? "income" : "expense",
      title: isIncome ? "New Income Recorded" : "New Expense Recorded",
      description: `${transaction.description || transaction.category} (${isIncome ? "+" : "−"}${formatMoney(transaction.amount)}) in ${transaction.category}`,
      amount: transaction.amount,
      category: transaction.category,
      timestamp: new Date().toISOString(),
      displayTime: "Just now",
      targetView: "history",
    };
    this.#prepend(item);
    return item;
  }

  logTransactionUpdate(transaction) {
    const isIncome = transaction.isIncome ? transaction.isIncome() : transaction.type === "Income";
    const item = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: "edit",
      title: "Transaction Updated",
      description: `Modified ${transaction.description || transaction.category} (${formatMoney(transaction.amount)})`,
      amount: transaction.amount,
      category: transaction.category,
      timestamp: new Date().toISOString(),
      displayTime: "Just now",
      targetView: "history",
    };
    this.#prepend(item);
    return item;
  }

  logTransactionDelete(transaction) {
    const item = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: "delete",
      title: "Moved to Recently Deleted",
      description: `${transaction.category} (${formatMoney(transaction.amount)}) placed in trash`,
      amount: transaction.amount,
      category: transaction.category,
      timestamp: new Date().toISOString(),
      displayTime: "Just now",
      targetView: "deleted",
    };
    this.#prepend(item);
    return item;
  }

  logTransactionRestore(transaction) {
    const item = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: "income",
      title: "Transaction Restored",
      description: `Restored ${transaction.category} (${formatMoney(transaction.amount)}) back to active records`,
      amount: transaction.amount,
      category: transaction.category,
      timestamp: new Date().toISOString(),
      displayTime: "Just now",
      targetView: "history",
    };
    this.#prepend(item);
    return item;
  }

  logTransactionPurge(transaction) {
    const item = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: "delete",
      title: "Permanently Deleted",
      description: `${transaction.category} (${formatMoney(transaction.amount)}) purged from system`,
      amount: transaction.amount,
      category: transaction.category,
      timestamp: new Date().toISOString(),
      displayTime: "Just now",
      targetView: "deleted",
    };
    this.#prepend(item);
    return item;
  }

  #prepend(item) {
    const list = this.getAll();
    const updated = [item, ...list].slice(0, 50);
    this.#storage.write(this.#key, updated);
  }

  clear() {
    this.#storage.write(this.#key, []);
  }
}
