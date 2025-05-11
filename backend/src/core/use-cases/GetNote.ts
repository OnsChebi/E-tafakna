import { Note } from "../entities/Notes.entity";
import { INoteRepository } from "../repositories/noteRepository";

export class GetNoteUseCase {
  constructor(private noteRepo: INoteRepository) {}

  async execute(noteId: number, expertId: number): Promise<Note> {
    return this.noteRepo.getNote(noteId, expertId);
  }
}