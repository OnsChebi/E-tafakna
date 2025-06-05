import { IFolderRepository } from "../../repositories/folder.repository";

export class GetFoldersByTagUseCase {
  constructor(private folderRepo: IFolderRepository) {}

  async execute(tagId: number) {
    return await this.folderRepo.findTagById(tagId);
  }
}
