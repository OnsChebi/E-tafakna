import { Request, Response } from 'express';
import { AppDataSource } from '../../database/db';
import { Folder } from '../../../core/entities/Folder.entity';
import { Meeting } from '../../../core/entities/Meeting.entity';
import { DocumentRepository } from '../../database/repo/DocumentRepositoryImp';
import { UploadDocumentUseCase } from '../../../core/use-cases/UploadDocument';

export async function DocumentUploadController(req: Request, res: Response) {
  try {
    const { title, meetingId, folderId, type } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: 'Aucun fichier fourni.' });
      return;
    }

    const url = `/uploads/documents/${file.originalname}`;

    const meetingRepo = AppDataSource.getRepository(Meeting);
    const folderRepo = AppDataSource.getRepository(Folder);

    const meeting = meetingId
      ? await meetingRepo.findOneBy({ id: Number(meetingId) })
      : undefined;

    const folder = folderId
      ? await folderRepo.findOneBy({ id: Number(folderId) })
      : undefined;

    const documentRepo = new DocumentRepository();
    const useCase = new UploadDocumentUseCase(documentRepo);

    const uploadedDoc = await useCase.execute({
      title,
      url,
      type,
      meeting,
      folder,
    });

    res.status(201).json(uploadedDoc);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'error during uploading' });
  }
}
