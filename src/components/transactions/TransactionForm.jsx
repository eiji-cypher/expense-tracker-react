import { useState } from "react";
import {
  CATEGORIES,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  TYPES,
} from "../../models/constants.js";
import { Transaction } from "../../models/Transaction.js";
import { today } from "../../utils/format.js";

const EMPTY = {
  amount: "",
  type: TYPES.EXPENSE,
  category: EXPENSE_CATEGORIES[0],
  date: today(),
  description: "",
};

export default function TransactionForm({
  initial,
  submitLabel = "Save Transaction",
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(() => {
    if (initial) {
      return { ...initial, amount: String(initial.amount) };
    }
    return EMPTY;
  });
  const [errors, setErrors] = useState({});

  const handleTypeChange = (newType) => {
    setValues((prev) => {
      const allowedCategories =
        newType === TYPES.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      const isCurrentAllowed = allowedCategories.includes(prev.category);
      return {
        ...prev,
        type: newType,
        category: isCurrentAllowed ? prev.category : allowedCategories[0],
      };
    });

    if (errors.type || errors.category) {
      setErrors((err) => ({ ...err, type: undefined, category: undefined }));
    }
  };

  const handleChange = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = Transaction.validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    onSubmit({ ...values, amount: Number(values.amount) });
    if (!initial) {
      const defaultCat =
        values.type === TYPES.INCOME ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0];
      setValues({
        ...EMPTY,
        type: values.type,
        category: defaultCat,
        date: values.date,
      });
    }
  };

  const isIncome = values.type === TYPES.INCOME;
  const currentCategoryList = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const categoryLabel = isIncome
    ? "Income Source (Where is it from?)"
    : "Expense Category";
  const descriptionPlaceholder = isIncome
    ? "e.g. Monthly salary, client payment, project bonus (optional)"
    : "e.g. Weekly grocery run, electric bill (optional)";

  const err = (f) =>
    errors[f] && <span className="field-error-msg">{errors[f]}</span>;

  return (
    <form className="neo-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="field-label">Transaction Type</label>
        <div className="neo-seg-control" role="group" aria-label="Type">
          {Object.values(TYPES).map((t) => (
            <button
              type="button"
              key={t}
              className={`neo-seg-btn ${values.type === t ? "active " + t.toLowerCase() : ""}`}
              onClick={() => handleTypeChange(t)}
            >
              {t === TYPES.EXPENSE ? "− Expense" : "+ Income"}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="field-label">
          Amount (PHP)
          <div className="input-with-prefix">
            <span className="input-prefix">₱</span>
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              className={`neo-input amount-input ${errors.amount ? "has-error" : ""}`}
              value={values.amount}
              onChange={handleChange}
              placeholder="0.00"
              autoFocus={!initial}
            />
          </div>
          {err("amount")}
        </label>
      </div>

      <div className="form-group">
        <label className="field-label">
          {categoryLabel}
          <div className="select-wrap">
            <select
              name="category"
              className={`neo-select ${errors.category ? "has-error" : ""}`}
              value={values.category}
              onChange={handleChange}
            >
              {currentCategoryList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {err("category")}
        </label>
      </div>

      <div className="form-group">
        <label className="field-label">
          Date
          <input
            name="date"
            type="date"
            max={today()}
            className={`neo-input ${errors.date ? "has-error" : ""}`}
            value={values.date}
            onChange={handleChange}
          />
          {err("date")}
        </label>
      </div>

      <div className="form-group">
        <label className="field-label">
          Description (Optional)
          <input
            name="description"
            className="neo-input"
            value={values.description}
            onChange={handleChange}
            placeholder={descriptionPlaceholder}
            maxLength={100}
          />
        </label>
      </div>

      <div className="form-actions-row">
        {onCancel && (
          <button
            type="button"
            className="btn-neo-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn-neo-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
