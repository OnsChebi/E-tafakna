import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { CalendlyController } from '../controllers/calendly.controller';


const calendlyRoutes = Router();

calendlyRoutes.get('/busy', authenticate, CalendlyController.busyDays);
calendlyRoutes.get('/today',authenticate,CalendlyController.todaysMeetings);
calendlyRoutes.get('/upcoming',authenticate,CalendlyController.upcomingMeetings);
calendlyRoutes.get('/past',authenticate,CalendlyController.pastMeetings);
calendlyRoutes.get('/clients', authenticate,CalendlyController.clientList); 
calendlyRoutes.post('/cancel', authenticate, CalendlyController.cancelMeeting);

export default calendlyRoutes;
