import { IExpertRepository } from "../../repositories/expert.repository";

export class getAllExperts {
  constructor(private expertRepo:IExpertRepository) {}

  async execute() {
    return this.expertRepo.getAll();
  }
}
