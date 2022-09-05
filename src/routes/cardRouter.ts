import express from 'express';
import { validate } from '../middlewares/validationMiddleware.js';
import apiKeyCheck from '../middlewares/apiKeyCheckMiddleware.js';
import createCardSchema from '../schemas/createCardSchema.js';
import { createCard, validateCard, getBalance} from '../controllers/cardController.js';
import validateCardSchema from '../schemas/validateCardSchema.js';

const cardRouter = express.Router();
cardRouter.post("/createcard", (req, res, next) => validate(req, res, next, createCardSchema),apiKeyCheck, createCard);
cardRouter.post("/validatecard", (req, res, next) => validate(req, res, next, validateCardSchema), validateCard)
cardRouter.get("/balance/:id",  getBalance)



export default cardRouter