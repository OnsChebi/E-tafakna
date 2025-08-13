import { Request, Response } from "express";
import { TagRepository } from "../../database/repo/TagRepositoryImp";
import { FolderRepositoryImp } from "../../database/repo/FolderRepositoryImp";

import { RemoveTagFromFolderUseCase } from "../../../core/use-cases/tag/RemoveTagFromFolder";
import { AssignOrCreateTagForFolderUseCase } from "../../../core/use-cases/tag/AssignOrCreateTagForFolder";
import { AssignExistingTagToFolderUseCase } from "../../../core/use-cases/tag/AssignTagToFolder";
import { DeleteTagUseCase } from "../../../core/use-cases/tag/DeleteTag";
import { GetTagByIdUseCase } from "../../../core/use-cases/tag/GetTagById";
import { GetTagByFoldersIdUseCase } from "../../../core/use-cases/tag/getTagsByFolder";


const tagRepo = new TagRepository();
const folderRepo = new FolderRepositoryImp();

export async function createOrAssignTagController(req: Request, res: Response): Promise<void> {
  try {
    const { folderId, name, color } = req.body;
    if (!folderId || !name || !color) {
      res.status(400).json({ message: "folderId, name, and color are required" });
      return;
    }

    const useCase = new AssignOrCreateTagForFolderUseCase(folderRepo, tagRepo);
    const tag = await useCase.execute(Number(folderId), { name, color });
    res.status(201).json({ message: "Tag created and assigned", tag });
  } catch (error) {
    console.error("createOrAssignTagController error:", error);
    res.status(500).json({ message: "Failed to create and assign tag", error });
  }
}

export async function assignExistingTagController(req: Request, res: Response): Promise<void> {
  try {
    const { folderId, tagId } = req.body;
    if (!folderId || !tagId) {
      res.status(400).json({ message: "folderId and tagId are required" });
      return;
    }

    const useCase = new AssignExistingTagToFolderUseCase(folderRepo, tagRepo);
    await useCase.execute(Number(folderId), Number(tagId));
    res.status(200).json({ message: "Tag assigned to folder" });
  } catch (error) {
    console.error("assignExistingTagController error:", error);
    res.status(500).json({ message: "Failed to assign tag", error });
  }
}

export async function removeTagFromFolderController(req: Request, res: Response): Promise<void> {
  try {
    const { folderId, tagId } = req.body;
    if (!folderId || !tagId) {
      res.status(400).json({ message: "folderId and tagId are required" });
      return;
    }

    const useCase = new RemoveTagFromFolderUseCase(folderRepo);
    await useCase.execute(Number(folderId), Number(tagId));
    res.status(200).json({ message: "Tag removed from folder" });
  } catch (error) {
    console.error("removeTagFromFolderController error:", error);
    res.status(500).json({ message: "Failed to remove tag", error });
  }
}

export async function deleteTagController(req: Request, res: Response): Promise<void> {
  try {
    const { tagId } = req.params;
    if (!tagId) {
      res.status(400).json({ message: "tagId is required" });
      return;
    }

    const useCase = new DeleteTagUseCase(tagRepo);
    await useCase.execute(Number(tagId));
    res.status(200).json({ message: "Tag deleted" });
  } catch (error) {
    console.error("deleteTagController error:", error);
    res.status(500).json({ message: "Failed to delete tag", error });
  }
}

export async function getTagByIdController(req: Request, res: Response): Promise<void> {
  try {
    const { tagId } = req.params;
    if (!tagId) {
      res.status(400).json({ message: "tagId is required" });
      return;
    }

    const useCase = new GetTagByIdUseCase(tagRepo);
    const tag = await useCase.execute(Number(tagId));
    res.status(200).json(tag);
  } catch (error) {
    console.error("getTagByIdController error:", error);
    res.status(500).json({ message: "Failed to get tag", error });
  }
}

export async function getAllTagsController(req: Request, res: Response): Promise<void> {
  try {
    const tags = await tagRepo.findAll();
    res.status(200).json(tags);
  } catch (error) {
    console.error("getAllTagsController error:", error);
    res.status(500).json({ message: "Failed to fetch tags", error });
  }
}

   export async function getTagByFolderId(req: Request, res: Response): Promise<void> {
  const folderId = parseInt(req.params.folderId, 10);
  if (isNaN(folderId)) {
    res.status(400).json({ message: "Invalid folder id" });
    return; 
  }

  try {
    const useCase = new GetTagByFoldersIdUseCase(tagRepo);
    const tags = await useCase.execute(folderId);

    if (!tags || tags.length === 0) {
      res.status(404).json({ message: "No tags found for this folder" });
      return; 
    }

    res.status(200).json(tags); 
  } catch (err) {
    res.status(400).json({ message: err instanceof Error ? err.message : "Error" });
  }
}

  

