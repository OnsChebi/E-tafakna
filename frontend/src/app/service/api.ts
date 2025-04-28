// api.ts
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Clients API
export const clientApi = {
  getClientList: () => api.get<ApiResponse>("/calendly/clients"),

  // Add a new function to fetch busy dates
  getBusyDates: () => api.get<{ busyDates: string[] }>("/calendly/busy"),
};

export type ApiResponse = {
  clients: Client[];
};

export type Client = {
  name: string;
  email: string;
  image?: string;
};

// Meetings API
export const MeetingToday = {
  getTodaysMeetings: () => api.get<MeetingApiResponse>("/calendly/today"),
};

export const upcomingMeeting = {
  getUpcomingMeetings: () => api.get<MeetingsApiResponse>("/calendly/upcoming"),
};

export const  recentMeeting = {
  getRecentMeetings: ()=> api.get<MeetingApiResponse>("/calendly/past")
}

export type MeetingApiResponse = {
  events: CalendlyEvent[];
};

export type CalendlyEvent = {
  eventId: string;
  startTime: string;
  endTime: string;
  title: string;
  clientName: string;
  clientEmail: string;
  meetingType: "Online" | "In person";
};

export type Meeting = {
  eventId: string;
  startTime: string;
  clientName: string;
};

export type MeetingsApiResponse = {
  events: Meeting[];
};

// Folders API
export const folderApi = {
  getAll: () => api.get("/folder/all"),
  create: (name: string) => api.post("/folder", { name }),
  update: (id: number, name: string) => api.put(`/folder/${id}`, { name }),
  delete: (id: number) => api.delete(`/folder/${id}`),
};

// Notes API
export const noteApi = {
  getByFolder: (folderId: number) => api.get(`/note/folder/${folderId}`),
  create: (note: { text: string; folderId: number }) => api.post("/note", note),
  update: (id: number, text: string) => api.put(`/note/${id}`, { text }),
  delete: (id: number) => api.delete(`/note/${id}`),
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

export default api;
