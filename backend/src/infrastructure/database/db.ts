import {DataSource}from "typeorm";
import dotenv from "dotenv";


dotenv.config();


export const AppDataSource=new DataSource({
    type:"mysql",
    host:process.env.DB_HOST || "localhost",
    port:Number(process.env.DB_PORT) || 3306,
    username:process.env.DB_USERNAME || "root",
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME ,
    synchronize:false,
    logging: true,
  migrations: ["src/infrastructure/database/migrations/*.ts"],
  entities: ['src/core/entities/*.ts'],
});
