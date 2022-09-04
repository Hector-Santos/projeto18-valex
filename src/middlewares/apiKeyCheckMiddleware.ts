import { NextFunction, Request, Response } from "express";

export default function apiKeyCheck(req:Request, res:Response, next:NextFunction) {
  const apiKey:string | string[] | undefined = req.headers.apikey
  if (!apiKey) {
    return res.sendStatus(400);
  } 
  
  res.locals.apiKey = apiKey
  next();
 
}