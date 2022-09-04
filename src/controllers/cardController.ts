
import {Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import { createCardService, validateCardService } from "../services/cardService.js";

export async function createCard(req: Request, res: Response) {
    const apiKey:string = res.locals.apiKey
    const employeeId:number = req.body.employeeId
    const cardType: TransactionTypes = req.body.cardType
    await createCardService(apiKey, employeeId, cardType)
    res.sendStatus(201)    
}

export async function validateCard(req: Request, res: Response) {
    const cardId:number = req.body.cardId
    const cvc:string = req.body.cvc
    const password: string = req.body.password
    await validateCardService(cardId, cvc, password)
    res.sendStatus(201)    
    }

