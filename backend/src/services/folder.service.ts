import { AppDataSource } from "../database/db";
import { Folder } from "../entities/Folder.entity";
import { Not } from "typeorm";

export class FolderService {
  private folderRepository = AppDataSource.getRepository(Folder);

  async createFolder(name: string, expertId: number): Promise<Folder> {
    if (!name || !expertId) {
      throw new Error("Name and expertId are required");
    }

    // Check for duplicate folder names
    const existingFolder = await this.folderRepository.findOne({
      where: { name, expert: { id: expertId } }
    });

    if (existingFolder) {
      throw new Error("Folder name already exists");
    }

    // Create and save the folder
    const folder = this.folderRepository.create({
      name,
      expert: { id: expertId }
    });

    return this.folderRepository.save(folder);
  }

  // Update Folder Name
  async updateFolder(folderId: number, name: string, expertId: number): Promise<Folder> {
    if (!name) {
      throw new Error("Folder ID, name, and expertId are required");
    }

    // Find the folder by ID and expertId
    const folder = await this.folderRepository.findOne({
      where: { id: folderId, expert: { id: expertId } }
    });

    if (!folder) {
      throw new Error("Folder not found");
    }

    // Check if the new name exists ?
    const existingFolder = await this.folderRepository.findOne({
      where: { name, expert: { id: expertId }, id: Not(folderId) }
    });

    if (existingFolder) {
      throw new Error("Folder name already exists");
    }

    // Update the folder name
    folder.name = name;
    return this.folderRepository.save(folder);
  }

  async deleteFolder(folderId: number, expertId: number): Promise<void> {
    

    // Find and delete the folder
    const result = await this.folderRepository.delete({
      id: folderId,
      expert: { id: expertId }
    });

    if (result.affected === 0) {
      throw new Error("Folder not found");
    }
  }
  // Get All Folders
  async getFolders(expertId: number): Promise<Folder[]> {
    

    // Fetch all folders for the expert
    return this.folderRepository.find({
      where: { expert: { id: expertId } },
      relations: ["notes"] // Include related notes if needed
    });
  }
// Get Folder by Name
async getFolderByName(name: string, expertId: number): Promise<Folder | null> {
  if (!name) {
    throw new Error("Name and expertId are required");
  }

  // Fetch the folder by name and expertId
  return this.folderRepository.findOne({
    where: { name, expert: { id: expertId } },
    relations: ["notes"] 
  });
}
}