import { Api } from "./axios";

// Meeting types
export type CalendlyEvent = {
  eventId: string;
  startTime: string;
  endTime: string;
  inviteeName: string;
  inviteeEmail: string;
  meetingType: "Online" | "In person";
  meetingUrl?: string;
  status: string;
  created_at: string;
};

export type Meeting = {
  eventId: string;
  startTime: string;
  inviteeName: string;
  inviteeEmail: string;
};

export type MeetingsApiResponse = {
  events: Meeting[];
};
export type busyDatesResponse = { busyDays: string[] };

export type CalendlyStats = {
  totalClients: number;
  todaysMeetings: number;
  upcomingMeetings: number;
  activeFolder: number;
  weeklyMeetings: { day: string; count: number }[];
  monthlyMeetings: { month: string; count: number }[];
  meetingTypes: { type: string; count: number }[];
};

// Client type
export type Client = {
  name: string;
  email: string;
};

export const calendlyApi = {
  // Todays meetings
  getTodaysMeetings: () => Api.get<CalendlyEvent[]>("/calendly/today"),

  // Upcoming meetings
  getUpcomingMeetings: () => Api.get<CalendlyEvent[]>("/calendly/upcoming"),

  // Past meetings
  getRecentMeetings: () => Api.get<CalendlyEvent[]>("/calendly/past"),

  // Busy days
  getBusyDays: () => Api.get<busyDatesResponse>("/calendly/busy"),

  // Admin overview
  getAdminOverview: () => Api.get("/calendly/admin/upcoming"),

  // Sync meetings
  syncMeetings: () => Api.post("/calendly/sync"),

  // Stats
  getStats: () => Api.get<CalendlyStats>("/calendly/stats"),

  // Clients
  getClientListe: () => Api.get<Client[]>("/calendly/clients"),
  //cancel meeting
  cancel: (eventUri: string, reason: string) =>Api.post("/calendly/cancel", { eventUri, reason }),
};
