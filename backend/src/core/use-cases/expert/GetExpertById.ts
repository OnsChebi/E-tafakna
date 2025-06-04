import { IExpertRepository } from "../../repositories/expert.repository";
import { Expert } from "../../entities/Expert.entity";

export const getExpertByIdUseCase = async (
  id: number,
  expertRepo: IExpertRepository
): Promise<Expert | null> => {
  return await expertRepo.findById(id);
};
