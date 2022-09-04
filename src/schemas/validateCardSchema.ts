import joi from "joi";

const validateCardSchema = joi.object({
  cardId:joi.number().required(),
  cvc:joi.string().required(), 
  password:joi.string().regex(/^[0-9]{4}$/).required()
});

export default validateCardSchema;