import { Router } from 'express';
import {
  loginController,
  registerExpertController,
  updateProfileController,
  getProfileController,
} from '../controllers/expert.controller';
import { authenticate } from '../middlewares/auth';
import { upload } from '../middlewares/multer';

const expertRouter = Router();

expertRouter.post('/register', registerExpertController);
expertRouter.post('/login', loginController);
expertRouter.get('/me', authenticate, getProfileController);
expertRouter.put('/profile', authenticate, upload.single('profileImage'), updateProfileController);

export default expertRouter;
