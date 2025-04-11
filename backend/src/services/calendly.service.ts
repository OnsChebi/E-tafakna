import axios from 'axios';

export class CalendlyService {
  static async getCalendlyUserUri(accessToken: string) {
    const response = await axios.get("https://api.calendly.com/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.resource.uri; // This returns the correct "urn:calendly:user:..." format
  }

  static async getScheduledEvents(accessToken: string, userUri: string, startTime: string, endTime: string) {
    console.log("📡 Calendly Request URI:", userUri);

    const response = await axios.get("https://api.calendly.com/scheduled_events", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        user: userUri, // Must be in URN format
        status: "active",
        ...(startTime && { min_start_time: startTime }),
        ...(endTime && { max_start_time: endTime }),
      },
    });

    return response.data.collection;
  }
}
