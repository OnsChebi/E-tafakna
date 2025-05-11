import { Request, Response } from "express";
import { NoteRepositoryImp } from "../../database/repo/NoteRepositoryImp";

const noteRepo = new NoteRepositoryImp();

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export class NoteController {
  async createNote(req: Request, res: Response) {
    const { text, folderId } = req.body;
    const expertId = (req as AuthenticatedRequest).user?.id;
    if (!expertId) return res.status(401).json({ message: "Unauthorized" });
    if (!text || !folderId) return res.status(400).json({ message: "Text and folder ID are required" });
    try {
      const note = await noteRepo.createNote(text, folderId, expertId);
      res.status(201).json(note);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  async updateNote(req: Request, res: Response) {
    const { text } = req.body;
    const noteId = parseInt(req.params.id);
    const expertId = (req as AuthenticatedRequest).user?.id;
    if (!expertId) return res.status(401).json({ message: "Unauthorized" });
    if (!text) return res.status(400).json({ message: "Text is required" });
    try {
      const note = await noteRepo.updateNote(noteId, text, expertId);
      res.json(note);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  async deleteNote(req: Request, res: Response) {
    const noteId = parseInt(req.params.id);
    const expertId = (req as AuthenticatedRequest).user?.id;
    if (!expertId) return res.status(401).json({ message: "Unauthorized" });
    try {
      await noteRepo.deleteNote(noteId, expertId);
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  async getNotesByFolder(req: Request, res: Response) {
    const folderId = parseInt(req.params.id);
    const expertId = (req as AuthenticatedRequest).user?.id;
    if (!expertId) return res.status(401).json({ message: "Unauthorized" });
    try {
      const notes = await noteRepo.getNotesByFolder(folderId, expertId);
      res.json(notes);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  async getOne(req: Request, res: Response) {
    const noteId = parseInt(req.params.id);
    const expertId = (req as AuthenticatedRequest).user?.id;
    if (!expertId) return res.status(401).json({ message: "Unauthorized" });
    try {
      const note = await noteRepo.getNote(noteId, expertId);
      res.json(note);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }
}
