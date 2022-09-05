import { findById as findCardById} from "../repositories/cardRepository.js";
import { compareDate, calculateBalance } from "./cardService.js";
import { PaymentInsertData,
	     insert as insertPayment,
		 findByCardId as findPaymentsByCardId} from "../repositories/paymentRepository.js";
import { findByCardId as findRechargesByCardId} from "../repositories/rechargeRepository.js";
import { findById as findBusinessById } from "../repositories/businessRepository.js";
import Cryptr from 'cryptr';
import dotenv  from "dotenv";

dotenv.config()

const ENCRYPTION_KEY:string  = process.env.ENCRYPTION_KEY || "key"

const cryptr = new Cryptr(ENCRYPTION_KEY)

export async function paymentService(cardId:number, businessId:number, amount: number, password: string ) {
	const card = await findCardById(cardId)
	if(!card) throw {type: 'card_not_found', message: 'there is no card with such id'}

	const business = await findBusinessById(businessId)
	if(!business) throw {type: 'business_not_found', message: 'no businesses where found with the provided id'}

	if(business.type !== card.type) throw {type: 'inconsistent_business_type', message: 'this card cannot be used in this type of business'}
	
    const isExpired = compareDate(card.expirationDate)
	if(isExpired) throw {type: 'expired_card', message: 'you cant perform payments with an expired card'}

	if(card.isBlocked) throw {type: 'blocked_card', message: 'you cant perform payments with an blocked card'}

	if(!card.password)throw {type: 'inactive_card', message: 'you cant perform payments with an inactive card'}

	const decriptedPassword = cryptr.decrypt(card.password)

	if(password !== decriptedPassword) throw {type: 'incorrect_password', message: 'the provided password is incorrect'}

	const payments = await findPaymentsByCardId(cardId)
	if(!payments) throw {type: 'payment_not_found', message: 'payment data could not be recovered'}

	const recharges = await findRechargesByCardId(cardId)
	if(!recharges) throw {type: 'recharge_not_found', message: 'recharge data could not be recovered'}

	const balance = calculateBalance(payments, recharges)
    if(balance.balance < amount) throw {type: 'insufficient_funds', message: 'there is not enough money on the account to complete the transaction'}

	const paymentData: PaymentInsertData  = {
		cardId:cardId,
		businessId:businessId,
		amount:amount
	}
    insertPayment(paymentData)
}


