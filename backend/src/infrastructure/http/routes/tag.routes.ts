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
import { authenticate } from "../middlewares/auth";

const tagRoutes = Router();
tagRoutes.post("/create", authenticate, createOrAssignTagController);
tagRoutes.post("/assign",authenticate, assignExistingTagController);
tagRoutes.post("/remove", authenticate,removeTagFromFolderController);
tagRoutes.delete("/:tagId",authenticate, deleteTagController);
tagRoutes.get("/:tagId",authenticate, getTagByIdController);
tagRoutes.get("/",authenticate, getAllTagsController);
tagRoutes.get("/folder/:folderId",authenticate, getTagByFolderId);

export default tagRoutes;
