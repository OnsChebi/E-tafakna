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
  
    try {
      const decrypted = decryptToken(expert.accessToken);
      //console.log(" Decrypted token:", decrypted);
      return decrypted;
    } catch (err) {
      console.error(" Failed to decrypt token", err);
      throw new Error("Failed to decrypt Calendly token");
    }
  }
  

  async getUserUri(token: string): Promise<string> {
    try {
      const res = await axios.get("https://api.calendly.com/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.resource.uri;
    } catch (err: any) {
      console.error(" Failed to get Calendly user URI", err.response?.data || err.message);
      throw new Error("Calendly user URI fetch failed");
    }
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
    const activeEvents = res.data.collection.filter((event:Meeting)=>event.status ==='active');
    return activeEvents;
  }

  async getInvitee(token: string, eventUri: string): Promise<any> {
    const eventId = eventUri.split('/').pop();
    const res = await axios.get(`https://api.calendly.com/scheduled_events/${eventId}/invitees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.collection[0] || null;
  }
  //============= manage meetings ===========//

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
      meeting.status = event.status === 'canceled' ? 'canceled' : 'active';
      meeting.meetingUrl = event.location?.join_url || null;
      //meeting.expert = null as any; 
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

  async cancelMeeting(token: string, eventUri: string,reason:string): Promise<void> {
    try {
      const eventId = eventUri.split('/').pop();
      await axios.post(
        `https://api.calendly.com/scheduled_events/${eventId}/cancellation`,
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err: any) {
      console.error("Failed to cancel meeting", err.response?.data || err.message);
      throw new Error("Cancellation failed");
    }
  }
  

  async getClientList(token: string, userUri: string): Promise<any[]> {
    try {
      const events = await this.getScheduledEvents(token, userUri);
      const invitees = await Promise.all(events.map(async (event: any) => {
        try {
          const invitee = await this.getInvitee(token, event.uri);
          return invitee ? { name: invitee.name, email: invitee.email } : null;
        } catch (err:any) {
          console.warn(` Failed to get invitee for event ${event.uri}`, err.response?.data || err.message);
          return null;
        }
      }));
  
      const unique = new Map<string, any>();
      for (const client of invitees) {
        if (client && !unique.has(client.email)) {
          unique.set(client.email, client);
        }
      }
  
      return Array.from(unique.values());
    } catch (err:any) {
      console.error("Failed to get client list", err.response?.data || err.message);
      throw new Error("Client list fetch failed");
    }
  }
  
}
