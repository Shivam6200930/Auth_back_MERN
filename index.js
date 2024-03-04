import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import router from './routes/useRoutes.js'
import mongoose from "mongoose";
import cookieParser from 'cookie-parser'

async function connectDb(DATABASE_URL) {
    try {
        const DB_options = {
            dbname: "shivam"
        };
        await mongoose.connect(DATABASE_URL, DB_options);
        console.log("Database Connected........");
    } catch (error) {
        console.log(error);
    }


}

const app = express()
const port=process.env.PORT
const DATABASE_URL=process.env.DATABASE_URL

connectDb(DATABASE_URL)

const corsOptions = {
    credentials: true,
    origin: '*', // Update this with the actual origin of your frontend application
  };
  
  app.use(cors(corsOptions));

app.use(express.json())
app.use(cookieParser())

app.use("/api/users",router)
app.listen(port,()=>{
    console.log(`listening port on ${port}`)
})
