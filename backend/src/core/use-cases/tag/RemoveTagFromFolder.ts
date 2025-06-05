import { IFolderRepository } from "../../repositories/folder.repository";

export class RemoveTagFromFolderUseCase {
  constructor(private folderRepo: IFolderRepository) {}

  async execute(folderId: number): Promise<void> {
    const folder = await this.folderRepo.findByIdWithTags(folderId);
    if (!folder) throw new Error("Folder not found");

    folder.tag = null;
    await this.folderRepo.save(folder);
  }
}
