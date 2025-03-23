import { AppDataSource } from "../database/db";
import { Folder } from "../entities/Folder.entity";

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
}