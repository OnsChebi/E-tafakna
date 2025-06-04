import { Router } from "express";
import {
  createTask,
  getTasksByExpert,
  getTaskById,
  deleteTask,
} from "../controllers/task.controller";

const taskRoutes = Router();

taskRoutes.post("/", createTask);
taskRoutes.get("/expert/:expertId", getTasksByExpert);
taskRoutes.get("/:id", getTaskById);
taskRoutes.delete("/:id", deleteTask);

export default taskRoutes;
