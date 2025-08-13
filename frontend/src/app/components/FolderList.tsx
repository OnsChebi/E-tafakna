"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FolderIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  XIcon,
  TagsIcon
} from "lucide-react";
import ConfirmDialog from "./ConfirmPopUp";
import FolderTags from "./FolderTags";
import { tagApi } from "../service/api";
import type { Tag } from "./FolderTags";

export type Folder = {
  id: number;
  name: string;
};

interface FolderListProps {
  folders: Folder[];
  search: string;
  setSearch: (value: string) => void;
  onSelectFolder: (folder: Folder) => void;
  selectedFolder: Folder | null;
  onCreateFolder: (name: string) => void;
  onUpdateFolder: (id: number, newName: string) => void;
  onDeleteFolder: (id: number) => void;
}

export default function FolderList({
  folders,
  search,
  setSearch,
  onSelectFolder,
  selectedFolder,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
}: FolderListProps) {
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [isAddingNewFolder, setIsAddingNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [folderIdToDelete, setFolderIdToDelete] = useState<number | null>(null);

  const [folderTagsMap, setFolderTagsMap] = useState<Record<number, Tag[]>>({});
  const [tagModalFolderId, setTagModalFolderId] = useState<number | null>(null);

 const loadedFoldersRef = useRef<Set<number>>(new Set());

useEffect(() => {
  const loadTagsForFolders = async () => {
    const map: Record<number, Tag[]> = {};
    for (const folder of folders) {
      if (!loadedFoldersRef.current.has(folder.id)) {
        try {
          const res = await tagApi.getTagsbyFolder(folder.id);
          map[folder.id] = res.data;
        } catch {
          map[folder.id] = []; // fallback for 404
        }
        loadedFoldersRef.current.add(folder.id);
      }
    }
    setFolderTagsMap((prev) => ({ ...prev, ...map }));
  };
  if (folders.length > 0) loadTagsForFolders();
}, [folders]);



  const handleRemoveTag = async (folderId: number, tagId: number) => {
    await tagApi.removeTagFromFolder(folderId, tagId);
    setFolderTagsMap((prev) => ({
      ...prev,
      [folderId]: prev[folderId]?.filter((t) => t.id !== tagId) || [],
    }));
  };

  const handleTagsUpdated = async (folderId: number) => {
    const res = await tagApi.getTagsbyFolder(folderId);
    setFolderTagsMap((prev) => ({
      ...prev,
      [folderId]: res.data,
    }));
  };

  const handleEditStart = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setEditedName(folder.name);
    setError(null);
  };

  const handleEditSave = () => {
    if (editingFolderId && editedName.trim()) {
      const isNameUnique = !folders.some(
        (folder) =>
          folder.name.toLowerCase() === editedName.trim().toLowerCase() &&
          folder.id !== editingFolderId
      );
      if (!isNameUnique) {
        setError("Folder name must be unique.");
        return;
      }
      onUpdateFolder(editingFolderId, editedName.trim());
      setEditingFolderId(null);
      setEditedName("");
      setError(null);
    }
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      const isNameUnique = !folders.some(
        (folder) =>
          folder.name.toLowerCase() === newFolderName.trim().toLowerCase()
      );
      if (!isNameUnique) {
        setError("Folder already exists");
        setNewFolderName("");
        return;
      }
      onCreateFolder(newFolderName.trim());
      setIsAddingNewFolder(false);
      setNewFolderName("");
      setError(null);
    }
  };

  const requestDeleteFolder = (id: number) => {
    setFolderIdToDelete(id);
    setConfirmDialogVisible(true);
  };

  const confirmDelete = () => {
    if (folderIdToDelete !== null) {
      onDeleteFolder(folderIdToDelete);
      setFolderIdToDelete(null);
      setConfirmDialogVisible(false);
    }
  };

  const cancelDelete = () => {
    setFolderIdToDelete(null);
    setConfirmDialogVisible(false);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Search */}
      <Input
        placeholder="Search folders..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-2xl dark:text-gray-100 dark:bg-gray-700"
      />

      {/* Add New Folder */}
      <div className="mb-4">
        {isAddingNewFolder ? (
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Add new folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="flex-grow w-full max-w-2xl dark:text-gray-100 dark:bg-gray-700"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddFolder} className="bg-[#1366e8] hover:bg-[#1157c7af] text-white">
                <CheckIcon className="h-4 w-4 mr-2" /> Save
              </Button>
              <Button size="sm" onClick={() => setIsAddingNewFolder(false)} className="bg-gray-500 hover:bg-[#5a5a5a] text-white hover:text-white">
                <XIcon className="h-4 w-4 mr-2" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" className="w-full gap-2 bg-[#1366e8] text-white hover:bg-gray-300 dark:hover:bg-[#1158c7]" onClick={() => setIsAddingNewFolder(true)}>
            <PlusIcon className="h-4 w-4" /> New Folder
          </Button>
        )}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>

      {/* Folder List */}
      <ul className="space-y-2 md:max-h-[50vh] max-h-[30vh] overflow-y-auto">
        {folders.map((folder) => (
          <li key={folder.id} className="flex flex-col gap-1">
            {/* Folder Row */}
            <div className="flex items-center gap-2">
              {editingFolderId === folder.id ? (
                <>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="flex-grow dark:text-gray-100 dark:bg-gray-700"
                  />
                  <Button size="sm" onClick={handleEditSave} className="bg-[#1366e8] hover:bg-[#1158c7] text-white">
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => setEditingFolderId(null)} className="bg-gray-500 hover:bg-[#5a5a5a] text-white">
                    <XIcon className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={selectedFolder?.id === folder.id ? "default" : "ghost"}
                    onClick={() => onSelectFolder(folder)}
                    className={`flex-grow justify-start text-left h-auto py-2 ${
                      selectedFolder?.id === folder.id
                        ? "bg-[#1365e8] text-white hover:bg-[#1365e8c4]"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FolderIcon className="h-5 w-5 dark:text-gray-200 flex-shrink-0" />
                      <p className="font-bold dark:text-gray-200">{folder.name}</p>
                    </div>
                  </Button>

                  {/* Tag management */}
                  {folderTagsMap[folder.id]?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {folderTagsMap[folder.id].map((tag) => (
                        <span
                          key={tag.id}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white cursor-pointer"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                          <XIcon
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => handleRemoveTag(folder.id, tag.id)}
                          />
                        </span>
                      ))}
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setTagModalFolderId(folder.id)}>
                        <TagsIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setTagModalFolderId(folder.id)}>
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Edit & Delete */}
                  <Button size="sm" className="h-8 w-8 hover:bg-[#1366e8]" onClick={() => handleEditStart(folder)}>
                    <EditIcon className="h-5 w-5 dark:text-white text-black" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 text-red-600 hover:text-red-700" onClick={() => requestDeleteFolder(folder.id)}>
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Confirm Delete */}
      {confirmDialogVisible && (
        <ConfirmDialog
          message="This will delete the folder and all its notes. Are you sure?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* Tag Modal */}
      {tagModalFolderId && (
        <FolderTags
          folderId={tagModalFolderId}
          open={!!tagModalFolderId}
          onOpenChange={(open) => {
            if (!open) setTagModalFolderId(null);
            handleTagsUpdated(tagModalFolderId);
          }}
        />
      )}
    </div>
  );
}
