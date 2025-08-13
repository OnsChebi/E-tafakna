import { ITagRepository } from "../../../core/repositories/TagRepository";
import { Tag } from "../../../core/entities/Tag.entity";
import { AppDataSource } from "../db";
import { Repository, In } from "typeorm";

export class TagRepository implements ITagRepository {
  private repo: Repository<Tag>;

  constructor() {
    this.repo = AppDataSource.getRepository(Tag);
  }
  async findByFolderId(folderId: number): Promise<Tag[] | null> {
      return await this.repo.find({
        where: {
          folders: {
            id: folderId,
          },
        },
        relations: ["folders"],  
      });
    }

  async create(tag: Tag): Promise<Tag> {
    // Ensure no duplicate names
    const existingTag = await this.findByName(tag.name);
    if (existingTag) {
      return existingTag; 
    }
    return await this.repo.save(tag);
  }

  async findAll(): Promise<Tag[] |null> {
    return await this.repo.find();
  }

  async findById(id: number): Promise<Tag | null> {
    return await this.repo.findOne({ where: { id } }) ?? null;
  }

  async findByIds(ids: number[]): Promise<Tag[]> {
    if (!ids.length) return [];
    return await this.repo.findBy({ id: In(ids) });
  }

  async findByName(name: string): Promise<Tag | null> {
    return await this.repo.findOne({ where: { name } }) ?? null;
  }

  async delete(tagId: number): Promise<void> {
    await this.repo.delete(tagId);
  }

  async save(tag: Tag): Promise<Tag> {
    return await this.repo.save(tag);
  }
}

