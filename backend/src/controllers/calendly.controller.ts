import { Request, Response } from 'express';
import { Expert } from '../entities/Expert.entity';
import { AppDataSource } from '../database/db';
import { CalendlyService } from '../services/calendly.service';

export class CalendarController {
  static async getBusyDays(req: Request, res: Response): Promise<void> {
    try {
      const expertId = (req as any).user?.id;

      const expert = await AppDataSource.getRepository(Expert).findOne({
        where: { id: expertId },
      });

      if (!expert || !expert.calendly_access_token) {
        res.status(404).json({ message: 'Calendly account not connected' });
        return;
      }

      // Always get fresh userUri in case it was stored incorrectly before
      const userUri = await CalendlyService.getCalendlyUserUri(expert.calendly_access_token);
      console.log('✅ Calendly URN:', userUri);

      // Optional: you could update expert.calendly_user_uri in the DB here if needed

      const now = new Date();
      const startTime = now.toISOString();
      const endTime = new Date(now.setDate(now.getDate() + 30)).toISOString(); // next 30 days

      const events = await CalendlyService.getScheduledEvents(
        expert.calendly_access_token,
        userUri,
        startTime,
        endTime
      );

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
}
