import { ITaskRepository } from "../../repositories/TaskRepository";

export class DeleteTaskUseCase {
  constructor(private repo: ITaskRepository) {}

  async execute(id: number): Promise<boolean> {
    const task = await this.repo.findById(id);
    if (!task) return false;
    await this.repo.delete(id);
    return true;
  }
}
