import { Task } from "../entities/Task.entity";

export interface ITaskRepository {
  updatetask(
    taskId: number,
    title: string,
    description: string,
    dueDate: Date,
    status: "pending" | "in-progress" | "completed"
  ): Promise<Task>;
  save(task: Task): Promise<Task>;
  findById(id: number): Promise<Task | null>;
  findByExpertId(expertId: number): Promise<Task[]>;
  findAll(): Promise<Task[]>;
  delete(id: number): Promise<void>;
}
