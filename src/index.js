
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js'


dotenv.config({
    path: './env'
})


connectDB()
    .then(() => {

        app.on("error", (error) => {
            console.log("Error");
            throw error;
        });

        app.listen(process.env.PORT || 8000, () => {
            console.log(`App is runing at port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log("DB connection failed")
    })



/* 
import mongoose from 'mongoose';
import { DB_NAME } from './constants';
import express from 'express';
const app = express();


(async () => {
    try {
        await mongoose.connect(`${proccess.env.MONGODB_URI}/${DB_NAME}`);

        app.on("error", (error) => {
            console.log("Error");
            throw error;
        });

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        });

    } catch (error) {
        console.error("Error during connection of DB", error);
        throw error;

    }
})()

*/


