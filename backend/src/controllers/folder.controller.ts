import { Request, Response } from "express";
import { FolderService } from "../services/folder.service";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}//Adds an optional user property to the request object, which contains the authenticated user’s id


export class FolderController {
  private folderService: FolderService;

  constructor() {
    this.folderService = new FolderService();
  }

  // Helper method to check authentication
  private getExpertId(req: Request): number | null {
    const authenticatedReq = req as AuthenticatedRequest;
    return authenticatedReq.user?.id || null;
  }

  // Helper method to handle errors
  private handleError(res: Response, error: unknown, action: string) {
    if (error instanceof Error) {
      console.error(`Error ${action}:`, error.message);
      res.status(400).json({ message: error.message });
    } else {
      console.error(`Unknown error ${action}:`, error);
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }

  // Create Folder
  async createFolder(req: Request, res: Response) {
    const expertId = this.getExpertId(req);
    if (!expertId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Folder name is required" });
      return;
    }

    try {
      const folder = await this.folderService.createFolder(name, expertId);
      res.status(201).json(folder);
    } catch (error) {
      this.handleError(res, error, "creating folder");
    }
  }

  // Update Folder Name
  async updateFolder(req: Request, res: Response) {
    const expertId = this.getExpertId(req);
    if (!expertId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Folder name is required" });
      return;
    }

    const folderId = parseInt(req.params.id);
    try {
      const folder = await this.folderService.updateFolder(folderId, name, expertId);
      res.json(folder);
    } catch (error) {
      this.handleError(res, error, "updating folder");
    }
  }

  // Delete Folder
  async deleteFolder(req: Request, res: Response) {
    const expertId = this.getExpertId(req);
    if (!expertId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const folderId = parseInt(req.params.id);
    try {
      await this.folderService.deleteFolder(folderId, expertId);
      res.status(204).json({ message: "Deleted successfully" });
    } catch (error) {
      this.handleError(res, error, "deleting folder");
    }
  }

  // Get All Folders
  async getFolders(req: Request, res: Response) {
    const expertId = this.getExpertId(req);
    if (!expertId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const folders = await this.folderService.getFolders(expertId);
      res.json(folders);
    } catch (error) {
      this.handleError(res, error, "fetching folders");
    }
  }

  // Get Folder by Name
  async getFolderByName(req: Request, res: Response) {
    const expertId = this.getExpertId(req);
    if (!expertId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { name } = req.params;
    if (!name || typeof name !== "string") {
      res.status(400).json({ message: "Folder name is required" });
      return;
    }

    try {
      const folder = await this.folderService.getFolderByName(name, expertId);
      if (!folder) {
        res.status(404).json({ message: "Folder not found" });
        return;
      }
      res.json(folder);
    } catch (error) {
      this.handleError(res, error, "fetching folder by name");
    }
  }
}