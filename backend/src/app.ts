import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { AppDataSource } from "./infrastructure/database/db";
import indexRouter from "./infrastructure/http/routes/index.routes";
import { startMeetingSyncCron } from "./shared/utils/cron";
import { CalendlyRepositoryImpl } from "./infrastructure/database/repo/CalendlyRepositoryImp";
import { ExpertRepositoryImpl } from "./infrastructure/database/repo/ExpertRepositoryImpl";
import { MeetingRepositoryImpl } from "./infrastructure/database/repo/MeetingRepositoryImp";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static File Serving
const uploadsDir = path.join(__dirname, "uploads", "profile-images");
app.use(
  "/uploads/profile-images",
  express.static(uploadsDir, {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

const documentsDir = path.join(__dirname, "uploads", "documents");
app.use(
  "/uploads/documents",
  express.static(documentsDir, {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Routes
app.use("/api", indexRouter);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Global error:", {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      headers: req.headers,
    });
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");

    const calendlyRepo = new CalendlyRepositoryImpl();
    const meetingRepo = new MeetingRepositoryImpl();
    const expertRepo = new ExpertRepositoryImpl();

    startMeetingSyncCron(meetingRepo, calendlyRepo, expertRepo);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
