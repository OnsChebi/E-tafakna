import { Not } from "typeorm";
import { AppDataSource } from "../db";
import { IFolderRepository } from "../../../core/repositories/folder.repository";
import { Folder } from "../../../core/entities/Folder.entity";

export class FolderRepositoryImp implements IFolderRepository {
  private folderRepo = AppDataSource.getRepository(Folder);

  // Create a new folder
  async createFolder(name: string, expertId: number): Promise<Folder> {
    const existing = await this.folderRepo.findOne({
      where: { name, expert: { id: expertId } },
    });
    if (existing) throw new Error("Folder name already exists");

    const folder = this.folderRepo.create({ name, expert: { id: expertId } });
    return this.folderRepo.save(folder);
  }

  // Update an existing folder
  async updateFolder(folderId: number, name: string, expertId: number): Promise<Folder> {
    const folder = await this.folderRepo.findOne({
      where: { id: folderId, expert: { id: expertId } },
    });
    if (!folder) throw new Error("Folder not found");

    const existing = await this.folderRepo.findOne({
      where: { name, expert: { id: expertId }, id: Not(folderId) },
    });
    if (existing) throw new Error("Folder name already exists");

    folder.name = name;
    return this.folderRepo.save(folder);
  }

  // Delete a folder
  async deleteFolder(folderId: number, expertId: number): Promise<void> {
    const result = await this.folderRepo.delete({
      id: folderId,
      expert: { id: expertId },
    });
    if (result.affected === 0) throw new Error("Folder not found");
  }

  // Get all folders for a specific expert
  async getFolders(expertId: number): Promise<Folder[]> {
    return this.folderRepo.find({
      where: { expert: { id: expertId } },
      relations: ["notes"],
    });
  }

  // Get a folder by its name and expert ID
  async getFolderByName(name: string, expertId: number): Promise<Folder | null> {
    return this.folderRepo.findOne({
      where: { name, expert: { id: expertId } },
      relations: ["notes"],
    });
  }

  // Get a folder by its ID and expert ID
  async getFolderById(folderId: number, expertId: number): Promise<Folder | null> {
    return this.folderRepo.findOne({
      where: { id: folderId, expert: { id: expertId } },
      relations: ["notes"],
    });
  }
}
