import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Create directories if they don't exist
const createDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Base uploads directory
const UPLOADS_DIR = path.resolve(__dirname, '../../../uploads');

// Configure paths
const PATHS = {
  PROFILE_IMAGES: path.join(UPLOADS_DIR, 'profile-images'),
  DOCUMENTS: path.join(UPLOADS_DIR, 'documents')
};

// Create directories
createDir(PATHS.PROFILE_IMAGES);
createDir(PATHS.DOCUMENTS);

// File size limits
const MAX_SIZES = {
  PROFILE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024 // 10MB
};

// Allowed file types
const ALLOWED_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/webp'],
  DOCS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg'
  ]
};

// Profile image upload middleware
export const uploadProfileImage = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, PATHS.PROFILE_IMAGES),
    filename: (_, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    }
  }),
  limits: { fileSize: MAX_SIZES.PROFILE },
  fileFilter: (_, file, cb) => {
    if (ALLOWED_TYPES.IMAGES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images JPG, PNG ou WebP sont autorisées.'));
    }
  }
});

// Document upload middleware with duplicate check
export const uploadDocument = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, PATHS.DOCUMENTS),
    filename: (_, file, cb) => {
      const filename = file.originalname;
      const filePath = path.join(PATHS.DOCUMENTS, filename);
      
      if (fs.existsSync(filePath)) {
        cb(new Error('Un fichier avec ce nom existe déjà. Veuillez le renommer.'), '');
      } else {
        cb(null, filename);
      }
    }
  }),
  limits: { fileSize: MAX_SIZES.DOCUMENT },
  fileFilter: (_, file, cb) => {
    if (ALLOWED_TYPES.DOCS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé pour les documents.'));
    }
  }
});