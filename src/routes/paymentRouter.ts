import express from 'express';
import { validate } from '../middlewares/validationMiddleware.js';
import paymentSchema from '../schemas/paymentSchema.js';
import { payment } from '../controllers/paymentController.js';

const paymentRouter = express.Router();

paymentRouter.post("/payment", (req, res, next) => validate(req, res, next, paymentSchema), payment)

export default paymentRouter