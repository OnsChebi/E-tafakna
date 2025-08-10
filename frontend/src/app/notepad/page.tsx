"use client";


import { useMemo, useState, useEffect } from "react";
import FolderList from "../components/FolderList";
import NoteList, { Note } from "../components/NoteList";
import { NoteModal } from "../components/NoteModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  fetchFolders,
  addFolder,
  editFolder,
  removeFolder,
  setSearch,
  setSelectedFolder
} from "../redux/slices/foldersSlice";
import {
  fetchNotes,
  createNote,
  updateNoteContent,
  deleteNote
} from "../redux/slices/notesSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import DocumentPanel from "../components/DocumentPanel";
import { Button } from "@/components/ui/button";

export default function NotepadPage() {
  const dispatch = useDispatch<AppDispatch>();
  const search = useSelector((state: RootState) => state.folders.search);
  const { folders, selectedFolder, status: folderStatus, error: folderError } =
  const dispatch = useDispatch<AppDispatch>();
  const search = useSelector((state: RootState) => state.folders.search);
  const { folders, selectedFolder, status: folderStatus, error: folderError } =
    useSelector((state: RootState) => state.folders);
  const { notes, status: noteStatus, error: noteError } =
  const { notes, status: noteStatus, error: noteError } =
    useSelector((state: RootState) => state.notes);


  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [modalEditing, setModalEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes" | "documents">("notes");

  useEffect(() => {
    dispatch(fetchFolders());
  }, [dispatch]);

  useEffect(() => {
    if (selectedFolder?.id !== undefined) {
      dispatch(fetchNotes(selectedFolder.id)).catch((error) => {
        console.error("Error fetching notes:", error);
      });
    }
  }, [dispatch, selectedFolder]);
    if (selectedFolder?.id !== undefined) {
      dispatch(fetchNotes(selectedFolder.id)).catch((error) => {
        console.error("Error fetching notes:", error);
      });
    }
  }, [dispatch, selectedFolder]);

  const filteredFolders = useMemo(
    () =>
      folders.filter((folder) =>
        folder.name.toLowerCase().includes(search.toLowerCase())
      ),
    () =>
      folders.filter((folder) =>
        folder.name.toLowerCase().includes(search.toLowerCase())
      ),
    [folders, search]
  );

  const handleCreateFolder = async (name: string) => {
    try {
      await dispatch(addFolder(name));
      await dispatch(addFolder(name));
    } catch (error) {
      console.error("Folder creation failed:", error);
      alert("Failed to create folder");
    }
  };

  const handleUpdateFolder = async (id: number, newName: string) => {
  const handleUpdateFolder = async (id: number, newName: string) => {
    try {
      await dispatch(editFolder({ id, name: newName }));
      await dispatch(editFolder({ id, name: newName }));
    } catch (error) {
      console.error("Folder update failed:", error);
      alert("Failed to update folder");
    }
  };

  const handleDeleteFolder = async (id: number) => {
    if (!confirm("Delete folder and all notes inside?")) return;

    try {
      await dispatch(removeFolder(id));
      await dispatch(removeFolder(id));
      if (selectedFolder?.id === id) {
        dispatch(setSelectedFolder(null));
      }
    } catch (error) {
      console.error("Folder deletion failed:", error);
      alert("Failed to delete folder");
    }
  };

  const handleSaveNote = async (text: string) => {
    if (!selectedFolder) return;

    try {
      if (selectedNote) {
        await dispatch(updateNoteContent({ ...selectedNote, text }));
        await dispatch(updateNoteContent({ ...selectedNote, text }));
      } else {
        await dispatch(createNote({ text, folderId: selectedFolder.id }));
        await dispatch(createNote({ text, folderId: selectedFolder.id }));
      }
      dispatch(fetchNotes(selectedFolder.id));
      setShowNoteModal(false);
      setSelectedNote(null);
    } catch (error) {
      console.error("Note save failed:", error);
      alert("Failed to save note");
    }
  };

  const handleDeleteNote = async (noteId: number) => {
  const handleDeleteNote = async (noteId: number) => {
    if (!confirm("Delete this note permanently?")) return;


    try {
      await dispatch(deleteNote(noteId));
      if (selectedFolder?.id !== undefined) {
      await dispatch(deleteNote(noteId));
      if (selectedFolder?.id !== undefined) {
        dispatch(fetchNotes(selectedFolder.id));
      }
    } catch (error) {
      console.error("Note deletion failed:", error);
      alert("Failed to delete note");
    }
  };

  if (folderStatus === "loading") return <div className="p-4">Loading folders...</div>;
  if (folderStatus === "loading") return <div className="p-4">Loading folders...</div>;
  if (folderError) return <div className="p-4 text-red-500">Folder Error: {folderError}</div>;

  return (
    <div className="min-h-screen dark:bg-gray-900 py-2 px-2 md:px-6">
    <div className="min-h-screen dark:bg-gray-900 py-2 px-2 md:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Folder Panel */}
        <Card className="col-span-1 h-full overflow-hidden bg-white dark:bg-gray-800 border dark:border-gray-700">
        {/* Folder Panel */}
        <Card className="col-span-1 h-full overflow-hidden bg-white dark:bg-gray-800 border dark:border-gray-700">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">📁 Folders</h2>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">📁 Folders</h2>
            <ScrollArea className="h-[calc(100vh-160px)] pr-1">
              <FolderList
                folders={filteredFolders}
                search={search}
                setSearch={(value) => dispatch(setSearch(value))}
                onSelectFolder={(folder) => dispatch(setSelectedFolder(folder))}
                selectedFolder={selectedFolder}
                onCreateFolder={handleCreateFolder}
                onUpdateFolder={handleUpdateFolder}
                onDeleteFolder={handleDeleteFolder}
              />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Notes/Documents Panel */}
        <Card className="col-span-1 md:col-span-2 flex flex-col border bg-white dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {selectedFolder ? `📂 "${selectedFolder.name}"` : "No Folder Selected"}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "notes" ? "default" : "outline"}
                  onClick={() => setActiveTab("notes")}
                >
                  Notes
                </Button>
                <Button
                  variant={activeTab === "documents" ? "default" : "outline"}
                  onClick={() => setActiveTab("documents")}
                  disabled={!selectedFolder}
                >
                  Documents
                </Button>
              </div>
            </div>

            {selectedFolder ? (
              activeTab === "notes" ? (
                noteStatus === "loading" ? (
                  <Skeleton className="w-full h-32 rounded-md" />
                ) : noteError ? (
                  <div className="text-red-500">Error: {noteError}</div>
                ) : (
                  <NoteList
                    folderId={selectedFolder.id}
                    notes={notes}
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
                    onDeleteNote={handleDeleteNote}
                  />
                )
              ) : (
                <DocumentPanel folderId={selectedFolder.id} />
              )
            ) : (
              <div className="text-gray-600 dark:text-gray-300">
                Select a folder to view content.
                Select a folder to view content.
              </div>
            )}
          </CardContent>
        </Card>
      </div>


      <NoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        content={selectedNote?.text || ""}
        onSave={handleSaveNote}
        isEditing={modalEditing}
      />
    </div>
  );
}

