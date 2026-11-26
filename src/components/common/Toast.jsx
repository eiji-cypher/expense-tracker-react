export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  return (
    <div
      key={toast.key}
      className={`neo-toast-pill ${toast.kind || "success"}`}
      role="status"
      onClick={onDismiss}
      title="Click to dismiss"
    >
      <div className="toast-indicator-dot" />
      <span className="toast-message-text">{toast.message}</span>
      <button type="button" className="toast-dismiss-x" onClick={onDismiss}>
        ✕
      </button>
    </div>
  );
}
