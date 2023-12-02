import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';



const connectDB = async () => {

    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log(`MONOGO DB CONNECTED.... App is listening on port ${process.env.PORT}, connection Instance is ${connectionInstance.connection.host}`)

    } catch (error) {
        console.error("Error during connection of DB", error);

        process.exit(1);

    }

}

export default connectDB;

