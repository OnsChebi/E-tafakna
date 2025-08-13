import { Router } from "express";
import { FolderController } from "../controllers/folder.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();
const folderController = new FolderController();

router.post("/", authenticate, async (req, res) => {
  await folderController.createFolder(req, res);
});

router.get("/", authenticate, async (req, res) => {
    await folderController.getFolders(req, res);
  });

  router.get("/:id", authenticate, async (req, res) => {
    await folderController.getFolderById(req, res);
  });
  router.put("/:id", authenticate, async (req, res) => {
    await folderController.updateFolder(req, res);
  });

  router.delete("/:id", authenticate, async (req, res) => {
    await folderController.deleteFolder(req, res);
  });

  router.get("/tag/:tagId", authenticate, async (req, res) =>{
    await folderController.getFoldersByTagId(req, res);}
  );


export default router;
