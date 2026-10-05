import { NextFunction, Request, Response } from "express";

export function routeHandler(req:Request, res: Response, next: NextFunction): void{
    res.status(404).json({error: "Page not found"})
    next()
}