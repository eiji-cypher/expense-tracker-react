import {
  CATEGORIES,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  TYPES,
} from "../../models/constants.js";
import { TransactionFilter } from "../../services/TransactionFilter.js";

export default function FilterBar({ filter, onChange }) {
  const set = (e) => onChange({ ...filter, [e.target.name]: e.target.value });
  const ALL = TransactionFilter.ALL;

  const availableCategories =
    filter.type === TYPES.INCOME
      ? INCOME_CATEGORIES
      : filter.type === TYPES.EXPENSE
        ? EXPENSE_CATEGORIES
        : CATEGORIES;

  return (
    <div className="neo-filter-bar">
      <div className="search-input-wrap">
        <span className="search-icon"></span>
        <input
          name="search"
          type="search"
          className="neo-search-input"
          placeholder="Search description, category, amount..."
          value={filter.search}
          onChange={set}
        />
        {filter.search && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => onChange({ ...filter, search: "" })}
            title="Clear Search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-selects-row">
        <div className="select-pill-wrap">
          <select
            name="category"
            className="neo-filter-select"
            value={filter.category}
            onChange={set}
            aria-label="Filter Category"
          >
            <option value={ALL}>All Categories</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="select-pill-wrap">
          <select
            name="type"
            className="neo-filter-select"
            value={filter.type}
            onChange={(e) => {
              const newType = e.target.value;
              onChange({
                ...filter,
                type: newType,
                category: ALL,
              });
            }}
            aria-label="Filter Type"
          >
            <option value={ALL}>All Types</option>
            {Object.values(TYPES).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
