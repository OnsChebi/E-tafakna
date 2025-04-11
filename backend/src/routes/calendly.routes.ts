import { Router } from 'express';
import { CalendarController } from '../controllers/calendly.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/busy', authenticate, CalendarController.getBusyDays);

export default router;
