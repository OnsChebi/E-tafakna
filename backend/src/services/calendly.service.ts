import axios, { AxiosError } from 'axios';

export class CalendlyService {
  static async getCalendlyUserUri(accessToken: string): Promise<string> {
    try {
      const response = await axios.get("https://api.calendly.com/users/me", {
        headers: this.getHeaders(accessToken),
        timeout: 10000,
      });

      const uri = response.data.resource?.uri;
      if (!uri) throw new Error('Invalid Calendly user response');
      return uri;
    } catch (error) {
      throw this.handleAxiosError(error, 'Failed to get Calendly user URI');
    }
  }

  static async getScheduledEvents(
    accessToken: string,
    userUri: string,
    startTime?: string,
    endTime?: string,
    withDetails = false
  ):Promise<any[]> {
    try {
      const response = await axios.get("https://api.calendly.com/scheduled_events", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          user: userUri,
          // status: "active",
          // ...(startTime && { min_start_time: startTime }),
          // ...(endTime && { max_start_time: endTime }),
          // count: 100,
          // sort: 'start_time:asc',
          // invitees: 'true'
          min_start_time: startTime,
          max_start_time: endTime,
          count: 100
        },
        timeout: 15000,
      });

      const events = response.data.collection;
      if (!withDetails) return events;
      

      return events.map((event: any) => ({
        eventId: event.uri,
        startTime: event.start_time,
        endTime: event.end_time,
        title: event.name || 'Meeting',
        clientName: event.name || 'Unknown',
        clientEmail: event.email || 'Unknown',
        meetingType: this.getMeetingType(event.location?.type),
        meetingUrl: event.location?.join_url
      }));
    } catch (error) {
      throw this.handleAxiosError(error, 'Failed to fetch scheduled events');
    }
  }

  static async getTodaysEvents(accessToken: string, userUri: string) {
    const now = new Date();
    const start = new Date(now.setHours(0, 0, 0, 0)).toISOString();
    const end = new Date(now.setHours(23, 59, 59, 999)).toISOString();
    return this.getScheduledEvents(accessToken, userUri, start, end, true);
  }

  static async getUpcomingMeetings(token: string, userUri: string) {
    const start = new Date().toISOString();
    const end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    return this.getScheduledEvents(token, userUri, start, end, true);
  }

  static async getPastMeetings(token: string, userUri: string) {
    const now = new Date();
    const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const end = now.toISOString();
    return this.getScheduledEvents(token, userUri, start, end, true);
  }

  static async getClientList(token: string, userUri: string) {
    const events = await this.getScheduledEvents(token, userUri, undefined, undefined, true);

    const clients = events.map((event: any) => ({
      name: event.clientName,
      email: event.clientEmail,
    }));

    // Remove duplicates based on email
    const uniqueClients = Array.from(
      new Map(clients.map((client: { email: string; }) => [client.email, client])).values()
    );

    return uniqueClients;
  }

  private static getHeaders(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  private static getMeetingType(locationType: string): 'Online' | 'In person' {
    return locationType === 'physical' ? 'In person' : 'Online';
  }

  private static handleAxiosError(error: any, fallbackMessage: string): Error {
    if (error instanceof AxiosError) {
      console.error('Calendly API Error:', error.response?.data || error.message);
      return new Error(`Calendly API Error: ${error.response?.data?.message || error.message}`);
    }
    console.error('Unexpected Error:', error);
    return new Error(fallbackMessage);
  }
}
