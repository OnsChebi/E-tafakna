import { ITagRepository } from "../../../core/repositories/TagRepository";
import { Tag } from "../../../core/entities/Tag.entity";
import { AppDataSource } from "../db";
import { Repository } from "typeorm";

export class TagRepository implements ITagRepository {
  private repo: Repository<Tag> = AppDataSource.getRepository(Tag);

  async create(tag: Tag): Promise<Tag> {
    return this.repo.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<Tag | null> {
    return this.repo.findOneBy({ id });
  }
}
