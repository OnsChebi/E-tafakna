import { ITaskRepository } from "../../repositories/TaskRepository";

export class GetTasksByExpertUseCase {
  constructor(private repo: ITaskRepository) {}

  async execute(expertId: number) {
    return await this.repo.findByExpertId(expertId);
  }
}
