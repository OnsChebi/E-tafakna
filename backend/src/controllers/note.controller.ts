import { Request, Response } from "express";
import { NoteService } from "../services/note.service";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

export class NoteController {
  private noteService: NoteService;

  constructor() {
    this.noteService = new NoteService();
  }

  private getExpertId(req: Request): number | null {
    const authenticatedReq = req as AuthenticatedRequest;
    return authenticatedReq.user?.id || null;
  }

  private handleError(res: Response, error: unknown, action: string) {
    if (error instanceof Error) {
      console.error(`Error ${action}:`, error.message);
      res.status(400).json({ message: error.message });
    } else {
      console.error(`Unknown error ${action}:`, error);
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }

  async createNote(req: Request, res: Response) {
    const expertId = this.getExpertId(req);
    if (!expertId) { res.status(401).json({ message: "Unauthorized" });
    return;
  }

    const { text, folderId } = req.body;
    if (!text || !folderId) {
        res.status(400).json({ message: "Text and folder ID are required" });
        return;
    }

    try {
      const note = await this.noteService.createNote(text, folderId, expertId);
      res.status(201).json(note);
    } catch (error) {
      this.handleError(res, error, "creating note");
    }
  }

  async updateNote(req: Request, res: Response) {
    const expertId = this.getExpertId(req);
    if (!expertId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const noteId = parseInt(req.params.id);
    const { text } = req.body;
    
    if (!text) {
         res.status(400).json({ message: "Text is required" });
         return;
         }

    try {
      const note = await this.noteService.updateNote(noteId, text, expertId);
      res.json(note);
    } catch (error) {
      this.handleError(res, error, "updating note");
    }
  }

  async deleteNote(req: Request, res: Response) {
    const expertId = this.getExpertId(req);
    if (!expertId) {
         res.status(401).json({ message: "Unauthorized" });
         return;
        }

    const noteId = parseInt(req.params.id);
    try {
      await this.noteService.deleteNote(noteId, expertId);
      res.status(204).send();
    } catch (error) {
      this.handleError(res, error, "deleting note");
    }
  }

  async getNotesByFolder(req: Request, res: Response) {
    const expertId = this.getExpertId(req);
    if (!expertId) { 
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const folderId = parseInt(req.params.folderId);
    try {
      const notes = await this.noteService.getNotesByFolder(folderId, expertId);
      res.json(notes);
    } catch (error) {
      this.handleError(res, error, "fetching notes by folder");
    }
  }

  async getNote(req: Request, res: Response) {
    const expertId = this.getExpertId(req);
    if (!expertId) { 
        res.status(401).json({ message: "Unauthorized" });
        return;
}

    const noteId = parseInt(req.params.id);
    try {
      const note = await this.noteService.getAllNote(noteId, expertId);
      if (!note) {
        res.status(404).json({ message: "Note not found" });
        return;
      }
      res.json(note);
    } catch (error) {
      this.handleError(res, error, "fetching note");
    }
  }
}