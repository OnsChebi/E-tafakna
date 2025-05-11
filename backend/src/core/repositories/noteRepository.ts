import { Note } from "../entities/Notes.entity";

export interface INoteRepository {
  createNote(text: string, folderId: number, expertId: number): Promise<Note>;
  updateNote(noteId: number, text: string, expertId: number): Promise<Note>;
  deleteNote(noteId: number, expertId: number): Promise<void>;
  getNotesByFolder(folderId: number, expertId: number): Promise<Note[]>;
  getNote(noteId: number, expertId: number): Promise<Note>;
}
