import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { TaskController } from "../controllers/task.controller";

const taskRoutes = Router();
const taskController = new TaskController();

// Create task
taskRoutes.post("/", authenticate, (req, res) => taskController.createTask(req, res));

// Get all tasks for authenticated expert
taskRoutes.get("/", authenticate, (req, res) => taskController.getTasks(req, res));

// Get task by ID
taskRoutes.get("/:id", authenticate, (req, res) => taskController.getTaskById(req, res));

// Delete task by ID
taskRoutes.delete("/:id", authenticate, (req, res) => taskController.deleteTask(req, res));

export default taskRoutes;
