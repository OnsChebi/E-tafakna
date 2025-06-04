import { Expert } from "../../entities/Expert.entity";
import { IExpertRepository } from "../../repositories/expert.repository";

export const updateExpertProfileUseCase = async (
  expertId: number,
  data: Partial<Expert>,
  expertRepo: IExpertRepository
): Promise<Expert | null> => {
  return await expertRepo.update(expertId, data);
};
