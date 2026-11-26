import { Transaction } from "../models/Transaction.js";

export class TransactionRepository {
  #storage;
  #key;
  #deletedKey;

  constructor(
    storageService,
    key = "eijidev-budget-pocket.records.v5",
    deletedKey = "eijidev-budget-pocket.records.trash.v5"
  ) {
    this.#storage = storageService;
    this.#key = key;
    this.#deletedKey = deletedKey;
    this.purgeLegacySeeds();
  }

  purgeLegacySeeds() {
    try {
      if (typeof localStorage !== "undefined") {
        const legacyKeys = [
          "pocket-ledger.transactions",
          "pocket-ledger.deleted_transactions",
          "eijidev-budget-pocket.transactions",
          "eijidev-budget-pocket.deleted_transactions",
          "eijidev.budget_pocket.activities",
          "pocket-ledger.activities",
          "eijidev-budget-pocket.records.v3",
          "eijidev-budget-pocket.records.trash.v3",
          "eijidev-budget-pocket.records.v4",
          "eijidev-budget-pocket.records.trash.v4",
        ];
        for (const k of legacyKeys) {
          localStorage.removeItem(k);
        }
      }
    } catch {}
  }

  getAll() {
    this.purgeLegacySeeds();
    let rows = this.#storage.read(this.#key, null);
    if (rows === null) {
      rows = [];
      this.#storage.write(this.#key, rows);
    }
    return rows
      .filter((row) => row && !String(row.id).startsWith("seed"))
      .flatMap((row) => {
        try {
          return [Transaction.fromJSON(row)];
        } catch {
          return [];
        }
      });
  }

  saveAll(transactions) {
    this.#storage.write(this.#key, transactions.map((t) => t.toJSON()));
  }

  getDeleted() {
    const rows = this.#storage.read(this.#deletedKey, []);
    return (Array.isArray(rows) ? rows : []).filter(
      (row) => row && !String(row.id).startsWith("seed")
    );
  }

  saveDeleted(deletedTransactions) {
    this.#storage.write(this.#deletedKey, deletedTransactions);
  }

  clearAll() {
    this.#storage.write(this.#key, []);
    this.#storage.write(this.#deletedKey, []);
    this.purgeLegacySeeds();
  }
}
