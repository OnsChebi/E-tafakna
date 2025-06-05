import { IFolderRepository } from "../../repositories/folder.repository";
import { ITagRepository } from "../../repositories/TagRepository";

export class AssignExistingTagToFolderUseCase {
  constructor(
    private folderRepo: IFolderRepository,
    private tagRepo: ITagRepository
  ) {}

  async execute(folderId: number, tagId: number): Promise<void> {
    const folder = await this.folderRepo.findByIdWithTags(folderId);
    if (!folder) throw new Error("Folder not found");

    const tag = await this.tagRepo.findById(tagId);
    if (!tag) throw new Error("Tag not found");

    folder.tag = tag;
    await this.folderRepo.save(folder);
  }
}
