import express from "express";
import authRoutes from "./auth.routes";
import folderRoutes from "./folder.routes";
import noteRoutes from "./note.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use ("/folder",folderRoutes)
router.use("/note",noteRoutes);


export default router;