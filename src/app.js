import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


export const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" })) //limit to send data to the server

app.use(express.urlencoded({ extended: true, limit: "16kb" })) //this will encode your url

app.use(express.static("public")) // i am creating public folder to save my images or data

app.use(cookieParser())


//Import Routes

import userRouter from './routes/User.routes.js';

//routes declaration

app.use("/api/v1/users", userRouter); //http://localhost:8000/api/v1/users/register










