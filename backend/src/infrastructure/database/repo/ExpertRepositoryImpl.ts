import { IsNull, Not } from "typeorm";
import { Expert } from "../../../core/entities/Expert.entity";
import { IExpertRepository } from "../../../core/repositories/expert.repository";
import { AppDataSource } from "../db";

export class ExpertRepositoryImpl implements IExpertRepository {
  private repo = AppDataSource.getRepository(Expert);

  async create(expert: Expert): Promise<Expert> {
    return await this.repo.save(expert);
  }

  async findByEmail(email: string): Promise<Expert | null> {
    return await this.repo.findOneBy({ email });
  }

  async findById(id: number): Promise<Expert | null> {
    return this.repo.findOneBy({ id });
  }
  async findAll(): Promise<Expert[]> {
    return await this.repo.find();
  }
  

  async update(id: number, data: Partial<Expert>): Promise<Expert | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  
}
