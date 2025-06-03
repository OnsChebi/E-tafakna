import { Router } from "express";
import {
  getDocumentById,
  deleteDocumentById,
  getDocumentsByFolderId,
  getDocumentsByMeetingId,
  DocumentUploadController,
  
} from "../controllers/document.controller";
import { uploadDocument } from "../middlewares/multer";

const router = Router();

router.post("/upload", uploadDocument.single("file"), DocumentUploadController);
router.get("/:id", getDocumentById);
router.delete("/:id", deleteDocumentById);
router.get("/folder/:folderId", getDocumentsByFolderId);
router.get("/meeting/:meetingId", getDocumentsByMeetingId);

export default router;
