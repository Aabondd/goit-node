exports.UnauthorizedError = class UnauthorizedError extends Error {
  constructor(message) {
    super(message);

    this.status = 401;
    this.stack = '';
    this.json = {
      message: this.message,
    };
  }
};

exports.NotFoundError = class NotFoundError extends Error {
  constructor(message) {
    super(message);

    this.status = 400;
    this.stack = '';
  }
};
