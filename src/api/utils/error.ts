import * as httpStatus from 'http-status';
import * as expressValidation from 'express-validation';
import APIError from './api-error';
import { Request, Response, NextFunction } from 'express';
import {config } from '../../config/var';
import {notFoundError } from '../../config/user-messges';
const { env } = config;
  
/**
 * error handler. Send stacktrace only during development
 * @public
 */
const handler = (err: any, req: Request, res: Response): void => {
    const response = {
        code: err.status,
        message: err.message || httpStatus[err.status],
        errors: err.errors,
        stack: err.stack,
    };

    if (env !== "development") {
        delete response.stack;
    }

    res.status(err.status);
    res.json(response);
};

/**
 * if error is not an instance of API error, convert it.
 * @public
 */
export const converter = (err: any, req: Request, res: Response, next: NextFunction): any => {
    let convertedError = err;

    if ((err instanceof expressValidation.ValidationError) || !(err instanceof APIError)) {
        convertedError = new APIError({
            message: err.message,
            status: err.status,
            stack: err.stack,
        });
    }

    return handler(convertedError, req, res);
};

/**
 * catch 404 and forward to error handler
 * @public
 */
export const notFound = (req: Request, res: Response, next: NextFunction): any => {
    const err = new APIError({
        message: notFoundError,
        status: httpStatus.NOT_FOUND,
    });
    return handler(err, req, res);
};



export { handler };
