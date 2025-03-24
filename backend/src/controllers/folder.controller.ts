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
    this.folderService = new FolderService(); 
  }

  // Create Folder (already implemented)
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

  // Update Folder Name
  async updateFolder(req: Request, res: Response) {
    const { name } = req.body;
    const folderId = parseInt(req.params.id); 
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
      const folder = await this.folderService.updateFolder(folderId, name, expertId);
      res.json(folder);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating folder:", error.message);
        res.status(400).json({ message: error.message });
      } else {
        console.error("Unknown error:", error);
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }

  // Delete Folder
  async deleteFolder(req: Request, res: Response) {
    const folderId = parseInt(req.params.id);
    const authenticatedReq = req as AuthenticatedRequest;
    const expertId = authenticatedReq.user?.id;

    if (!expertId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      await this.folderService.deleteFolder(folderId, expertId);
      res.status(204).json({message:"deleted successfully"}); 
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting folder:", error.message);
        res.status(400).json({ message: error.message });
      } else {
        console.error("Unknown error:", error);
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }
// Get All Folders
async getFolders(req: Request, res: Response) {
  const authenticatedReq = req as AuthenticatedRequest;
  const expertId = authenticatedReq.user?.id;

  if (!expertId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const folders = await this.folderService.getFolders(expertId);
    res.json(folders);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching folders:", error.message);
      res.status(400).json({ message: error.message });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

// Get Folder by Name
async getFolderByName(req: Request, res: Response) {
  const { name } = req.query; // Get folder name from query parameters
  const authenticatedReq = req as AuthenticatedRequest;
  const expertId = authenticatedReq.user?.id;

  if (!expertId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

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
    if (error instanceof Error) {
      console.error("Error fetching folder:", error.message);
      res.status(400).json({ message: error.message });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}}
