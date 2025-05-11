import { Folder } from "../../../core/entities/Folder.entity";
import { Note } from "../../../core/entities/Notes.entity";
import { INoteRepository } from "../../../core/repositories/noteRepository";
import { AppDataSource } from "../../database/db";
import { Repository } from "typeorm";

export class NoteRepositoryImp implements INoteRepository {
  private noteRepo: Repository<Note> = AppDataSource.getRepository(Note);
  private folderRepo: Repository<Folder> = AppDataSource.getRepository(Folder);

  private async validateFolderOwnership(folderId: number, expertId: number): Promise<Folder> {
    const folder = await this.folderRepo.findOne({
      where: { id: folderId, expert: { id: expertId } },
    });
    if (!folder) throw new Error("Folder not found or access denied");
    return folder;
  }

  async createNote(text: string, folderId: number, expertId: number): Promise<Note> {
    const folder = await this.validateFolderOwnership(folderId, expertId);
    const note = this.noteRepo.create({
      text,
      folder,
    });
    return await this.noteRepo.save(note);
  }

  async updateNote(noteId: number, text: string, expertId: number): Promise<Note> {
    const note = await this.noteRepo.findOne({
      where: { id: noteId },
      relations: ["folder"],
    });
    if (!note) throw new Error("Note not found");
    await this.validateFolderOwnership(note.folder.id, expertId);
    note.text = text;
    return await this.noteRepo.save(note);
  }

  async deleteNote(noteId: number, expertId: number): Promise<void> {
    const note = await this.noteRepo.findOne({
      where: { id: noteId },
      relations: ["folder"],
    });
    if (!note) throw new Error("Note not found");
    await this.validateFolderOwnership(note.folder.id, expertId);
    await this.noteRepo.delete(noteId);
  }

  async getNotesByFolder(folderId: number, expertId: number): Promise<Note[]> {
    await this.validateFolderOwnership(folderId, expertId);
    const notes = await this.noteRepo.find({
      where: { folder: { id: folderId } },
      order: { created_at: "DESC" },
      relations: ["folder"],
    });
    return notes;
  }

  async getNote(noteId: number, expertId: number): Promise<Note> {
    const note = await this.noteRepo.findOne({
      where: { id: noteId },
      relations: ["folder"],
    });
    if (!note) throw new Error("Note not found");
    await this.validateFolderOwnership(note.folder.id, expertId);
    return note;
  }
}
