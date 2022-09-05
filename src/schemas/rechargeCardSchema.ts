import joi from "joi";

const rechargeCardSchema = joi.object({
  cardId:joi.number().required(), 
  amount:joi.number().positive().required()
});

export default rechargeCardSchema;