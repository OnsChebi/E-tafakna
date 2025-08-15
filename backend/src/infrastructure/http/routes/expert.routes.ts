import { Router } from 'express';
import {
  loginController,
  registerExpertController,
  updateProfileController,
  getProfileController,
  getAllUsers,
  deleteUser,
} from '../controllers/expert.controller';
import { authenticate, authorize } from '../middlewares/auth';
import {  uploadProfileImage } from '../middlewares/multer';

const expertRouter = Router();

expertRouter.post('/register', registerExpertController);
expertRouter.get("/all", authenticate, authorize("admin"), getAllUsers);
expertRouter.delete("/:id", authenticate, authorize("admin"),deleteUser);
expertRouter.post('/login', loginController);
expertRouter.get('/me', authenticate, getProfileController);
expertRouter.put('/profile', authenticate,  uploadProfileImage.single('profileImage'), updateProfileController);

export default expertRouter;
