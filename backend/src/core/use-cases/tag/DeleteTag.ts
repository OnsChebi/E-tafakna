import { ITagRepository } from "../../repositories/TagRepository";

export class DeleteTagUseCase {
  constructor(private tagRepo: ITagRepository) {}

  async execute(tagId: number): Promise<void> {
    const tag = await this.tagRepo.findById(tagId);
    if (!tag) throw new Error("Tag not found");

    await this.tagRepo.delete(tagId);
  }
}
