import axios from 'axios';
import { ICalendlyRepository } from '../../../core/repositories/CalendlyRepository';
import { Expert } from '../../../core/entities/Expert.entity';
import { AppDataSource } from '../db';
import { Meeting } from '../../../core/entities/Meeting.entity';
import { decryptToken } from '../../../shared/utils/auth';

export class CalendlyRepositoryImpl implements ICalendlyRepository {
  async getAccessToken(expertId: number): Promise<string> {
    const expert = await AppDataSource.getRepository(Expert).findOneBy({ id: expertId });
    if (!expert?.accessToken) throw new Error("Calendly not connected");
    //console.log("Access token being used:", decryptToken(expert.accessToken));
    return decryptToken(expert.accessToken);
  }

  async getUserUri(token: string): Promise<string> {
    const res = await axios.get("https://api.calendly.com/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.resource.uri;
  }

  async getScheduledEvents(token: string, userUri: string, start?: string, end?: string): Promise<any[]> {
    const res = await axios.get("https://api.calendly.com/scheduled_events", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        user: userUri,
        min_start_time: start,
        max_start_time: end,
        count: 100,
      },
    });
    return res.data.collection;
  }

  async getInvitee(token: string, eventUri: string): Promise<any> {
    const eventId = eventUri.split('/').pop();
    const res = await axios.get(`https://api.calendly.com/scheduled_events/${eventId}/invitees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.collection[0] || null;
  }

  async getMeetings(token: string, userUri: string, startTime?: string, endTime?: string): Promise<Meeting[]> {
    const events = await this.getScheduledEvents(token, userUri, startTime, endTime);

    const meetings: Meeting[] = await Promise.all(events.map(async (event: any) => {
      const invitee = await this.getInvitee(token, event.uri);

      const meeting = new Meeting();
      meeting.eventId = event.uri;
      meeting.startTime = new Date(event.start_time);
      meeting.endTime = new Date(event.end_time);
      meeting.inviteeName = invitee?.name || 'Unknown';
      meeting.inviteeEmail = invitee?.email || 'Unknown';
      meeting.inviteeImage = invitee?.avatar_url || null;
      meeting.type = event.location?.join_url ? 'Online' : 'In person';
      meeting.meetingUrl = event.location?.join_url || null;
      meeting.expert = null as any; // You can set this if you're persisting
      meeting.created_at = new Date();

      return meeting;
    }));

    return meetings;
  }

  async getTodaysMeetings(token: string, userUri: string): Promise<Meeting[]> {
    const now = new Date();
    const start = new Date(now.setHours(0, 0, 0, 0)).toISOString();
    const end = new Date(now.setHours(23, 59, 59, 999)).toISOString();
    return this.getMeetings(token, userUri, start, end);
  }

  async getUpcomingMeetings(token: string, userUri: string): Promise<Meeting[]> {
    const start = new Date().toISOString();
    const end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    return this.getMeetings(token, userUri, start, end);
  }

  async getPastMeetings(token: string, userUri: string): Promise<Meeting[]> {
    const end = new Date().toISOString();
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    return this.getMeetings(token, userUri, start, end);
  }

  async getClientList(token: string, userUri: string): Promise<any[]> {
    const events = await this.getScheduledEvents(token, userUri);
    const invitees = await Promise.all(events.map(async (event: any) => {
      const invitee = await this.getInvitee(token, event.uri);
      return invitee ? { name: invitee.name, email: invitee.email } : null;
    }));

    const unique = new Map<string, any>();
    for (const client of invitees) {
      if (client && !unique.has(client.email)) {
        unique.set(client.email, client);
      }
    }

    return Array.from(unique.values());
  }
}
