import { Router } from 'express';
import { loginController, registerExpertController } from '../controllers/expert.controller';

const expertRouter = Router();
expertRouter.post('/register', registerExpertController);
expertRouter.post('/login',loginController);
export default expertRouter;