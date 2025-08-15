import { Api, ApiMultipart } from "./axios";

export type DocumentType = {
  id: number;
  title: string;
  url: string;
  type: string;
  uploadedAt: string;
  meeting?: any;
  folder?: any;
};

export const documentApi = {
  getAll: () => Api.get<DocumentType[]>("/doc"),
  getById: (id: number) => Api.get<DocumentType>(`/doc/${id}`),
  getByMeeting: (meetingId: number) => Api.get<DocumentType[]>(`/doc/meeting/${meetingId}`),
  getByFolder: (folderId: number) => Api.get<DocumentType[]>(`/doc/folder/${folderId}`),
  create: (formData: FormData) => ApiMultipart.post("/doc/upload", formData),
  delete: (id: number) => Api.delete(`/doc/${id}`),
};
