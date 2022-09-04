import joi from "joi";

const createCardSchema = joi.object({
  employeeId:joi.number().required(),
  cardType: joi.string().valid("groceries", "restaurant", "transport", "education", "health").required()
});

export default createCardSchema;