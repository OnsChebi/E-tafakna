import { Request, Response } from "express";
import { CreateTaskUseCase } from "../../../core/use-cases/task management/CreateTask";
import { GetTasksByExpertUseCase } from "../../../core/use-cases/task management/GetTasksByExpert";
import { GetTaskByIdUseCase } from "../../../core/use-cases/task management/GetTaskById";
import { DeleteTaskUseCase } from "../../../core/use-cases/task management/DeleteTask";
import { TaskRepository } from "../../database/repo/TaskRepositoryImp";
import { Task } from "../../../core/entities/Task.entity";
import { UpdateTaskUseCase } from "../../../core/use-cases/task management/UpdateTask";

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export class TaskController {
  constructor(
    private createTaskUseCase = new CreateTaskUseCase(new TaskRepository()),
    private getTasksByExpertUseCase = new GetTasksByExpertUseCase(new TaskRepository()),
    private getTaskByIdUseCase = new GetTaskByIdUseCase(new TaskRepository()),
    private deleteTaskUseCase = new DeleteTaskUseCase(new TaskRepository()),
    private updateTaskUseCase= new UpdateTaskUseCase(new TaskRepository()),
  ) {}

  async createTask(req: Request, res: Response) {
    const expertId = (req as AuthenticatedRequest).user?.id;
    if (!expertId) { res.status(401).json({ message: "Unauthorized" });}

    const { title, description, status, dueDate } = req.body;

    if (!title || !description || !dueDate) {
       res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const task = new Task();
      task.title = title;
      task.description = description;
      task.status = status || "pending";
      task.dueDate = dueDate;
      task.expert = { id: expertId } as any;

      const createdTask = await this.createTaskUseCase.execute(task);
      res.status(201).json(createdTask);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Error creating task" });
    }
  }

  async getTasks(req: Request, res: Response) {
    const expertId = (req as AuthenticatedRequest).user?.id;
    if (!expertId) {
      res.status(401).json({ message: "Unauthorized" });
      return
    }
    try {
      const tasks = await this.getTasksByExpertUseCase.execute(expertId);
      res.json(tasks);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Error fetching tasks" });
    }
  }

  async getTaskById(req: Request, res: Response) {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) { res.status(400).json({ message: "Invalid task ID" });}

    try {
      const task = await this.getTaskByIdUseCase.execute(taskId);
      if (!task) { res.status(404).json({ message: "Task not found" });}
      res.json(task);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Error fetching task" });
    }
  }

  async deleteTask(req: Request, res: Response) {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) { res.status(400).json({ message: "Invalid task ID" });}

    try {
      const deleted = await this.deleteTaskUseCase.execute(taskId);
      if (!deleted) { res.status(404).json({ message: "Task not found" });}

      res.json({ message: "Task deleted successfully" });
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Error deleting task" });
    }
  }
  async updateTask(req: Request, res: Response) {
    try {
      const taskId = parseInt(req.params.id);
      const { title, description, dueDate, status, expertId } = req.body;

      const updatedTask = await this.updateTaskUseCase.execute(
        taskId,
        title,
        description,
        new Date(dueDate),
        status,
        
      );

       res.status(200).json(updatedTask);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "Error updating task" });
    }
  }
}

