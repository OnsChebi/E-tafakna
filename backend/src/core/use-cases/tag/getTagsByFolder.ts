import { Tag } from "../../entities/Tag.entity";
import { ITagRepository } from "../../repositories/TagRepository";

export class GetTagByFoldersIdUseCase {
  constructor(private tagRepo: ITagRepository) {}

  async execute(folderId: number):Promise<Tag[] | null> {
    return this.tagRepo.findByFolderId(folderId);
  }
}
