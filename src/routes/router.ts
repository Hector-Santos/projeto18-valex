import express from 'express';

import cardRouter from './cardRouter.js';
import paymentRouter from './paymentRouter.js';


const router = express.Router();

router.use(cardRouter);
router.use(paymentRouter);


export default router;