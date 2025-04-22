import express from "express";
import authRoutes from "./auth.routes";
import folderRoutes from "./folder.routes";
import noteRoutes from "./note.routes";
import calendlyRoutes from "./calendly.routes";
//import meetingRoutes from"./meeting.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use ("/folder",folderRoutes)
router.use("/note",noteRoutes);
router.use('/calendly',calendlyRoutes);
//router.use("/calendly",meetingRoutes)

export default router;