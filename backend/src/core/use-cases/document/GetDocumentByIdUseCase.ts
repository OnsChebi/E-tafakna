import { IDocumentRepository } from "../../repositories/DocumentRepository";

export class GetDocumentByIdUseCase {
  constructor(private documentRepo: IDocumentRepository) {}

  async execute(id: number) {
    return await this.documentRepo.findById(id);
  }
}
