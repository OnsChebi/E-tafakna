import { AppDataSource } from "../database/db";
import { Note } from "../entities/Notes.entity";
import { Folder } from "../entities/Folder.entity";
import { Repository } from "typeorm";

export class NoteService {
  private noteRepository: Repository<Note> = AppDataSource.getRepository(Note);
  private folderRepository: Repository<Folder> = AppDataSource.getRepository(Folder);

  private async validateFolderOwnership(folderId: number, expertId: number) {
    const folder = await this.folderRepository.findOne({
      where: { id: folderId, expert: { id: expertId } }
    });
    if (!folder) throw new Error("Folder not found or access denied");
    return folder;
  }

  async createNote(text: string, folderId: number, expertId: number): Promise<Note> {
    await this.validateFolderOwnership(folderId, expertId);
    
    const note = this.noteRepository.create({
      text,
      folder: { id: folderId }
    });
    
    return this.noteRepository.save(note);
  }

  async updateNote(noteId: number, text: string, expertId: number): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id: noteId },
      relations: ["folder"]
    });
    
    if (!note) throw new Error("Note not found");
    await this.validateFolderOwnership(note.folder.id, expertId);

    note.text = text;
    return this.noteRepository.save(note);
  }

  async deleteNote(noteId: number, expertId: number): Promise<void> {
    const note = await this.noteRepository.findOne({
      where: { id: noteId },
      relations: ["folder"]
    });
    
    if (!note) throw new Error("Note not found");
    await this.validateFolderOwnership(note.folder.id, expertId);

    await this.noteRepository.delete(noteId);
  }

  async getNotesByFolder(folderId: number, expertId: number): Promise<Note[]> {
    await this.validateFolderOwnership(folderId, expertId);
    return this.noteRepository.find({
      where: { folder: { id: folderId } },
      order: { created_at: "DESC" }
    });
  }

  async getAllNote(folderId: number, expertId: number): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id: folderId },
      relations: ["folder"]
    });
    
    if (!note) throw new Error("Note not found");
    await this.validateFolderOwnership(note.folder.id, expertId);
    
    return note;
  }
}