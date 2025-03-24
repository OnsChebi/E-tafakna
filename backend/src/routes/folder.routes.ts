import { Router } from "express";
import { FolderController } from "../controllers/folder.controller";
import { authenticate } from "../middleware/auth";

const router = Router();
const folderController = new FolderController(); // Create an instance of FolderController

// Create Folder
router.post("/", authenticate, (req, res) => folderController.createFolder(req, res));

// Update Folder Name
router.put("/:id", authenticate, (req, res) => folderController.updateFolder(req, res));

// Delete Folder
router.delete("/:id", authenticate, (req, res) => folderController.deleteFolder(req, res));
// Get All Folders
router.get("/all", authenticate, (req, res) => folderController.getFolders(req, res));

// Get Folder by Name
router.get("/:name", authenticate, (req, res) => folderController.getFolderByName(req, res));

export default router;