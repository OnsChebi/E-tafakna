import express from "express";
import authRoutes from "./auth.routes";
import folderRoutes from "./folder.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use ("/folder",folderRoutes)


export default router;