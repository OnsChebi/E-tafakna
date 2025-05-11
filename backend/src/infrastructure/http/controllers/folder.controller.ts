import { Request, Response } from "express";
import { CreateFolderUseCase } from "../../../core/use-cases/CreateFolder";
import { FolderRepositoryImp } from "../../database/repo/FolderRepositoryImp";
import { GetFoldersUseCase } from "../../../core/use-cases/GetFolders";
import { UpdateFolderUseCase } from "../../../core/use-cases/UpdateFolder";
import { DeleteFolderUseCase } from "../../../core/use-cases/DeleteFolder";
import { GetFolderByIdUseCase } from "../../../core/use-cases/GetFolderById";

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export class FolderController {
    constructor(
        private createFolderUseCase = new CreateFolderUseCase(new FolderRepositoryImp()),
        private getFoldersUseCase = new GetFoldersUseCase(new FolderRepositoryImp()),
        private getFolderByIdUseCase = new GetFolderByIdUseCase(new FolderRepositoryImp()),
        private updateFolderUseCase = new UpdateFolderUseCase(new FolderRepositoryImp()),
        private deleteFolderUseCase = new DeleteFolderUseCase(new FolderRepositoryImp())
      ) {}
  async createFolder(req: Request, res: Response) {
    const expertId = (req as AuthenticatedRequest).user?.id;
    if (!expertId) return res.status(401).json({ message: "Unauthorized" });

    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    try {
      const folder = await this.createFolderUseCase.execute(name, expertId);
      res.status(201).json(folder);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Error" });
    }
  }
  async getFolders(req: Request, res: Response) {
    const expertId = (req as AuthenticatedRequest).user?.id;
    if (!expertId) return res.status(401).json({ message: "Unauthorized" });

    try {
      const folders = await this.getFoldersUseCase.execute(expertId);
      res.json(folders);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Error" });
    }
  }

  async getFolderById(req: Request, res: Response) {
    const expertId = (req as AuthenticatedRequest).user?.id;
    const folderId = parseInt(req.params.id, 10);
    if (!expertId) return res.status(401).json({ message: "Unauthorized" });

    try {
      const folders = await this.getFolderByIdUseCase.execute(folderId,expertId);
      res.json(folders);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Error" });
    }
  }

  async updateFolder(req: Request, res: Response) {
    const expertId = (req as AuthenticatedRequest).user?.id;
    const folderId = parseInt(req.params.id, 10);
    const { name } = req.body;

    if (!expertId || isNaN(folderId)) return res.status(400).json({ message: "Invalid input" });

    try {
      const folder = await this.updateFolderUseCase.execute(folderId, name, expertId);
      res.json(folder);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Error" });
    }
  }

  async deleteFolder(req: Request, res: Response) {
    const expertId = (req as AuthenticatedRequest).user?.id;
    const folderId = parseInt(req.params.id, 10);

    if (!expertId || isNaN(folderId)) return res.status(400).json({ message: "Invalid input" });

    try {
      await this.deleteFolderUseCase.execute(folderId, expertId);
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Error" });
    }
  }
}