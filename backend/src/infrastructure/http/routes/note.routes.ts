import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { NoteController } from "../controllers/note.controller";

const router = Router();
const noteController = new NoteController();

router.post("/", authenticate, async (req, res) => {
  await noteController.createNote(req, res);
});

router.get("/folder/:id", authenticate, async (req, res) => {
    await noteController.getNotesByFolder(req, res);
  });

  router.get("/:id", authenticate, async (req, res) => {
    await noteController.getOne(req, res);
  });
  router.put("/:id", authenticate, async (req, res) => {
    await noteController.updateNote(req, res);
  });

  router.delete("/:id", authenticate, async (req, res) => {
    await noteController.deleteNote(req, res);
  });

export default router;
