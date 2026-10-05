import { NextFunction, Request, Response } from "express";


export function errorHandler(err: Error, req:Request, res: Response, next: NextFunction): void{
    console.error(err.stack)
    if(err instanceof Error){
        
        if(err instanceof SyntaxError ){
            res.status(400).json({error: "Invalid Json"})
            next()
        }
        res.status(400).json({error: "Unknown error"})
        next()
    }else {
        next()
    }
}