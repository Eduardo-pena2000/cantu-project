export class AppError extends Error {
  constructor({ name, message }) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.message = message;
    this.name = name;
  }

  static applicationError(message) {
    return new AppError({ name: "ApplicationError", message });
  }
}
