import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";


export function validate(req:Request, res:Response, next:NextFunction, schema:Schema) {
    const body = req.body;
        const validation = schema.validate(body, {abortEarly: false});
        if (validation.error) {
          return res.status(422).send(validation.error.details.map(error => error.message.replace(`'\'`,"")));
        }
    next();
  }