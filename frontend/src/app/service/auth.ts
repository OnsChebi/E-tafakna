import { Api } from "./axios";

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    try {
      const response = await Api.post("/expert/login", data);
      if (!response.data.success) throw new Error(response.data.message || "Login failed");

      const { accessToken, refreshToken, role, ...userData } = response.data.data;

      return { accessToken, refreshToken, role, ...userData };
    } catch (err: any) {
      throw err.response?.data || { message: err.message || "Login failed" };
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
  },
  register: (data: {
    name: string;
    email: string;
    password: string;
    accessToken: string;
    role:string;
  }) => Api.post("/expert/register", data),

  isAuthenticated: () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("authToken");
  },

  getAccessToken: () => typeof window !== "undefined" ? localStorage.getItem("authToken") : null,
  getRefreshToken: () => typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
};
