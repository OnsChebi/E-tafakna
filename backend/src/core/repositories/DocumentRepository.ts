import { Document } from "../entities/Document.entity";

export interface IDocumentRepository {
  save(document: Document): Promise<Document>;
  findById(id: number): Promise<Document | null>;
  findByMeeting(meetingId: number): Promise<Document[]>;
  findByFolder(folderId: number): Promise<Document[]>;
  delete(id: number): Promise<void>;
}
