import { Router } from 'express';
import {
  loginController,
  registerExpertController,
  updateProfileController,
  getProfileController,
  getAllUsers,
  deleteUser,
} from '../controllers/expert.controller';
import { authenticate } from '../middlewares/auth';
import { upload } from '../middlewares/multer';

const expertRouter = Router();

expertRouter.post('/register', registerExpertController);

expertRouter.get("/all", getAllUsers);
expertRouter.delete("/:id", deleteUser);
expertRouter.post('/login', loginController);
expertRouter.get('/me', authenticate, getProfileController);
expertRouter.put('/profile', authenticate, upload.single('profileImage'), updateProfileController);

export default expertRouter;
