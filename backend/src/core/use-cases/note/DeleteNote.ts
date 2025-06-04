import { INoteRepository } from "../../repositories/noteRepository";

export class DeleteNoteUseCase {
  constructor(private noteRepo: INoteRepository) {}

  async execute(noteId: number, expertId: number): Promise<void> {
    return this.noteRepo.deleteNote(noteId, expertId);
  }
}