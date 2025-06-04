import { IDocumentRepository } from "../../repositories/DocumentRepository";

export class GetDocumentsByFolderUseCase {
  constructor(private documentRepo: IDocumentRepository) {}

  async execute(folderId: number) {
    return await this.documentRepo.findByFolder(folderId);
  }
}
