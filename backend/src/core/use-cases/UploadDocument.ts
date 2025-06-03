import { Document } from '../entities/Document.entity';
import { Folder } from '../entities/Folder.entity';
import { Meeting } from '../entities/Meeting.entity';
import { IDocumentRepository } from '../repositories/DocumentRepository';


export class UploadDocumentUseCase {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(input: {
    title: string;
    url: string;
    meeting?: Meeting | null;
    folder?: Folder | null;
    type: 'pdf' | 'docx' | 'image' | 'other';
  }): Promise<Document> {
    const document = new Document();
    document.title = input.title;
    document.url = input.url;
    document.uploadedAt = new Date();
    document.type = input.type;

    if (input.meeting) {
      document.meeting = input.meeting;
    }

    if (input.folder) {
      document.folder = input.folder;
    }

    return await this.documentRepository.save(document);
  }
}
