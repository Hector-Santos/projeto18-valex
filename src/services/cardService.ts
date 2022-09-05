import { findByApiKey } from "../repositories/companyRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { CardInsertData, CardUpdateData, findByTypeAndEmployeeId, TransactionTypes, insert, findById as findCardByID, update as updateCard } from "../repositories/cardRepository.js";
import { findByCardId as findPaymentsByCardId, PaymentWithBusinessName } from "../repositories/paymentRepository.js";
import { findByCardId as findRechargesByCardId, Recharge } from "../repositories/rechargeRepository.js";
import { faker } from '@faker-js/faker'
import dotenv from 'dotenv';
import Cryptr from 'cryptr'
dotenv.config();

const ENCRYPTION_KEY:string  = process.env.ENCRYPTION_KEY || "key"

const cryptr = new Cryptr(ENCRYPTION_KEY)

export async function createCardService(apiKey:string, employeeId:number, cardType:TransactionTypes) {
	const company = await findByApiKey(apiKey);
	if(!company) throw {type: 'company_not_found', message: 'there is no company with such api key'}

	const employee = await findById(employeeId)
	if(!employee) throw {type: 'employee_not_found', message: 'there is no employee with such id'}
    
	const existingCard = await findByTypeAndEmployeeId(cardType, employeeId)
	if(existingCard) throw {type: 'employee_has_card', message: 'this employee already has a card of this type'}
     
	const number = faker.phone.number('#### #### #### ####')
	
    const cardHolderName = formatName(employee.fullName)

	const expirationDate = getCardExpirationDate()

	const securityCode = cryptr.encrypt(faker.phone.number('###'))

	const cardData: CardInsertData = {

		employeeId : employee.id,
		number : number,
		cardholderName : cardHolderName,
		securityCode : securityCode,
		expirationDate : expirationDate,
		isVirtual : false,
		isBlocked : true,
		type : cardType

	}

    insert(cardData)

}

export async function validateCardService(cardId:number, cvc:string, password:string) {
	const card = await findCardByID(cardId);
	if(!card) throw {type: 'card_not_found', message: 'there is no card with such id'}
	
    const isExpired = compareDate(card.expirationDate)
	if(isExpired) throw {type: 'expired_card', message: 'you cant validate an expired card'}

	const registeredCvc = cryptr.decrypt(card.securityCode)
    if(cvc.toString() !== registeredCvc) throw {type: 'invalid_cvc', message: 'invalid cvc'}

	if(card.password) throw {type: 'validated_card', message: 'this card is already valid'}

	const encryptedPassword = cryptr.encrypt(password)

	const cardData: CardUpdateData  = {
     password:encryptedPassword
	}
    updateCard(cardId, cardData)
}

export async function getBalanceService(cardIdParams:string) {

	const cardId = Number(cardIdParams)
	console.log(cardIdParams)
    if(!cardId) throw {type: 'invalid_card_id', message: 'the provided card id is not valid'}

    const card = await findCardByID(cardId);
	if(!card) throw {type: 'card_not_found', message: 'there is no card with such id'}

	const payments = await findPaymentsByCardId(cardId)
	if(!payments) throw {type: 'payment_not_found', message: 'payment data could not be recovered'}

	const recharges = await findRechargesByCardId(cardId)
	if(!recharges) throw {type: 'recharge_not_found', message: 'recharge data could not be recovered'}

	const balance = calculateBalance(payments, recharges)

	return balance
}



function formatName(name:string){
	const nameArray = name.toUpperCase().split(" ")
	let formatedName = ""
	for(let i = 0; i < nameArray.length; i++){
		let name = nameArray[i]
		if(i === 0){
			formatedName += name
			formatedName +=" "
		}else if(i === nameArray.length -1){
			formatedName += name
		}else if(nameArray[i].length > 3){
			formatedName += name.charAt(0)
			formatedName +=" "
		}
}
return formatedName
}

function getCardExpirationDate(){
	const date = new Date()
	let month = ""
	if(date.getMonth()+1 < 10 ){
	 month = '0' + (date.getMonth()+1).toString()
	}else{
	 month = date.getMonth().toString()
	}
	
	const roundYear = date.getFullYear().toString().substring(2)
	
	const expirationYear = (Number(roundYear) + 5).toString()
	
	const expirationDate = `${month}/${expirationYear}`
	
	return(expirationDate)
}

function compareDate(expirationDate:string){
	const date = new Date()
    const month = date.getMonth()+1
    const year = Number(date.getFullYear().toString().substring(2))
	const expirationMonth = Number(expirationDate.substring(0,2))
	const expirationYear = Number(expirationDate.substring(3))

    if(year > expirationYear){
    return true
    }else if(year === expirationYear && month > expirationMonth){
    return true    
    }else{
    return false
    }
}

function calculateBalance(paymentsArray:PaymentWithBusinessName[], rechargesArray:Recharge[]){
    let balanceTotal = 0
    const transactions = paymentsArray.map(payment => {
       const formatedDate = formatTimestamp(payment.timestamp)
       balanceTotal -= payment.amount
        return({
            id: payment.id,
            cardId: payment.cardId,
            businessId: payment.businessId,
            businessName:
            payment.businessName,
            timestamp:formatedDate,
            amount: payment.amount
        })})


    const recharges = rechargesArray.map(recharge => {
       balanceTotal += recharge.amount
       const formatedDate = formatTimestamp(recharge.timestamp)
        return({
            id: recharge.id,
            cardId: recharge.cardId,
            timestamp:formatedDate,
            amount:recharge.amount
        })})

    const balance = {
        balance: balanceTotal,
        transactions:transactions,
        recharges:recharges
    }
    
    return balance 
}

function formatTimestamp(timestamp:Date){

    let day = timestamp.getDate().toString()
    let month = (timestamp.getMonth()+1).toString()
    let year = timestamp.getFullYear().toString()
    day.length === 1? day = "0" + day: null
    month.length === 1? month = "0" + month: null
    const formatedDate:string = day + "/" + month + "/" + year
    return formatedDate

}
