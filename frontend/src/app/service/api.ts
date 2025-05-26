import axios from "axios";

// Base API URL
const API_BASE = "http://localhost:5000/api";


const Api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors only to private API instance
Api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      } else if (error.response?.status === 500) {
        console.error("Internal Server Error:", error.response?.data);
      }
    }
    return Promise.reject(error);
  }
);

// ==== API Services ====
export const expertApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    accessToken: string;
    role:string;
  }) => Api.post("/expert/register", data),


  getProfile: () => Api.get("/expert/me"),
  updateProfile: (formData: FormData) =>
    Api.put("/expert/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
    getAll: ()=> Api.get("/expert/all"),
    delete: (id:number)=>Api.delete(`/${id}`),
};

export const clientApi = {
  getClientListe: () => Api.get<Client[]>("/calendly/clients"),
};

export const MeetingToday = {
  getTodaysMeetings: () => Api.get<CalendlyEvent[]>("/calendly/today"),
};

export const upcomingMeeting = {
  getUpcomingMeetings: () => Api.get<CalendlyEvent[]>("/calendly/upcoming"),
};

export const recentMeeting = {
  getRecentMeetings: () => Api.get<CalendlyEvent[]>("/calendly/past"),
};

export const busyDays = {
  getBusyDays: () => Api.get<busyDatesResponse>("/calendly/busy"),
};

export const cancelMeeting = {
  cancel: (eventUri: string, reason: string) =>
    Api.post("/calendly/cancel", { eventUri, reason }),
};

export const stat ={
  getStat:()=>Api.get<CalendlyStats>("calendly/stats")
}

export type CalendlyStats = {
  totalClients: number;
  todaysMeetings: number;
  upcomingMeetings: number;
  activeFolder: number;
  weeklyMeetings: { day: string; count: number }[];
  meetingTypes: { type: string; count: number }[];
};

// Folder API
export const folderApi = {
  getAll: () => Api.get("/folder"),
  create: (name: string) => Api.post("/folder", { name }),
  getById: (id: number) => Api.get(`/folder/${id}`),
  update: (id: number, name: string) => Api.put(`/folder/${id}`, { name }),
  delete: (id: number) => Api.delete(`/folder/${id}`),
};

// Note API
export type Note = {
  id: number;
  text: string;
  created_at: string;
  folder_id: number;
};

export const noteApi = {
  getByFolder: (folderId: number) => Api.get(`/note/folder/${folderId}`),
  create: (note: { text: string; folderId: number }) => Api.post("/note", note),
  getById: (id: number) => Api.get(`/note/${id}`),
  update: (id: number, text: string) => Api.put(`/note/${id}`, { text }),
  delete: (id: number) => Api.delete(`/note/${id}`),
};

// Auth Utilities
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("authToken");
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  }
};

// ===== Type Definitions =====
// export type ApiResponse = {
//   clients: Client[];
// };

export type Client = {
  name: string;
  email: string;
};

// export type MeetingApiResponse = {
//   events: CalendlyEvent[];
// };

export type busyDatesResponse = {
  busyDays: string[];
};

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
 // meetingUrl:string;
};

export type MeetingsApiResponse = {
  events: Meeting[];
};

// Export instances if needed elsewhere
export { Api };