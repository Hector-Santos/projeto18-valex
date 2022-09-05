import joi from "joi";

const blockCardSchema = joi.object({
  cardId:joi.number().required(), 
  password:joi.string().regex(/^[0-9]{4}$/).required()
});

export default blockCardSchema;