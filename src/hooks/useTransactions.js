import { useState, useEffect, useCallback } from "react";
import { Transaction } from "../models/Transaction.js";

export function useTransactions(repository) {
  const [transactions, setTransactions] = useState(() => repository.getAll());
  const [deletedTransactions, setDeletedTransactions] = useState(() => repository.getDeleted());

  useEffect(() => {
    repository.saveAll(transactions);
  }, [transactions, repository]);

  useEffect(() => {
    repository.saveDeleted(deletedTransactions);
  }, [deletedTransactions, repository]);

  const add = useCallback((data) => {
    const item = new Transaction(data);
    setTransactions((prev) => [item, ...prev]);
    return item;
  }, []);

  const update = useCallback((id, data) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? t.with(data) : t))
    );
  }, []);

  const remove = useCallback((id) => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return null;

    const deletedRecord = {
      ...target.toJSON(),
      deletedAt: new Date().toISOString(),
    };

    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setDeletedTransactions((prev) => [deletedRecord, ...prev]);
    return target;
  }, [transactions]);

  const restore = useCallback((id) => {
    const target = deletedTransactions.find((t) => t.id === id);
    if (!target) return null;

    const { deletedAt, ...transactionData } = target;
    const restored = Transaction.fromJSON(transactionData);

    setDeletedTransactions((prev) => prev.filter((t) => t.id !== id));
    setTransactions((prev) => [restored, ...prev]);
    return restored;
  }, [deletedTransactions]);

  const purge = useCallback((id) => {
    const target = deletedTransactions.find((t) => t.id === id);
    setDeletedTransactions((prev) => prev.filter((t) => t.id !== id));
    return target;
  }, [deletedTransactions]);

  const clearAllDeleted = useCallback(() => {
    setDeletedTransactions([]);
  }, []);

  const clearAllRecords = useCallback(() => {
    setTransactions([]);
    setDeletedTransactions([]);
    repository.clearAll();
  }, [repository]);

  return {
    transactions,
    deletedTransactions,
    add,
    update,
    remove,
    restore,
    purge,
    clearAllDeleted,
    clearAllRecords,
  };
}
