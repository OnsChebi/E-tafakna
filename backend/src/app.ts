// src/app.ts
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./database/db";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.routes"; // Import your routes

dotenv.config();

const app = express();
const port = process.env.PORT;
// Middleware
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure HTTP headers
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api", routes); 

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
  
