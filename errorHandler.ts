import { NextFunction, Request, Response } from "express"
import { ErrorCode, HttpException } from "./app/exceptions/root"
import { InternalException } from "./app/exceptions/internalException"

export const errorHandler = (method: Function) => {
    return async(req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next)
        } catch (error) {
            let exception: HttpException;
            if (error instanceof HttpException) {
                exception = error
            }
            else {
                exception = new InternalException('Something went wrong', error, ErrorCode.INTERNAL_EXCEPTION)
            }
            next(exception)
        }
    }
    
}