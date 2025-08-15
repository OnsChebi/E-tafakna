import { Api } from "./axios";

export type Tag = { id: number; name: string; color: string };

export const tagApi = {
  createAndAssignTag: (folderId: number, name: string, color: string) =>
    Api.post("/tag/create", { folderId, name, color }),

  assignExistingTagToFolder: (folderId: number, tagId: number) =>
    Api.post("/tag/assign", { folderId, tagId }),

  removeTagFromFolder: (folderId: number, tagId: number) =>
    Api.post("/tag/remove", { folderId, tagId }),

  deleteTag: (tagId: number) => Api.delete(`/tag/${tagId}`),
  getTagById: (tagId: number) => Api.get<Tag>(`/tag/${tagId}`),
  getAllTags: () => Api.get<Tag[]>("/tag/"),
  getTagsByFolder: (folderId: number) => Api.get<Tag[]>(`/tag/folder/${folderId}`),
};
