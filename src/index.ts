import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';
import router from './routes/router.js';
import errorHandler from './middlewares/errorHandlerMiddleware.js';


const app = express();

dotenv.config();

app.use(cors());
app.use(json());
app.use(router);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log("server runnig on port " + PORT));
