import { Tag } from "../entities/Tag.entity";

export interface ITagRepository {
  create(tag: Tag): Promise<Tag>;
  findAll(): Promise<Tag[]>;
  findById(id: number): Promise<Tag | null>;
}
