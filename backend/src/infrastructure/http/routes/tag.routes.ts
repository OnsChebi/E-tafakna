import { Router } from "express";
import { createTagController } from "../controllers/tag.controller";
const tagRoutes = Router();

tagRoutes.post("/", createTagController);

export default tagRoutes;
