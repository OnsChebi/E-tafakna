import { IFolderRepository } from "../repositories/folder.repository";

export class GetFoldersUseCase {
  constructor(private folderRepo: IFolderRepository) {}

  async execute(expertId: number) {
    return this.folderRepo.getFolders(expertId);
  }
}
