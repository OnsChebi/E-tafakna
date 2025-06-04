import { Task } from "../entities/Task.entity";

export interface ITaskRepository {
  save(task: Task): Promise<Task>;
  findById(id: number): Promise<Task | null>;
  findByExpertId(expertId: number): Promise<Task[]>;
  findAll(): Promise<Task[]>;
  delete(id: number): Promise<void>;
}
