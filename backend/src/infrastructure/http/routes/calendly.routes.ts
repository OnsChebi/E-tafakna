
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { MeetingController} from '../controllers/meeting.controller';
import { syncCalendlyMeetings } from '../controllers/Sync.controller';


const MeetingRoutes = Router();

MeetingRoutes.get('/busy', authenticate,authorize("expert", "admin"), MeetingController.busyDays);
MeetingRoutes.get('/today',authenticate,MeetingController.todaysMeetings);
MeetingRoutes.get('/upcoming',authenticate,MeetingController.upcomingMeetings);
MeetingRoutes.get('/past',authenticate,MeetingController.pastMeetings);
MeetingRoutes.get('/clients', authenticate,MeetingController.clientList); 
MeetingRoutes.post('/cancel', authenticate, MeetingController.cancelMeeting);
MeetingRoutes.post("/sync", syncCalendlyMeetings);

export default MeetingRoutes;
