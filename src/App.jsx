import { useMemo, useState, useEffect } from "react";
import { VIEWS } from "./models/constants.js";
import { LocalStorageService } from "./services/StorageService.js";
import { TransactionRepository } from "./services/TransactionRepository.js";
import { BudgetCalculator } from "./services/BudgetCalculator.js";
import { TransactionFilter } from "./services/TransactionFilter.js";
import { ActivityLogService } from "./services/ActivityLogService.js";
import { useTransactions } from "./hooks/useTransactions.js";
import { useToast } from "./hooks/useToast.js";
import Sidebar from "./components/layout/Sidebar.jsx";
import ExpenseSummary from "./components/dashboard/ExpenseSummary.jsx";
import DashboardScreen from "./components/dashboard/DashboardScreen.jsx";
import AnalyticsScreen from "./components/analytics/AnalyticsScreen.jsx";
import TransactionForm from "./components/transactions/TransactionForm.jsx";
import TransactionList from "./components/transactions/TransactionList.jsx";
import RecentlyDeletedView from "./components/transactions/RecentlyDeletedView.jsx";
import FilterBar from "./components/transactions/FilterBar.jsx";
import NamePromptModal from "./components/onboarding/NamePromptModal.jsx";
import Modal from "./components/common/Modal.jsx";
import Toast from "./components/common/Toast.jsx";
import FloatingDock from "./components/layout/FloatingDock.jsx";
import NotificationDrawer from "./components/common/NotificationDrawer.jsx";
import { IconBell, IconTrash } from "./components/common/Icons.jsx";
import { formatMoney } from "./utils/format.js";

const storageService = new LocalStorageService();
const repository = new TransactionRepository(storageService);
const activityService = new ActivityLogService(storageService);

const GREETING_TEMPLATES = [
  "Budgeting like a pro, {name}!",
];

export default function App() {
  const {
    transactions,
    deletedTransactions,
    add,
    update,
    remove,
    restore,
    purge,
    clearAllDeleted,
    clearAllRecords,
  } = useTransactions(repository);

  const { toast, notify, dismiss } = useToast();

  const [userName, setUserName] = useState(() =>
    storageService.read("eijidev.user_name", "")
  );
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);

  const [activities, setActivities] = useState(() => activityService.getAll());
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [view, setView] = useState(VIEWS.DASHBOARD);
  const [filter, setFilter] = useState({ search: "", category: "All", type: "All" });
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const greeting = useMemo(() => {
    if (!userName) return "Welcome to EijiDev Pocket Budget";
    const index = userName.length % GREETING_TEMPLATES.length;
    return GREETING_TEMPLATES[index].replace("{name}", userName);
  }, [userName]);

  const summary = useMemo(() => BudgetCalculator.summarize(transactions), [transactions]);
  const visible = useMemo(() => new TransactionFilter(filter).apply(transactions), [transactions, filter]);

  const handleNameSubmit = (name) => {
    storageService.write("eijidev.user_name", name);
    setUserName(name);
    setIsEditNameOpen(false);
    notify(`Hey, ${name}! Welcome to budget tracker!`);
  };

  const onAdd = (data) => {
    const item = add(data);
    activityService.logTransactionAdd(item);
    setActivities(activityService.getAll());
    setIsAddModalOpen(false);
    notify("Transaction recorded successfully.");
  };

  const onUpdate = (data) => {
    update(editing.id, data);
    activityService.logTransactionUpdate({ ...editing.toJSON(), ...data });
    setActivities(activityService.getAll());
    setEditing(null);
    notify("Transaction updated.");
  };

  const onSoftDelete = () => {
    if (!deleting) return;
    const target = deleting;
    remove(target.id);
    activityService.logTransactionDelete(target);
    setActivities(activityService.getAll());
    setDeleting(null);
    notify(`Moved "${target.description || target.category}" to Recently Deleted.`, "warning");
  };

  const handleRestore = (id) => {
    const item = restore(id);
    if (item) {
      activityService.logTransactionRestore(item);
      setActivities(activityService.getAll());
      notify(`Restored "${item.description || item.category}" to active transactions.`);
    }
  };

  const handlePurge = (id) => {
    const item = purge(id);
    if (item) {
      activityService.logTransactionPurge(item);
      setActivities(activityService.getAll());
      notify(`Permanently deleted "${item.description || item.category}".`, "danger");
    }
  };

  const handleClearAllDeleted = () => {
    if (window.confirm("Are you sure you want to permanently empty the trash? This cannot be undone.")) {
      clearAllDeleted();
      notify("Recently deleted trash cleared.", "danger");
    }
  };

  const openQuickAdd = () => setIsAddModalOpen(true);

  return (
    <div className="web-app-root">
      {(!userName || isEditNameOpen) && (
        <NamePromptModal
          initialName={userName}
          onSubmit={handleNameSubmit}
          onCancel={userName ? () => setIsEditNameOpen(false) : undefined}
        />
      )}

      <header className="web-top-navbar">
        <div className="navbar-brand-section">
          <img
            src="/logo.png"
            alt="EijiDev Pocket Budget"
            className="navbar-logo-img"
          />
          <div className="navbar-titles">
            <h1 className="navbar-title">EijiDev Pocket Budget</h1>
            <span className="navbar-greeting-text">{greeting}</span>
          </div>
        </div>

        <div className="navbar-center-stats">
          <div className="nav-stat-chip">
            <span className="chip-label">Balance:</span>
            <strong className="chip-value">{formatMoney(summary.balance)}</strong>
          </div>
        </div>

        <div className="navbar-actions-section">
          <button
            type="button"
            className="navbar-icon-btn notif-trigger-btn"
            onClick={() => setIsNotifOpen(true)}
            title="System Activity & Notifications"
            aria-label="System Activity & Notifications"
          >
            <IconBell />
            {activities.length > 0 && <span className="notif-badge-dot" />}
          </button>
        </div>
      </header>

      <div className="web-main-container">
        <Sidebar
          view={view}
          onChange={setView}
          userName={userName}
          onEditName={() => setIsEditNameOpen(true)}
          deletedCount={deletedTransactions.length}
        />

        <main className="web-content-area">
          <ExpenseSummary summary={summary} />

          {view === VIEWS.DASHBOARD && (
            <div className="dashboard-composite-grid">
              <div className="grid-split-row">
                <section className="web-dashboard-card overviews-card">
                  <div className="card-header-neo">
                    <div className="card-header-title-group">
                      <h2>Balance & Overviews</h2>
                    </div>
                  </div>
                  <DashboardScreen
                    summary={summary}
                    transactions={transactions}
                    onNavigate={setView}
                    onOpenAdd={openQuickAdd}
                    onEdit={setEditing}
                    onDelete={setDeleting}
                  />
                </section>

                <section className="web-dashboard-card analytics-card">
                  <div className="card-header-neo">
                    <div className="card-header-title-group">
                      <h2>Analytics & Breakdown</h2>
                    </div>
                  </div>
                  <AnalyticsScreen
                    summary={summary}
                    transactions={transactions}
                  />
                </section>
              </div>

              <section className="web-dashboard-card history-card full-width">
                <div className="card-header-neo">
                  <div className="card-header-title-group">
                    <h2>Transaction History</h2>
                    <span className="card-header-badge">{visible.length} Recorded</span>
                    {deletedTransactions.length > 0 && (
                      <button
                        type="button"
                        className="badge-link-trash"
                        onClick={() => setView(VIEWS.DELETED)}
                        title="View soft-deleted records"
                      >
                        <IconTrash />
                        <span>{deletedTransactions.length} in Trash</span>
                      </button>
                    )}
                  </div>
                </div>

                <FilterBar filter={filter} onChange={setFilter} />

                <TransactionList
                  transactions={visible}
                  onEdit={setEditing}
                  onDelete={setDeleting}
                  emptyText={transactions.length ? "No transactions match your current filters." : undefined}
                />
              </section>
            </div>
          )}

          {view === VIEWS.ANALYTICS && (
            <section className="web-dashboard-card full-width single-focus-view">
              <div className="card-header-neo">
                <div className="card-header-title-group">
                  <h2>Analytics & Detailed Breakdown</h2>
                  <span className="card-header-badge">PHP Currency</span>
                </div>
                <button
                  type="button"
                  className="btn-neo-secondary small"
                  onClick={() => setView(VIEWS.DASHBOARD)}
                >
                  ← Back to Dashboard
                </button>
              </div>
              <AnalyticsScreen
                summary={summary}
                transactions={transactions}
              />
            </section>
          )}

          {view === VIEWS.HISTORY && (
            <section className="web-dashboard-card full-width single-focus-view">
              <div className="card-header-neo">
                <div className="card-header-title-group">
                  <h2>All Transactions</h2>
                  <span className="card-header-badge">{visible.length} Entries</span>
                  {deletedTransactions.length > 0 && (
                    <button
                      type="button"
                      className="badge-link-trash"
                      onClick={() => setView(VIEWS.DELETED)}
                    >
                      <IconTrash />
                      <span>{deletedTransactions.length} in Trash</span>
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-neo-secondary small"
                  onClick={() => setView(VIEWS.DASHBOARD)}
                >
                  ← Back to Dashboard
                </button>
              </div>
              <FilterBar filter={filter} onChange={setFilter} />
              <TransactionList
                transactions={visible}
                onEdit={setEditing}
                onDelete={setDeleting}
                emptyText={transactions.length ? "No transactions match your current filters." : undefined}
              />
            </section>
          )}

          {view === VIEWS.ADD && (
            <section className="web-dashboard-card narrow-center single-focus-view">
              <div className="card-header-neo">
                <div className="card-header-title-group">
                  <h2>Record New Transaction</h2>
                  <span className="card-header-badge">PHP Currency</span>
                </div>
                <button
                  type="button"
                  className="btn-neo-secondary small"
                  onClick={() => setView(VIEWS.DASHBOARD)}
                >
                  ← Cancel
                </button>
              </div>
              <TransactionForm
                submitLabel="Record Transaction"
                onSubmit={(data) => {
                  onAdd(data);
                  setView(VIEWS.DASHBOARD);
                }}
                onCancel={() => setView(VIEWS.DASHBOARD)}
              />
            </section>
          )}

          {view === VIEWS.DELETED && (
            <section className="web-dashboard-card full-width single-focus-view">
              <RecentlyDeletedView
                deletedTransactions={deletedTransactions}
                onRestore={handleRestore}
                onPurge={handlePurge}
                onClearAll={handleClearAllDeleted}
                onBack={() => setView(VIEWS.DASHBOARD)}
              />
            </section>
          )}
        </main>
      </div>

      {editing && (
        <Modal title="Edit Transaction" onClose={() => setEditing(null)}>
          <TransactionForm
            initial={editing.toJSON()}
            submitLabel="Save Changes"
            onSubmit={onUpdate}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}

      {deleting && (
        <Modal title="Move to Recently Deleted?" onClose={() => setDeleting(null)}>
          <div className="delete-modal-content">
            <p className="delete-warning-text">
              <strong>{deleting.category}</strong> · {formatMoney(deleting.amount)}
              {deleting.description ? ` (${deleting.description})` : ""} will be moved to <strong>Recently Deleted</strong>.
            </p>
            <p className="delete-sub-text">
              You can recover and restore this transaction at any time from the Recently Deleted tab.
            </p>
            <div className="form-actions-row">
              <button
                type="button"
                className="btn-neo-secondary"
                onClick={() => setDeleting(null)}
              >
                Keep Record
              </button>
              <button
                type="button"
                className="btn-neo-danger"
                onClick={onSoftDelete}
              >
                Move to Trash
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isAddModalOpen && (
        <Modal title="Record Transaction (PHP)" onClose={() => setIsAddModalOpen(false)}>
          <TransactionForm
            submitLabel="Record Entry"
            onSubmit={onAdd}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </Modal>
      )}

      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        activities={activities}
        onSelectActivity={(act) => {
          if (act.targetView === "deleted" || act.type === "delete") {
            setView(VIEWS.DELETED);
          } else {
            setView(VIEWS.HISTORY);
          }
          setIsNotifOpen(false);
        }}
        onClear={() => {
          activityService.clear();
          setActivities([]);
          notify("Activity log cleared.");
        }}
      />

      <FloatingDock
        view={view}
        onChange={setView}
        onQuickAdd={openQuickAdd}
        deletedCount={deletedTransactions.length}
      />

      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
