import { CATEGORIES, TYPES } from "./constants.js";
import { ValidationError } from "./ValidationError.js";

export class Transaction {
  #id; #amount; #type; #category; #date; #description;

  constructor({ id, amount, type, category, date, description = "" }) {
    const errors = Transaction.validate({ amount, type, category, date });
    if (Object.keys(errors).length) throw new ValidationError(errors);
    this.#id = id ?? crypto.randomUUID();
    this.#amount = Number(amount);
    this.#type = type;
    this.#category = category;
    this.#date = date;
    this.#description = String(description).trim();
  }

  static validate({ amount, type, category, date }) {
    const errors = {};
    if (!(Number(amount) > 0)) errors.amount = "Enter an amount greater than 0.";
    if (!Object.values(TYPES).includes(type)) errors.type = "Choose income or expense.";
    if (!CATEGORIES.includes(category)) errors.category = "Pick a category.";
    
    const todayStr = (() => {
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    })();

    if (!date || Number.isNaN(Date.parse(date))) {
      errors.date = "Pick a valid date.";
    } else if (date > todayStr) {
      errors.date = "Transaction date cannot be in the future.";
    }
    return errors;
  }

  static fromJSON(json) { return new Transaction(json); }

  get id() { return this.#id; }
  get amount() { return this.#amount; }
  get type() { return this.#type; }
  get category() { return this.#category; }
  get date() { return this.#date; }
  get description() { return this.#description; }

  isIncome() { return this.#type === TYPES.INCOME; }
  isExpense() { return this.#type === TYPES.EXPENSE; }
  get signedAmount() { return this.isIncome() ? this.#amount : -this.#amount; }

  with(changes) { return new Transaction({ ...this.toJSON(), ...changes }); }

  toJSON() {
    return { id: this.#id, amount: this.#amount, type: this.#type,
             category: this.#category, date: this.#date, description: this.#description };
  }
}
