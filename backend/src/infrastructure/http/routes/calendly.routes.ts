
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { MeetingController} from '../controllers/meeting.controller';
import { syncCalendlyMeetings } from '../controllers/Sync.controller';
import { getMeetingStats } from '../controllers/stat.controller';


const MeetingRoutes = Router();

MeetingRoutes.get('/busy', authenticate, MeetingController.busyDays);
MeetingRoutes.get('/today',authenticate,MeetingController.todaysMeetings);
MeetingRoutes.get('/upcoming',authenticate,MeetingController.upcomingMeetings);
MeetingRoutes.get('/past',authenticate,MeetingController.pastMeetings);
MeetingRoutes.get('/clients', authenticate,MeetingController.clientList); 
MeetingRoutes.post('/cancel', authenticate, MeetingController.cancelMeeting);
MeetingRoutes.post("/sync",authenticate, syncCalendlyMeetings);
MeetingRoutes.get("/stats", authenticate, getMeetingStats);

export default MeetingRoutes;
