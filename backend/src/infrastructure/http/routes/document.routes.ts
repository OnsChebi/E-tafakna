import { Router } from "express";
import {
  getDocumentById,
  deleteDocumentById,
  getDocumentsByFolderId,
  getDocumentsByMeetingId,
  DocumentUploadController,
  
} from "../controllers/document.controller";
import { uploadDocument } from "../middlewares/multer";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/upload", uploadDocument.single("file"),DocumentUploadController);
router.get("/:id",authenticate, getDocumentById);
router.delete("/:id",authenticate, deleteDocumentById);
router.get("/folder/:folderId",authenticate, getDocumentsByFolderId);
router.get("/meeting/:meetingId",authenticate, getDocumentsByMeetingId);

export default router;
