import { Note } from "../../entities/Notes.entity";
import { INoteRepository } from "../../repositories/noteRepository";

export class GetNotesByFolderUseCase {
  constructor(private noteRepo: INoteRepository) {}

  async execute(folderId: number, expertId: number): Promise<Note[]> {
    return this.noteRepo.getNotesByFolder(folderId, expertId);
  }
}