import { Note } from "../entities/Notes.entity";
import { INoteRepository } from "../repositories/noteRepository";

export class UpdateNoteUseCase {
  constructor(private noteRepo: INoteRepository) {}

  async execute(noteId: number, text: string, expertId: number): Promise<Note> {
    return this.noteRepo.updateNote(noteId, text, expertId);
  }
}