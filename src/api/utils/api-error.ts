import * as httpStatus from "http-status";

interface ErrorOptions {
  message: string;
  errors?: any;
  status?: number;
  isPublic?: boolean;
  stack?: string;
}

/**
 * @extends Error
 */
class ExtendableError extends Error {
  errors?: any;
  status?: number;
  isPublic?: boolean;
  isOperational: boolean = true; // this is required since bluebird 4 doesn't append it anymore.

  constructor({ message, errors, status, isPublic, stack }: ErrorOptions) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    if (stack) {
      this.stack = stack;
    }
  }
}

/**
 * class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * creates an API error.
   * @param {string} message - error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - whether the message should be visible to user or not.
   */
  constructor({
    message,
    errors,
    stack,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic = false,
  }: ErrorOptions) {
    super({
      message,
      errors,
      status,
      isPublic,
      stack,
    });
  }
}

export default APIError;
