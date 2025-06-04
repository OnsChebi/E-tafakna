import { Request, Response } from "express";
import { DocumentRepository } from "../../database/repo/DocumentRepositoryImp";
import { GetDocumentByIdUseCase } from "../../../core/use-cases/document/GetDocumentByIdUseCase";
import { DeleteDocumentUseCase } from "../../../core/use-cases/document/DeleteDocumentUseCase";
import { GetDocumentsByFolderUseCase } from "../../../core/use-cases/document/GetDocumentsByFolderUseCase";
import { UploadDocumentUseCase } from "../../../core/use-cases/document/UploadDocument";
import { GetDocumentsByMeetingUseCase } from "../../../core/use-cases/document/GetDocumentsByMeetingUseCase";

import { AppDataSource } from "../../database/db";
import { Meeting } from "../../../core/entities/Meeting.entity";
import { Folder } from "../../../core/entities/Folder.entity";

const docRepo = new DocumentRepository();

export const getDocumentById = async (req: Request, res: Response) => {
  const useCase = new GetDocumentByIdUseCase(docRepo);
  const id = Number(req.params.id);

  const document = await useCase.execute(id);
  if (!document) {
     res.status(404).json({ message: "Document not found" });
  }

  res.json(document);
};

export const deleteDocumentById = async (req: Request, res: Response) => {
  const useCase = new DeleteDocumentUseCase(docRepo);
  const id = Number(req.params.id);

  const success = await useCase.execute(id);
  if (!success) {
     res.status(404).json({ message: "Document not found" });
  }

  res.json({ message: "Document deleted successfully" });
};

export const getDocumentsByFolderId = async (req: Request, res: Response) => {
  const useCase = new GetDocumentsByFolderUseCase(docRepo);
  const folderId = Number(req.params.folderId);

  const docs = await useCase.execute(folderId);
  res.json(docs);
};

export const getDocumentsByMeetingId = async (req: Request, res: Response) => {
  const useCase = new GetDocumentsByMeetingUseCase(docRepo);
  const meetingId = Number(req.params.meetingId);

  const docs = await useCase.execute(meetingId);
  res.json(docs);
};
export const DocumentUploadController=async (req: Request, res: Response)=> {
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
