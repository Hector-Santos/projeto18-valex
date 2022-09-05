import joi from "joi";

const paymentSchema = joi.object({
  cardId:joi.number().required(),
  businessId:joi.number().required(),
  amount:joi.number().positive().required(), 
  password:joi.string().regex(/^[0-9]{4}$/).required()
});

export default paymentSchema;