import { Folder } from "../entities/Folder.entity";
import { IFolderRepository } from "../repositories/folder.repository";

export class GetFolderByIdUseCase {
  constructor(private folderRepo: IFolderRepository) {}

  async execute(folderId: number, expertId: number): Promise<Folder | null> {
    return this.folderRepo.getFolderById(folderId , expertId);
  }
}
