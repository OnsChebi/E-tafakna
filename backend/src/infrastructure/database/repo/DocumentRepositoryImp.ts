import { IDocumentRepository } from "../../../core/repositories/DocumentRepository";
import { Document } from "../../../core//entities/Document.entity";
import { Repository } from "typeorm";
import { AppDataSource } from "../db";

export class DocumentRepository implements IDocumentRepository {
  private repository: Repository<Document>;

  constructor() {
    this.repository = AppDataSource.getRepository(Document);
  }

  async save(document: Document): Promise<Document> {
    return await this.repository.save(document);
  }

  async findById(id: number): Promise<Document | null> {
    return await this.repository.findOne({ where: { id } });
  }

  

  async findByMeeting(meetingId: number): Promise<Document[]> {
    return await this.repository.find({
      where: { meeting: { id: meetingId } },
      relations: ["meeting"],
    });
  }

  async findByFolder(folderId: number): Promise<Document[]> {
    return await this.repository.find({
      where: { folder: { id: folderId } },
      relations: ["folder"],
    });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
