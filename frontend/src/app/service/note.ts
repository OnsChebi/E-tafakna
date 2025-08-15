import { Api } from "./axios";

export type Note = { id: number; text: string; created_at: string; folder_id: number };

export const noteApi = {
  getByFolder: (folderId: number) => Api.get(`/note/folder/${folderId}`),
  create: (note: { text: string; folderId: number }) => Api.post("/note", note),
  getById: (id: number) => Api.get(`/note/${id}`),
  update: (id: number, text: string) => Api.put(`/note/${id}`, { text }),
  delete: (id: number) => Api.delete(`/note/${id}`),
};
