import {DataSource}from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User.entity";
import { Expert } from "../entities/Expert.entity";
import { Meeting } from "../entities/Meeting.entity";
import { Notification } from "../entities/Notifications.entity";

dotenv.config();


export const AppDataSource=new DataSource({
    type:"mysql",
    host:process.env.DB_HOST || "localhost",
    port:Number(process.env.DB_PORT) || 3306,
    username:process.env.DB_USERNAME || "root",
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME ,
    entities:[User,Expert,Meeting,Notification],
    synchronize:true,});

    AppDataSource.initialize()
.then(()=>{
    console.log("Data Source has been initialized!")
})
.catch((err)=>{
    console.error("Error during Data Source initialization:", err)
})

    