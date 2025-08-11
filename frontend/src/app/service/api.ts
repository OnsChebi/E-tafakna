import axios from "axios";

// Base API URL
const API_BASE = "http://localhost:5000/api";


const Api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});
const Api2 = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Add interceptors only to private API instance
Api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token && token !== "undefined" && token !== "null") {
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
export const cancelMeeting = {
  cancel: (eventUri: string, reason: string) =>
    Api.post("/calendly/cancel", { eventUri, reason }),
};
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
    delete: (id:number)=>Api.delete(`expert/${id}`),
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


export const stat ={
  getStat:()=>Api.get<CalendlyStats>("calendly/stats")
}

export const calendlySync = {
  syncMeetings: () => Api.post("/calendly/sync"),
};

export const adminOverview={
  getAdminOverview:()=> Api.get("calendly/admin/upcoming"),
}

export type CalendlyStats = {
  totalClients: number;
  todaysMeetings: number;
  upcomingMeetings: number;
  activeFolder: number;
  weeklyMeetings: { day: string; count: number }[];
  monthlyMeetings: { month: string; count: number }[];
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

//doc api
// ==== Document API ====


export const documentApi = {
  getAll: () => Api.get<DocumentType[]>("/doc"),
  getById: (id: number) => Api.get<DocumentType>(`/doc/${id}`),
  getByMeeting: (meetingId: number) =>
    Api.get<DocumentType[]>(`/doc/meeting/${meetingId}`),
  getByFolder: (folderId: number) =>
    Api.get<DocumentType[]>(`/doc/folder/${folderId}`),
    create: (formData: FormData) =>
    Api2.post("/doc/upload", formData),
  
  delete: (id: number) => Api.delete(`/doc/${id}`),
};

//tasks api 
export const taskApi = {
  create: (task: {
    title: string;
    description: string;
    status?: string;
    dueDate: string;
    expertId: number;
  }) => Api.post("/task", task),

  getByExpert:() => Api.get(`/task`),

  getById: (id: number) => Api.get(`/task/${id}`),

  delete: (id: number) => Api.delete(`/task/${id}`),
  update: (id: number, updates: {
    title: string;
    description: string;
    dueDate: string;
    status: "pending" | "in-progress" | "completed";
  }) => Api.put(`/task/${id}`, updates),

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


export type DocumentType = {
  id: number;
  title: string;
  url: string;
  type: string;
  uploadedAt: string;
  meeting?: {
    id: number;
    eventId: string;
    startTime: string;
    endTime: string;
    inviteeName: string;
    inviteeEmail: string;
    inviteeImage?: string | null;
    type: "Online" | "In person";
    status: string;
    meetingUrl?: string | null;
    reason?: string | null;
    created_at: string;
  };
  folder?: {
    id: number;
    name: string;
  };
};

// Export instances if needed elsewhere
export { Api };