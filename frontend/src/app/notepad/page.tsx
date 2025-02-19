"use client";

import { useMemo, useState } from "react";
import FolderList from "../components/FolderList";
import NoteList from "../components/NoteList";
import { NoteModal } from "../components/NoteModal";

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
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [modalEditing, setModalEditing] = useState(false);

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

  const handleSaveNote = (content: string) => {
    if (!selectedFolder) return;

    setFolders(prevFolders => 
      prevFolders.map(folder => {
        if (folder.id === selectedFolder.id) {
          const newNotes = selectedNote
            ? folder.notes.map(note => 
                note.id === selectedNote.id 
                  ? { ...note, content, createdAt: new Date().toISOString() }
                  : note
              )
            : [...folder.notes, {
                id: Date.now().toString(),
                content,
                createdAt: new Date().toISOString()
              }];

          return { ...folder, notes: newNotes };
        }
        return folder;
      })
    );

    setSelectedNote(null);
    setShowNoteModal(false);
  };

  const handleDeleteNote = (noteId: string) => {
    if (!selectedFolder) return;

    setFolders(prevFolders =>
      prevFolders.map(folder => {
        if (folder.id === selectedFolder.id) {
          return {
            ...folder,
            notes: folder.notes.filter(note => note.id !== noteId)
          };
        }
        return folder;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-700 p-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Folder List Sidebar */}
        <div className="md:col-span-1 min-h-[85vh] bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
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
              <NoteList
                folder={selectedFolder}
                onEditNote={(noteId) => {
                  const note = selectedFolder.notes.find(n => n.id === noteId);
                  if (note) {
                    setSelectedNote(note);
                    setModalEditing(true);
                    setShowNoteModal(true);
                  }
                }}
                onDeleteNote={(noteId) => {
                  if (confirm("Are you sure you want to delete this note?")) {
                    handleDeleteNote(noteId);
                  }
                }}
                onAddNote={() => {
                  setSelectedNote(null);
                  setModalEditing(true);
                  setShowNoteModal(true);
                }}
                onViewNote={(noteId) => {
                  const note = selectedFolder.notes.find(n => n.id === noteId);
                  if (note) {
                    setSelectedNote(note);
                    setModalEditing(false);
                    setShowNoteModal(true);
                  }
                }}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 text-gray-500 dark:text-gray-400">
              Select a folder to view and add notes
            </div>
          )}
        </div>
      </div>

      <NoteModal
        isOpen={showNoteModal}
        onClose={() => {
          setShowNoteModal(false);
          setSelectedNote(null);
        }}
        content={selectedNote?.content || ""}
        onSave={handleSaveNote}
        isEditing={modalEditing}
      />
    </div>
  );
}