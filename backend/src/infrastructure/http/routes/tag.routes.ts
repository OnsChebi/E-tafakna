import { Router } from "express";
import {
  createOrAssignTagController,
  assignExistingTagController,
  deleteTagController,
  getTagByIdController,
  removeTagFromFolderController,
  getAllTagsController,
  getTagByFolderId,   
} from "../controllers/tag.controller";

const tagRoutes = Router();
tagRoutes.post("/create", createOrAssignTagController);
tagRoutes.post("/assign", assignExistingTagController);
tagRoutes.post("/remove", removeTagFromFolderController);
tagRoutes.delete("/:tagId", deleteTagController);
tagRoutes.get("/:tagId", getTagByIdController);
tagRoutes.get("/", getAllTagsController);
tagRoutes.get("/folder/:folderId", getTagByFolderId);

export default tagRoutes;
