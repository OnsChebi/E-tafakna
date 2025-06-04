import { Task } from "../../entities/Task.entity";
import { ITaskRepository } from "../../repositories/TaskRepository";

export class CreateTaskUseCase {
  constructor(private repo: ITaskRepository) {}

  async execute(task: Task) {
    return await this.repo.save(task);
  }
}
