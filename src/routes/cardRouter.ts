import express from 'express';
import { validate } from '../middlewares/validationMiddleware.js';
import apiKeyCheck from '../middlewares/apiKeyCheckMiddleware.js';
import createCardSchema from '../schemas/createCardSchema.js';
import { createCard, validateCard, getBalance, blockCard, unlockCard} from '../controllers/cardController.js';
import validateCardSchema from '../schemas/validateCardSchema.js';
import blockCardSchema from '../schemas/blockCardSchema.js';

const cardRouter = express.Router();
cardRouter.post("/createcard", (req, res, next) => validate(req, res, next, createCardSchema),apiKeyCheck, createCard);
cardRouter.post("/validatecard", (req, res, next) => validate(req, res, next, validateCardSchema), validateCard)
cardRouter.get("/balance/:id",  getBalance)
cardRouter.post("/blockcard", (req, res, next) => validate(req, res, next, blockCardSchema), blockCard)
cardRouter.post("/unlockcard", (req, res, next) => validate(req, res, next, blockCardSchema), unlockCard)



export default cardRouter