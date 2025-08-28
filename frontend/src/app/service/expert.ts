import { Api} from "./axios";

export const expertApi = {
  getProfile: () => Api.get("/expert/me"),
  updateProfile: (formData: FormData) => Api.put("/expert/profile", formData),
  getAll: () => Api.get("/expert/all"),
  delete: (id: number) => Api.delete(`/expert/${id}`),
};
