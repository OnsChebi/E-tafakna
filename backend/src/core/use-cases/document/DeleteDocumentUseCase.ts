import { IDocumentRepository } from "../../repositories/DocumentRepository";

export class DeleteDocumentUseCase {
  constructor(private documentRepo: IDocumentRepository) {}

  async execute(id: number): Promise<boolean> {
    const doc = await this.documentRepo.findById(id);
    if (!doc) return false;
    await this.documentRepo.delete(id);
    return true;
  }
}
