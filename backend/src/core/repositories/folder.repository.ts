import { Folder } from "../entities/Folder.entity";

export interface IFolderRepository {
  createFolder(name: string, expertId: number): Promise<Folder>;
  updateFolder(folderId: number, name: string, expertId: number): Promise<Folder>;
  deleteFolder(folderId: number, expertId: number): Promise<void>;
  getFolders(expertId: number): Promise<Folder[]>;
  getFolderById(folderId: number , expertId: number):Promise<Folder | null>;
  findByTagId(tagId: number): Promise<Folder[] | null>;
    findByIdWithTags(folderId: number): Promise<Folder | null>;
  save(folder: Folder): Promise<Folder>;
}