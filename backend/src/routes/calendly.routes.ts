import express from 'express';
import { getAvailability, scheduleMeeting } from '../controllers/calendly.controller';
import { validateAvailability } from '../middleware/validation';

const router = express.Router();

router.get('/availability', validateAvailability, getAvailability);
router.post('/schedule', scheduleMeeting);

export default router;