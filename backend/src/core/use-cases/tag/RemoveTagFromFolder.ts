import { IFolderRepository } from "../../repositories/folder.repository";

export class RemoveTagFromFolderUseCase {
  constructor(private folderRepo: IFolderRepository) {}

  async execute(folderId: number, tagId: number): Promise<void> {
    const folder = await this.folderRepo.findByIdWithTags(folderId);
    if (!folder) throw new Error("Folder not found");

    folder.tags = folder.tags.filter(t => t.id !== tagId);
    await this.folderRepo.save(folder);
  }
}
