import { Api } from "./axios";

export const taskApi = {
  create: (task: { title: string; description: string; status?: string; dueDate: string; expertId: number }) =>
    Api.post("/task", task),

  getByExpert: () => Api.get("/task"),
  getById: (id: number) => Api.get(`/task/${id}`),
  update: (id: number, updates: { title: string; description: string; dueDate: string; status: "pending" | "in-progress" | "completed" }) =>
    Api.put(`/task/${id}`, updates),

  delete: (id: number) => Api.delete(`/task/${id}`),
};
