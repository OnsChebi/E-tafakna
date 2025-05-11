import { Expert } from "../../../core/entities/Expert.entity";
import { AppDataSource } from "../db";

export class ExpertRepositoryImpl implements ExpertRepositoryImpl {
  private repo = AppDataSource.getRepository(Expert);

  async create(expert: Expert): Promise<Expert> {
    return await this.repo.save(expert);
  }

  async findByEmail(email: string): Promise<Expert | null> {
    return await this.repo.findOneBy({ email });
  }
}
