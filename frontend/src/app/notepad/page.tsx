"use client";

import { useMemo, useState } from "react";
import FolderList from "../components/FolderList";
import NoteList from "../components/NoteList";
import { NoteModal } from "../components/NoteModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  addFolder,
  deleteFolder,
  updateFolder,
  setSelectedFolder,
  setSearch,
} from "../redux/slices/foldersSlice";
import { addNote, deleteNote, updateNote } from "../redux/slices/notesSlice";

export type Note = {
  id: string;
  content: string;
  createdAt: string;
  folderId:string;
};

export type Folder = {
  id: string;
  name: string;

};

export default function NotepadPage() {
  const dispatch = useDispatch<AppDispatch>();
  // const [folders, setFolders] = useState<Folder[]>([
  //   {
  //     id: "1",
  //     name: "Client A Folder",
  //     clientName: "Client A",
  //     notes: [
  //       { id: "n1", content: "First note for Client A", createdAt: "2024-03-20T10:00:00Z" },
  //       { id: "n2", content: "Second note for Client A", createdAt: "2024-03-21T11:00:00Z" },
  //     ],
  //   },
  //   {
  //     id: "2",
  //     name: "Client B Folder",
  //     clientName: "Client B",
  //     notes: [
  //       { id: "n3", content: "First note for Client B", createdAt: "2024-03-22T12:00:00Z" },
  //     ],
  //   },
  // ]);

  //const [search, setSearch] = useState("");
  const search = useSelector((state: RootState) => state.folders.search);

  const { folders, selectedFolder } = useSelector((state: RootState) => state.folders);
  const { notes } = useSelector((state: RootState) => state.notes);
  //const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [modalEditing, setModalEditing] = useState(false);

  const filteredFolders = useMemo(
    () =>
      folders.filter((folder) =>
        folder.name.toLowerCase().includes(search.toLowerCase())
      ),
    [folders, search]
  );

  const handleCreateFolder = (name: string) => {
    dispatch(addFolder(name));
  };

  const handleUpdateFolder = (id: string, newName: string) => {
    // setFolders(folders.map(folder => 
    //   folder.id === id ? { ...folder, name: newName } : folder
    // ));
    dispatch(updateFolder({ id, newName }));
  };

  const handleDeleteFolder = (id: string) => {
    // setFolders(folders.filter(folder => folder.id !== id));
    // if (selectedFolder?.id === id) {
    //   setSelectedFolder(null);
    // }
    if (confirm("Are you sure you want to delete this folder? All files inside will also be deleted.")) {
      dispatch(deleteFolder(id));
      if (selectedFolder?.id === id) {
        dispatch(setSelectedFolder(null));
      }
    }
  };

  const handleSelectFolder = (folder: Folder) => {
    dispatch(setSelectedFolder(folder));
  };

  const handleSaveNote = (content: string) => {
    if (!selectedFolder) return;
      if (selectedNote) {
        
        dispatch(updateNote({ ...selectedNote, content, createdAt: new Date().toISOString() }));
      } else {
        dispatch(addNote({ id: Date.now().toString(), content, createdAt: new Date().toISOString(), folderId: selectedFolder.id }));
    }

    setSelectedNote(null);
    setShowNoteModal(false);
  };

  const handleDeleteNote = (noteId: string) => {
  
    if (confirm("Are you sure you want to delete this note?")) {
      dispatch(deleteNote(noteId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-700 p-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Folder List Sidebar */}
        <div className="md:col-span-1 min-h-[85vh] bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
        <FolderList
            folders={filteredFolders}
            search={search}
            setSearch={(value: string) => dispatch(setSearch(value))}
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
  folderId={selectedFolder?.id || ""}
  onEditNote={(noteId) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      setSelectedNote(note);
      setModalEditing(true);
      setShowNoteModal(true);
    }
  }}
  onAddNote={() => {
    setSelectedNote(null);
    setModalEditing(true);
    setShowNoteModal(true);
  }}
  onViewNote={(noteId) => {
    const note = notes.find((n) => n.id === noteId);
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