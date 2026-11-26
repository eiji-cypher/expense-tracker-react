# EijiDev Budget Pocket – Expense & Budget Tracker (React + Vite)

    npm install
    npm run dev

## Architecture
- `models/` – domain entities (`Transaction`: private fields, getters, validation, immutability)
- `services/` – business + persistence (`StorageService` → `LocalStorageService` / `MemoryStorageService`,
  `TransactionRepository`, `BudgetCalculator`, `TransactionFilter`)
- `hooks/` – React state glue (`useTransactions`, `useToast`)
- `components/` – presentational UI grouped by feature (layout, common, dashboard, transactions)
- `App.jsx` – owns lifted state and wires dependencies (composition root)
