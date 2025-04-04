import { Request, Response } from 'express';
import {
  getCalendlyUserUri,
  getScheduledEvents,
  createCalendlyEvent
} from '../services/calendly.service';

export const getAvailability = async (req: Request, res: Response) => {
  try {
    const { month } = req.query;
    //user's calendly id
    const userUri = await getCalendlyUserUri();
    //calcul date range for the entire month
    const startDate = new Date(`${month}-01T00:00:00Z`);//first day 00:00
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);//last day at 23:59
    //fetch event mn calendly
    const events = await getScheduledEvents(userUri, startDate.toISOString(), endDate.toISOString());
    //bch n5arjou w dates (without time)
    const busyDays = events.map((event: any) => event.start_time.split('T')[0]);
    //send succ res with busy days
    res.json({ busyDays });
  } catch (error) {
    console.error('Availability error:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

export const scheduleMeeting = async (req: Request, res: Response) => {
  try {
    const { eventTypeUri, email, startTime } = req.body;
    const event = await createCalendlyEvent(eventTypeUri, email, startTime);
    //send back the created event 
    res.json(event);
  } catch (error) {
    console.error('Scheduling error:', error);
    res.status(500).json({ error: 'Failed to schedule meeting' });
  }
};