import { NextFunction, Request, Response } from "express";


export default async function errorHandler(error:{type: string, message: string}, req:Request, res:Response, next:NextFunction) {
	if (error.type === "company_not_found") return res.status(404).send(error.message);
	if (error.type === "employee_not_found") return res.status(404).send(error.message);
	if (error.type === "employee_has_card") return res.status(409).send(error.message);
	if (error.type === "card_not_found") return res.status(404).send(error.message);
	if (error.type === "expired_card") return res.status(400).send(error.message);
    if (error.type === "validated_card") return res.status(409).send(error.message);
	if (error.type === "invalid_cvc") return res.status(400).send(error.message);
	return res.sendStatus(500);
}