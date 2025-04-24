import { Request, Response } from 'express';
import { Expert } from '../entities/Expert.entity';
import { AppDataSource } from '../database/db';
import { CalendlyService } from '../services/calendly.service';

export class CalendarController {
  static async getBusyDays(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken } = await CalendarController.ensureCalendlyConnection(req, res);
      if (!accessToken) return;

      const userUri = await CalendlyService.getCalendlyUserUri(accessToken);
      const now = new Date();
      const startTime = now.toISOString();
      const endTime = new Date(now.setDate(now.getDate() + 30)).toISOString();

      const events = await CalendlyService.getScheduledEvents(accessToken, userUri, startTime, endTime);

      const busyDates = events.map((event: any) =>
        new Date(event.start_time).toISOString().split('T')[0]
      );
      const uniqueBusyDates = [...new Set(busyDates)];

      res.status(200).json({ busyDates: uniqueBusyDates });
    } catch (error: any) {
      console.error('Busy days error:', error.response?.data || error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async getTodaysMeetings(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken } = await CalendarController.ensureCalendlyConnection(req, res);
      if (!accessToken) return;

      const userUri = await CalendlyService.getCalendlyUserUri(accessToken);
      const events = await CalendlyService.getTodaysEvents(accessToken, userUri);

      res.status(200).json({ events });
    } catch (error: any) {
      console.error('Today meetings error:', error.response?.data || error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async getUpcomingMeetings(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken } = await CalendarController.ensureCalendlyConnection(req, res);
      if (!accessToken) return;

      const userUri = await CalendlyService.getCalendlyUserUri(accessToken);
      const events = await CalendlyService.getUpcomingMeetings(accessToken, userUri);

      res.status(200).json({ events });
    } catch (error: any) {
      console.error('Upcoming meetings error:', error.response?.data || error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async getPastMeetings(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken } = await CalendarController.ensureCalendlyConnection(req, res);
      if (!accessToken) return;

      const userUri = await CalendlyService.getCalendlyUserUri(accessToken);
      const events = await CalendlyService.getPastMeetings(accessToken, userUri);

      res.status(200).json({ events });
    } catch (error: any) {
      console.error('Past meetings error:', error.response?.data || error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async getClientList(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken } = await CalendarController.ensureCalendlyConnection(req, res);
      if (!accessToken) return;

      const userUri = await CalendlyService.getCalendlyUserUri(accessToken);
      const events = await CalendlyService.getScheduledEvents(accessToken, userUri, undefined, undefined, true);
      const uniqueClients = new Map<string , any>();
      events.forEach((event:any)=>{
        if (event.clientEmail){
          const email=event.clientEmail.toLowerCase().trim();
          if(!uniqueClients.has(email)){
            uniqueClients.set(email,{
              name:event.clientName?.trim() || 'Unknown',
              email:email
            })
          }
        }
      })
      
      const clients = Array.from(uniqueClients.values());

      res.status(200).json({ clients });
    } catch (error: any) {
      console.error('Client list error:', error.response?.data || error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  private static async ensureCalendlyConnection(req: Request, res: Response): Promise<{ accessToken?: string }> {
    const expertId = (req as any).user?.id;

    const expert = await AppDataSource.getRepository(Expert).findOne({
      where: { id: expertId },
    });

    if (!expert || !expert.calendly_access_token) {
      res.status(404).json({ message: 'Calendly account not connected' });
      return {};
    }

    return { accessToken: expert.calendly_access_token };
  }
}
