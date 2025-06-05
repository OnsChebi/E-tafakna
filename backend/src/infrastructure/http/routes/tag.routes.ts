import { Router } from "express";
import {  assignExistingTagController, createOrAssignTagController, deleteTagController, getFoldersByTagController, getTagByIdController, removeTagFromFolderController } from "../controllers/tag.controller";


const tagRoutes = Router();

tagRoutes.post("/create", createOrAssignTagController);
tagRoutes.post("/assign", assignExistingTagController);
tagRoutes.delete("/remove/:folderId", removeTagFromFolderController);
tagRoutes.get("/:tagId", getFoldersByTagController);
tagRoutes.delete("/:tagId",deleteTagController);
tagRoutes.get("/tagdata/:tagId",getTagByIdController)


export default tagRoutes;
