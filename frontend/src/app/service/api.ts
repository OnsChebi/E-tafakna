import axios from "axios";

// Base API URL
const API_BASE = "http://localhost:5000/api";



const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject token before request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


// Global error handler
api.interceptors.response.use(
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
  getProfile: () => api.get("/expert/me"),
  updateProfile: (formData: FormData) =>
    api.put("/expert/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const clientApi = {
  getClientListe: () => api.get<ApiResponse>("/calendly/clients"),
};

export const MeetingToday = {
  getTodaysMeetings: () => api.get<MeetingApiResponse>("/calendly/today"),
};

export const upcomingMeeting = {
  getUpcomingMeetings: () => api.get<MeetingsApiResponse>("/calendly/upcoming"),
};

export const recentMeeting = {
  getRecentMeetings: () => api.get<MeetingApiResponse>("/calendly/past"),
};

export const busyDays = {
  getBusyDays: () => api.get<busyDatesResponse>("/calendly/busy"),
};
export const cancelMeeting = {
  cancel: (eventUri: string, reason: string) =>
    api.post("/calendly/cancel", { eventUri, reason }),
};


// Folder API
export const folderApi = {
  getAll: () => api.get("/folder"),
  create: (name: string) => api.post("/folder", { name }),
  getById: (id: number) => api.get(`/folder/${id}`),
  update: (id: number, name: string) => api.put(`/folder/${id}`, { name }),
  delete: (id: number) => api.delete(`/folder/${id}`),
};

// Note API
export type Note = {
  id: number;
  text: string;
  created_at: string;
  folder_id: number;
};

export const noteApi = {
  getByFolder: (folderId: number) => api.get(`/note/folder/${folderId}`),
  create: (note: { text: string; folderId: number }) => api.post("/note", note),
  getById: (id: number) => api.get(`/note/${id}`),
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

// ===== Types =====

export type ApiResponse = {
  clients: Client[];
};

export type Client = {
  name: string;
  email: string;
};

export type MeetingApiResponse = {
  events: CalendlyEvent[];
};

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

export default api;
