import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { AppDataSource } from "./infrastructure/database/db";
import indexRouter from "./infrastructure/http/routes/index.routes";
import path from "path";


dotenv.config();

const app = express();
const port = process.env.PORT;
// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Security headers configuration
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files with proper headers
const uploadsDir = path.join(__dirname, 'uploads', 'profile-images');
app.use('/uploads/profile-images', express.static(uploadsDir, {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

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
  
