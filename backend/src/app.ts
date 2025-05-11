import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { AppDataSource } from "./infrastructure/database/db";
import indexRouter from "./infrastructure/http/routes/index.routes";

dotenv.config();

const app = express();
const port = process.env.PORT;
// Middleware
app.use(cors()); 
app.use(helmet()); // Secure HTTP headers
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api", indexRouter); 

// Database Initialization
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(port,()=>{
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
  
