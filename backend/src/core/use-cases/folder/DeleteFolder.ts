import { IFolderRepository } from "../../repositories/folder.repository";

export class DeleteFolderUseCase {
  constructor(private folderRepo: IFolderRepository) {}

  async execute(folderId: number, expertId: number) {
    return this.folderRepo.deleteFolder(folderId, expertId);
  }
}
