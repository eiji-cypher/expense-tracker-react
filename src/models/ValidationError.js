export class ValidationError extends Error {
  constructor(errors) {
    super("Transaction validation failed");
    this.name = "ValidationError";
    this.errors = errors;
  }
}
