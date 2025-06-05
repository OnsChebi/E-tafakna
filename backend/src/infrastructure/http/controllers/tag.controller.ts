import { Request, Response } from "express";
import { TagRepository } from "../../database/repo/TagRepositoryImp";
import { FolderRepositoryImp } from "../../database/repo/FolderRepositoryImp";
import { RemoveTagFromFolderUseCase } from "../../../core/use-cases/tag/RemoveTagFromFolder";
import { GetFoldersByTagUseCase } from "../../../core/use-cases/tag/GetFolderByTag";
import { AssignOrCreateTagForFolderUseCase } from "../../../core/use-cases/tag/AssignOrCreateTagForFolder";
import { AssignExistingTagToFolderUseCase } from "../../../core/use-cases/tag/AssignTagToFolder";
import { DeleteTagUseCase } from "../../../core/use-cases/tag/DeleteTag";
import { GetTagByIdUseCase } from "../../../core/use-cases/tag/GetTagById";

// 1. Create or attach a tag and assign to folder
export async function createOrAssignTagController(req: Request, res: Response) {
  const { folderId, name, color } = req.body;

  try {
    const useCase = new AssignOrCreateTagForFolderUseCase(
      new FolderRepositoryImp(),
      new TagRepository()
    );
    const tag = await useCase.execute(folderId, { name, color });
    res.status(200).json({ message: "Tag created/assigned to folder", tag });
  } catch (err) {
    console.error("Create/Assign tag error:", err);
    res.status(500).json({ message: "Error creating or assigning tag" });
  }
}

// 2. Assign existing tag
export async function assignExistingTagController(req: Request, res: Response) {
  const { folderId, tagId } = req.body;

  try {
    const useCase = new AssignExistingTagToFolderUseCase(
      new FolderRepositoryImp(),
      new TagRepository()
    );
    await useCase.execute(folderId, tagId);
    res.status(200).json({ message: "Tag assigned to folder successfully" });
  } catch (err) {
    console.error("Assign tag error:", err);
    res.status(500).json({ message: "Error assigning tag" });
  }
}

// 3. Remove tag from folder
export async function removeTagFromFolderController(req: Request, res: Response) {
  const folderId = parseInt(req.params.folderId);

  try {
    const useCase = new RemoveTagFromFolderUseCase(new FolderRepositoryImp());
    await useCase.execute(folderId);
    res.status(200).json({ message: "Tag removed from folder" });
  } catch (err) {
    console.error("Remove tag error:", err);
    res.status(500).json({ message: "Error removing tag from folder" });
  }
}

// 4. Get folders by tag
export async function getFoldersByTagController(req: Request, res: Response) {
  const tagId = parseInt(req.params.tagId);

  try {
    const useCase = new GetFoldersByTagUseCase(new FolderRepositoryImp());
    const folders = await useCase.execute(tagId);
    res.status(200).json(folders);
  } catch (err) {
    console.error("Get folders by tag error:", err);
    res.status(500).json({ message: "Error fetching folders for tag" });
  }
}


// 5. delete tag

export async function deleteTagController(req: Request, res: Response) {
  const tagId = parseInt(req.params.tagId);

  try {
    const useCase = new DeleteTagUseCase(new TagRepository());
    await useCase.execute(tagId);
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    console.error("Delete tag error:", err);
    res.status(404).json({ message: "Tag not found or deletion failed" });
  }
}

export async function getTagByIdController(req: Request, res: Response) {
  const tagId = parseInt(req.params.tagId);

  try {
    const useCase = new GetTagByIdUseCase(new TagRepository());
    const tag = await useCase.execute(tagId);
    res.status(200).json(tag);
  } catch (err) {
    console.error("Get tag by ID error:", err);
    res.status(404).json({ message: "Tag not found" });
  }
}