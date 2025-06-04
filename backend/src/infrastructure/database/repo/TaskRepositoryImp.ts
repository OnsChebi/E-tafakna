import { ITaskRepository } from "../../../core/repositories/TaskRepository";
import { Task } from "../../../core/entities/Task.entity";
import { AppDataSource } from "../db";
import { Repository } from "typeorm";

export class TaskRepository implements ITaskRepository {
  private repository: Repository<Task>;

  constructor() {
    this.repository = AppDataSource.getRepository(Task);
  }

  async save(task: Task): Promise<Task> {
    return await this.repository.save(task);
  }

  async findById(id: number): Promise<Task | null> {
    return await this.repository.findOne({ where: { id }, relations: ["expert"] });
  }

  async findByExpertId(expertId: number): Promise<Task[]> {
    return await this.repository.find({
      where: { expert: { id: expertId } },
      relations: ["expert"],
    });
  }

  async findAll(): Promise<Task[]> {
    return await this.repository.find({ relations: ["expert"] });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
