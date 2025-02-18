"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FolderIcon, EditIcon, TrashIcon, PlusIcon, CheckIcon, XIcon } from "lucide-react";
import { Folder } from "../notepad/page";

type FolderListProps = {
  folders: Folder[];
  search: string;
  setSearch: (value: string) => void;
  onSelectFolder: (folder: Folder) => void;
  selectedFolder: Folder | null;
  onCreateFolder: (name: string) => void;
  onUpdateFolder: (id: string, newName: string) => void;
  onDeleteFolder: (id: string) => void;
};

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
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [isAddingNewFolder, setIsAddingNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleEditStart = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setEditedName(folder.name);
    setError(null); // Clear any previous errors
  };

  const handleEditSave = () => {
    if (editingFolderId && editedName.trim()) {
      const isNameUnique = !folders.some(
        (folder) => folder.name === editedName.trim() && folder.id !== editingFolderId
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
        (folder) => folder.name === newFolderName.trim()
      );
      if (!isNameUnique) {
        setError("Folder name must be unique.");
        return;
      }
      onCreateFolder(newFolderName.trim());
      setIsAddingNewFolder(false);
      setNewFolderName("");
      setError(null);
    }
  };

  const handleDeleteFolder = (id: string) => {
    if (confirm("Are you sure you want to delete this folder? All files inside will also be deleted.")) {
      onDeleteFolder(id);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      {/* Title and Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <FolderIcon className="h-5 w-5" />
          Folders
        </h2>
      </div>

      {/* Search input */}
      <Input
        placeholder="Search folders..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-2xl dark:text-gray-100  dark:bg-gray-700"
      />

      {/* Add New Folder Section */}
      <div className="mb-4">
        {isAddingNewFolder ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="New folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="flex-grow w-full max-w-2xl dark:text-gray-100 dark:bg-gray-700 "
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddFolder}
                className="bg-[#1366e8] hover:bg-[#1157c7af] text-white"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingNewFolder(false)}
                className="bg-gray-500 hover:bg-[#5a5a5a] text-white hover:text-white"

              >
                <XIcon className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full gap-2 bg-[#1366e8] text-white hover:bg-gray-300 dark:hover:bg-[#1158c7]"
            onClick={() => setIsAddingNewFolder(true)}
          >
            <PlusIcon className="h-4 w-4" />
            Add New Folder
          </Button>
        )}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>

      {/* Folder list */}
      <ul className="space-y-2">
        {folders.map((folder) => (
          <li key={folder.id} className="flex gap-2 items-center">
            {editingFolderId === folder.id ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-grow w-full max-w-2xl dark:text-gray-100 dark:bg-gray-700"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleEditSave}
                    className="bg-[#1366e8] hover:bg-[#1158c7] text-white"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingFolderId(null)}
                    className="bg-gray-500 hover:bg-[#5a5a5a] text-white hover:text-white"

                  >
                    <XIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
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
                    <div>
                      <p className="font-bold dark:text-gray-200 truncate">{folder.name}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {folder.clientName}
                      </p>
                    </div>
                  </div>
                </Button>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 hover:bg-[#1366e8] hover:text-white dark:hover:bg-[#1158c7]"
                    onClick={() => handleEditStart(folder)}
                  >
                    <EditIcon className="h-5 w-5 dark:text-white" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
                    onClick={() => handleDeleteFolder(folder.id)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}