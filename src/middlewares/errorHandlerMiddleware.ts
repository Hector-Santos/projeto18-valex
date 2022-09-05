import { NextFunction, Request, Response } from "express";


export default async function errorHandler(error:{type: string, message: string}, req:Request, res:Response, next:NextFunction) {
	if (error.type === "company_not_found") return res.status(404).send(error.message);
	if (error.type === "employee_not_found") return res.status(404).send(error.message);
	if (error.type === "employee_has_card") return res.status(409).send(error.message);
	if (error.type === "card_not_found") return res.status(404).send(error.message);
	if (error.type === "expired_card") return res.status(401).send(error.message);
    if (error.type === "validated_card") return res.status(409).send(error.message);
	if (error.type === "invalid_cvc") return res.status(401).send(error.message);
	if (error.type === "invalid_card_id") return res.status(400).send(error.message);
	if (error.type === "payment_not_found") return res.status(404).send(error.message);
	if (error.type === "recharge_not_found") return res.status(404).send(error.message);
    if (error.type === "blocked_card") return res.status(409).send(error.message);
	if (error.type === "incorrect_password") return res.status(401).send(error.message);
	if (error.type === "unblocked_card") return res.status(409).send(error.message);
	if (error.type === "inactive_card") return res.status(400).send(error.message);
	if (error.type === "business_not_found") return res.status(404).send(error.message);
	if (error.type === "inconsistent_business_type") return res.status(401).send(error.message);
    if (error.type === "insufficient_funds") return res.status(401).send(error.message);

	return res.sendStatus(500);
}