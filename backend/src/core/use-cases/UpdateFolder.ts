import { IFolderRepository } from "../repositories/folder.repository";

export class UpdateFolderUseCase {
  constructor(private folderRepo: IFolderRepository) {}

  async execute(folderId: number, name: string, expertId: number) {
    if (!name) throw new Error("Folder name is required");
    return this.folderRepo.updateFolder(folderId, name, expertId);
  }
}
