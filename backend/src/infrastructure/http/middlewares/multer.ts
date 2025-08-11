import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Ensure directories exist
const createDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const UPLOADS_DIR = path.resolve(__dirname, '../../../uploads');

const PATHS = {
  PROFILE_IMAGES: path.join(UPLOADS_DIR, 'profile-images'),
  DOCUMENTS: path.join(UPLOADS_DIR, 'documents'),
};

createDir(PATHS.PROFILE_IMAGES);
createDir(PATHS.DOCUMENTS);

const MAX_SIZES = {
  PROFILE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
};

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

// Helper to get sanitized extension from originalname
function getSafeExtension(filename: string) {
  if (!filename) return '';  
  return path.extname(filename).toLowerCase();
}

// Profile image upload middleware
export const uploadProfileImage = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, PATHS.PROFILE_IMAGES),
    filename: (_, file, cb) => {
      const ext = getSafeExtension(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  limits: { fileSize: MAX_SIZES.PROFILE },
  fileFilter: (_, file, cb) => {
    if (ALLOWED_TYPES.IMAGES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG or WebP images are allowed.'));
    }
  },
});

// Document upload middleware
export const uploadDocument = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, PATHS.DOCUMENTS),
    filename: (_, file, cb) => {
      const ext = getSafeExtension(file.originalname);
      // Filename is UUID + original extension, to avoid duplicates and sanitize filenames
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  limits: { fileSize: MAX_SIZES.DOCUMENT },
  fileFilter: (_, file, cb) => {
    if (ALLOWED_TYPES.DOCS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed for documents.'));
    }
  },
});
