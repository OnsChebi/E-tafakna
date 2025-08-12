import { ITagRepository } from "../../repositories/TagRepository";
import { Tag } from "../../entities/Tag.entity";

export class GetTagByIdUseCase {
  constructor(private tagRepo: ITagRepository) {}

  async execute(tagId: number): Promise<Tag> {
    const tag = await this.tagRepo.findById(tagId);
    if (!tag) throw new Error("Tag not found");
    return tag;
  }
}
