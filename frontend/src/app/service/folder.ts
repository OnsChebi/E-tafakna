import { Api } from "./axios";

export const folderApi = {
  getAll: () => Api.get("/folder"),
  create: (name: string) => Api.post("/folder", { name }),
  getById: (id: number) => Api.get(`/folder/${id}`),
  update: (id: number, name: string) => Api.put(`/folder/${id}`, { name }),
  delete: (id: number) => Api.delete(`/folder/${id}`),
};
