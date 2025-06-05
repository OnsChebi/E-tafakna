import { ITagRepository } from "../../../core/repositories/TagRepository";
import { Tag } from "../../../core/entities/Tag.entity";
import { AppDataSource } from "../db";
import { Repository, In } from "typeorm";

export class TagRepository implements ITagRepository {
  private repo: Repository<Tag> = AppDataSource.getRepository(Tag);

  async create(tag: Tag): Promise<Tag> {
    return await this.repo.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return await this.repo.find();
  }

  async findById(id: number): Promise<Tag | null> {
    return await this.repo.findOneBy({ id });
  }

  async findByIds(ids: number[]): Promise<Tag[]> {
    return await this.repo.findBy({ id: In(ids) });
  }

  async findByName(name: string): Promise<Tag | null> {
    return await this.repo.findOne({ where: { name } });
  }
  async delete(tagId: number): Promise<void> {
    await this.repo.delete(tagId);
  }

  async save(tag: Tag): Promise<Tag> {
    return await this.repo.save(tag);
  }
}
