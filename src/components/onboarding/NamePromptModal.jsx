import { useState } from "react";

export default function NamePromptModal({
  onSubmit,
  onCancel,
  initialName = "",
}) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name so we can personalize your experience.");
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <div className="onboarding-overlay" onClick={initialName ? onCancel : undefined}>
      <div
        className="onboarding-card-neo"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="onboarding-brand-header">
          <img src="/logo.png" alt="EijiDev Budget Pocket" className="onboarding-logo" />
        </div>

        <div className="onboarding-content">
          <h2 id="onboarding-title" className="onboarding-title">
            {initialName ? "Edit Account Name" : "Hey! What should I call you?"}
          </h2>
          <p className="onboarding-subtitle">
            {initialName
              ? "Update your display name for the budget pocket dashboard."
              : "Welcome to EijiDev Pocket Budget. Enter your name below to personalize your financial dashboard."}
          </p>

          <form onSubmit={handleSubmit} className="onboarding-form">
            <div className="form-group-neo">
              <label htmlFor="user-name-input" className="form-label-neo">
                Your Name
              </label>
              <input
                id="user-name-input"
                type="text"
                autoFocus
                placeholder="e.g. Sean"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                className={`form-input-neo large ${error ? "has-error" : ""}`}
                maxLength={40}
              />
              {error && <span className="form-error-msg">{error}</span>}
            </div>

            <div className="onboarding-actions-stack">
              <button type="submit" className="onboarding-submit-btn">
                <span>{initialName ? "Save Name" : "Continue to Budget Pocket"}</span>
                <span className="btn-arrow">→</span>
              </button>

              {initialName && onCancel && (
                <button
                  type="button"
                  className="btn-neo-secondary full-width"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
