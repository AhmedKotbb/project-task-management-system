import { NextFunction, Request, Response } from "express";
import { APIError } from "../utilities/errors";

export const errorHandler = (err: APIError, req: Request, res: Response, next: NextFunction): void => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.statusCode || 500).json(
        {
            statusCode: err.statusCode || 500,
            statusText: err.statusText || 'Error',
            message: err.message || 'Internal Server Error'
        }
    );
};

export const errorNotFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
    next(APIError.NotFound("The resource you are looking for was not found."));
};