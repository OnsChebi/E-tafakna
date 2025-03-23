import { Router } from "express";
import { FolderController } from "../controllers/folder.controller";
import { authenticate } from "../middleware/auth";

const router = Router();
const folderController = new FolderController();

router.post("/", authenticate, (req, res) => folderController.createFolder(req, res));

export default router;