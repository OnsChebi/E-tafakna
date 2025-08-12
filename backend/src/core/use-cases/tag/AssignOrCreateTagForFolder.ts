import { IFolderRepository } from "../../repositories/folder.repository";
import { ITagRepository } from "../../repositories/TagRepository";
import { Tag } from "../../entities/Tag.entity";

export class AssignOrCreateTagForFolderUseCase {
  constructor(
    private folderRepo: IFolderRepository,
    private tagRepo: ITagRepository
  ) {}

  async execute(folderId: number, tagData: { name: string; color: string }): Promise<Tag> {
    const folder = await this.folderRepo.findByIdWithTags(folderId);
    if (!folder) throw new Error("Folder not found");

    let tag = await this.tagRepo.findByName(tagData.name);

    if (!tag) {
      tag = new Tag();
      tag.name = tagData.name;
      tag.color = tagData.color;
      tag = await this.tagRepo.create(tag);
    }

    // Prevent duplicates
    if (!folder.tags.some(t => t.id === tag.id)) {
      folder.tags.push(tag);
      await this.folderRepo.save(folder);
    }

    return tag;
  }
}
