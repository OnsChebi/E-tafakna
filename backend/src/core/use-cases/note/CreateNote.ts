import { Note } from "../../entities/Notes.entity";
import { INoteRepository } from "../../repositories/noteRepository";

export class CreateNoteUseCase {
  constructor(private noteRepo: INoteRepository) {}

  async execute(text: string, folderId: number, expertId: number): Promise<Note> {
    return this.noteRepo.createNote(text, folderId, expertId);
  }
}
