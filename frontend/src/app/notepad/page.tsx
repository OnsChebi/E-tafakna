"use client";

import { useMemo, useState } from "react";
import FolderList from "../components/FolderList";
import NoteList from "../components/NoteList";
import NoteEditor from "../components/NoteEditor";

export type Note = {
  id: string;
  content: string;
  createdAt: string;
};

export type Folder = {
  id: string;
  name: string;
  clientName: string;
  notes: Note[];
};

export default function NotepadPage() {
  const [folders, setFolders] = useState<Folder[]>([
    {
      id: "1",
      name: "Client A Folder",
      clientName: "Client A",
      notes: [
        { id: "n1", content: "First note for Client A", createdAt: "2024-03-20T10:00:00Z" },
        { id: "n2", content: "Second note for Client A", createdAt: "2024-03-21T11:00:00Z" },
      ],
    },
    {
      id: "2",
      name: "Client B Folder",
      clientName: "Client B",
      notes: [
        { id: "n3", content: "First note for Client B", createdAt: "2024-03-22T12:00:00Z" },
      ],
    },
  ]);

  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  const filteredFolders = useMemo(() => {
    return folders.filter(
      (folder) =>
        folder.name.toLowerCase().includes(search.toLowerCase()) ||
        folder.clientName.toLowerCase().includes(search.toLowerCase())
    );
  }, [folders, search]);

  const handleCreateFolder = (name: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      clientName: "New Client",
      notes: []
    };
    setFolders([...folders, newFolder]);
  };

  const handleUpdateFolder = (id: string, newName: string) => {
    setFolders(folders.map(folder => 
      folder.id === id ? { ...folder, name: newName } : folder
    ));
  };

  const handleDeleteFolder = (id: string) => {
    setFolders(folders.filter(folder => folder.id !== id));
    if (selectedFolder?.id === id) {
      setSelectedFolder(null);
    }
  };

  const handleSelectFolder = (folder: Folder) => {
    setSelectedFolder(folder);
  };

  const handleAddNote = (folderId: string, newNoteContent: string) => {
    setFolders(prevFolders =>
      prevFolders.map(folder => {
        if (folder.id === folderId) {
          const newNote: Note = {
            id: Math.random().toString(),
            content: newNoteContent,
            createdAt: new Date().toISOString(),
          };
          return { ...folder, notes: [...folder.notes, newNote] };
        }
        return folder;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-700 p-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Folder List Sidebar */}
        <div className="md:col-span-1 bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
          <FolderList
            folders={filteredFolders}
            search={search}
            setSearch={setSearch}
            onSelectFolder={handleSelectFolder}
            selectedFolder={selectedFolder}
            onCreateFolder={handleCreateFolder}
            onUpdateFolder={handleUpdateFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 flex flex-col gap-4">
          {selectedFolder ? (
            <>
              <NoteList folder={selectedFolder} />
              <NoteEditor 
                folderId={selectedFolder.id} 
                onAddNote={handleAddNote}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 text-gray-500 dark:text-gray-400">
              Select a folder to view and add notes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}