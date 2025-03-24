import { Router } from "express";
import { NoteController } from "../controllers/note.controller";
import { authenticate } from "../middleware/auth";

const router = Router();
const noteController = new NoteController();

// Create Note
router.post("/", authenticate, (req, res) => noteController.createNote(req, res));

// Update Note
router.put("/:id", authenticate, (req, res) => noteController.updateNote(req, res));

// Delete Note
router.delete("/:id", authenticate, (req, res) => noteController.deleteNote(req, res));

// Get Notes by Folder
router.get("/folder/:folderId", authenticate, (req, res) => 
  noteController.getNotesByFolder(req, res));

// Get Single Note by ID
router.get("/:id", authenticate, (req, res) => noteController.getNote(req, res));

export default router;