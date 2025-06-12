import { ITaskRepository } from "../../repositories/TaskRepository";
import { Task } from "../../entities/Task.entity";

export class UpdateTaskUseCase {
  constructor(private taskRepo: ITaskRepository) {}

  async execute(
    taskId: number,
    title: string,
    description: string,
    dueDate: Date,
    status: "pending" | "in-progress" | "completed",
    
  ): Promise<Task> {

    const task = await this.taskRepo.findById(taskId);
    if (!task) throw new Error("Task not found");

    console.log("expertId test",task.expert.id)
    if (!task.expert.id ) {
      throw new Error("Unauthorized");
    }

    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.status = status;

    return this.taskRepo.save(task);
  }
}
