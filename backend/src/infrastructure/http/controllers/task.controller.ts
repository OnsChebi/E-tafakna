import { Request, Response } from "express";
import { TaskRepository } from "../../database/repo/TaskRepositoryImp";
import { Task } from "../../../core/entities/Task.entity";
import { CreateTaskUseCase } from "../../../core/use-cases/task management/CreateTask";
import { GetTasksByExpertUseCase } from "../../../core/use-cases/task management/GetTasksByExpert";
import { GetTaskByIdUseCase } from "../../../core/use-cases/task management/GetTaskById";
import { DeleteTaskUseCase } from "../../../core/use-cases/task management/DeleteTask";

const taskRepo = new TaskRepository();

export const createTask = async (req: Request, res: Response) => {
  const { title, description, status, dueDate, expertId } = req.body;

  const task = new Task();
  task.title = title;
  task.description = description;
  task.status = status || "pending";
  task.dueDate = dueDate;
  task.expert = { id: expertId } as any;

  const useCase = new CreateTaskUseCase(taskRepo);
  const result = await useCase.execute(task);

  res.status(201).json(result);
};

export const getTasksByExpert = async (req: Request, res: Response) => {
  const expertId = Number(req.params.expertId);
  const useCase = new GetTasksByExpertUseCase(taskRepo);
  const tasks = await useCase.execute(expertId);

  res.json(tasks);
};

export const getTaskById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const useCase = new GetTaskByIdUseCase(taskRepo);
  const task = await useCase.execute(id);

  if (!task)  res.status(404).json({ message: "Task not found" });
  res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const useCase = new DeleteTaskUseCase(taskRepo);
  const deleted = await useCase.execute(id);

  if (!deleted)  res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted successfully" });
};
