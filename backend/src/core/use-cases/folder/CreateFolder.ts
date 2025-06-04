import { IFolderRepository } from "../../repositories/folder.repository";

export class CreateFolderUseCase {
  constructor(private folderRepo: IFolderRepository) {}

  async execute(name: string, expertId: number) {
    if (!name) throw new Error("Folder name is required");
    return this.folderRepo.createFolder(name, expertId);
  }
}