import { Request, Response } from "express";
import { FolderService } from "../services/folder.service";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

export class FolderController {
  private folderService: FolderService;

  constructor() {
    this.folderService = new FolderService(); // Initialize folderService
  }

  async createFolder(req: Request, res: Response) {
    const { name } = req.body;
    const authenticatedReq = req as AuthenticatedRequest;
    const expertId = authenticatedReq.user?.id;

    if (!expertId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!name) {
      res.status(400).json({ message: "Folder name is required" });
      return;
    }

    try {
      const folder = await this.folderService.createFolder(name, expertId);
      res.status(201).json(folder);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating folder:", error.message);
        res.status(400).json({ message: error.message });
      } else {
        console.error("Unknown error:", error);
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }
}