import { IExpertRepository } from "../../repositories/expert.repository"

export class DeleteExpert {
    constructor(private expertRepo:IExpertRepository) {}

  async execute( expertId: number) {
    return this.expertRepo.delete(expertId);
  }
}