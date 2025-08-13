import { Tag } from "../entities/Tag.entity";

export interface ITagRepository {
  create(tag: Tag): Promise<Tag>;
  findAll(): Promise<Tag[] | null>;
  findById(id: number): Promise<Tag | null>;
  findByIds(ids: number[]): Promise<Tag[]>;
  findByName(name: string): Promise<Tag | null>;
  delete(tagId: number): Promise<void>;
  findByFolderId(folderId:number):Promise<Tag[] | null>
  save(tag: Tag): Promise<Tag>;
}
