import { Router } from 'express';
import { CalendarController } from '../controllers/calendly.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/busy', authenticate, CalendarController.getBusyDays);
router.get('/today',authenticate,CalendarController.getTodaysMeetings);
router.get('/upcoming',authenticate,CalendarController.getUpcomingMeetings);
router.get('/past',authenticate,CalendarController.getPastMeetings);
router.get('/clients', authenticate,CalendarController.getClientList); 
export default router;
