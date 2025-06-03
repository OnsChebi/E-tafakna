
import { Router } from 'express';
import { DocumentUploadController } from '../controllers/document.controller';
import { uploadDocument } from '../middlewares/multer';

const docRoutes = Router();

docRoutes.post('/upload', uploadDocument.single('file'), DocumentUploadController);

export default docRoutes