
//calendlyRepo
import axios from 'axios';
import { ICalendlyRepository } from '../../../core/repositories/CalendlyRepository';
import { Expert } from '../../../core/entities/Expert.entity';
import { AppDataSource } from '../db';
import { Meeting } from '../../../core/entities/Meeting.entity';
import { decryptToken } from '../../../shared/utils/auth';

export class CalendlyRepositoryImpl implements ICalendlyRepository {
  
  async getAccessToken(expertId: number): Promise<string> {
    const expert = await AppDataSource.getRepository(Expert).findOneBy({ id: expertId });
    console.log("getAccessToken " , expert)
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


  async cancelMeeting(token: string, eventUri: string, reason: string): Promise<void> {
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
      const calendlyError = err.response?.data;
  
      // If Calendly says it's already canceled, skip rethrowing
      if (calendlyError?.message === "Event is already canceled") {
        console.warn("Meeting was already canceled in Calendly. Proceeding to update local DB.");
        return;
      }
  
      console.error("Failed to cancel meeting", calendlyError || err.message);
      throw new Error("Cancellation failed");
    }
  }
  
  

  async getClientList(token: string, userUri: string): Promise<{ name: string; email: string }[]> {
    const response = await axios.get("https://api.calendly.com/scheduled_events", {
      headers: { Authorization: `Bearer ${token}` },
      params: { user: userUri },
    });

    const clients: { name: string; email: string }[] = [];

    for (const event of response.data.collection) {
      const inviteeResponse = await axios.get(`${event.uri}/invitees`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const invitee = inviteeResponse.data.collection[0];
      if (invitee) {
        clients.push({ name: invitee.name, email: invitee.email });
      }
    }

    return clients;
  }
}
