// core/use-cases/folder/GetFoldersByTagId.ts
import { IFolderRepository } from "../../repositories/folder.repository";
import { Folder } from "../../entities/Folder.entity";

export class GetFoldersByTagIdUseCase {
  constructor(private folderRepo: IFolderRepository) {}

  async execute(tagId: number): Promise<Folder[] | null> {
    return this.folderRepo.findByTagId(tagId);
  }
}
