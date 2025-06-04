import { Request, Response } from "express";
import { TagRepository } from "../../database/repo/TagRepositoryImp";
import { CreateTagUseCase } from "../../../core/use-cases/tag/CreateTag";

export async function createTagController(req: Request, res: Response) {
  const { name, color } = req.body;

  try {
    const useCase = new CreateTagUseCase(new TagRepository());
    const tag = await useCase.execute(name, color);
    res.status(201).json(tag);
  } catch (err) {
    console.error("Create tag error:", err);
    res.status(500).json({ message: "Error creating tag" });
  }
}
