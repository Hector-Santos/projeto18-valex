import express from 'express';

import cardRouter from './cardRouter.js';


const router = express.Router();

router.use(cardRouter);


export default router;