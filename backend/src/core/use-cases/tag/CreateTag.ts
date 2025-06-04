import { ITagRepository } from "../../repositories/TagRepository";
import { Tag } from "../../entities/Tag.entity";

export class CreateTagUseCase {
  constructor(private tagRepo: ITagRepository) {}

  async execute(name: string, color: string): Promise<Tag> {
    const tag = new Tag();
    tag.name = name;
    tag.color = color;
    return await this.tagRepo.create(tag);
  }
}
