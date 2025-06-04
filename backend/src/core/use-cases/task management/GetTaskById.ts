import { ITaskRepository } from "../../repositories/TaskRepository";

export class GetTaskByIdUseCase {
  constructor(private repo: ITaskRepository) {}

  async execute(id: number) {
    return await this.repo.findById(id);
  }
}
