import { Request, Response, NextFunction } from "express";
import { APIError } from "../utilities/errors";

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler = ( asyncFunc: AsyncFunction ) => {
    return (req: Request, res: Response, next: NextFunction) => {
        asyncFunc(req, res, next).catch((error: any) => {
            if(!(error instanceof APIError)){
                next(APIError.InternalServerError())
            }
            next(error);
        });
    };
};

export default asyncHandler;