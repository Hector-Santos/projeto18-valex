
import {Request, Response } from "express";
import { paymentService } from "../services/paymentService.js";




export async function payment(req: Request, res: Response) {
    const cardId:number = req.body.cardId
    const businessId:number = req.body.businessId
    const amount: number = req.body.amount
    const password: string = req.body.password
    await paymentService(cardId, businessId, amount, password)
    res.sendStatus(200)    
    }
