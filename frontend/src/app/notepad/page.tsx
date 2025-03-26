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

export default function NotepadPage() {
  const dispatch = useDispatch<AppDispatch>();
  const search = useSelector((state: RootState) => state.folders.search);
  const { folders, selectedFolder, status: folderStatus, error: folderError } = 
    useSelector((state: RootState) => state.folders);
  const { notes, status: noteStatus, error: noteError } = 
    useSelector((state: RootState) => state.notes);
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [modalEditing, setModalEditing] = useState(false);

  // Load initial data
  useEffect(() => {
    dispatch(fetchFolders());
  }, [dispatch]);

  // Load notes when selected folder changes
  useEffect(() => {
  if (selectedFolder?.id) {
    console.log('Fetching notes for folder ID:', selectedFolder.id);
    dispatch(fetchNotes(selectedFolder.id))
      .unwrap()
      .then((notes) => {
        console.log('Received notes:', notes);
      })
      .catch((error) => {
        console.error('Error fetching notes:', error);
        console.log('Error details:', {
          config: error.config,
          response: error.response?.data
        });
      });
  }
}, [dispatch, selectedFolder]);

  const filteredFolders = useMemo(
    () => folders.filter(folder =>
      folder.name.toLowerCase().includes(search.toLowerCase())
    ),
    [folders, search]
  );

  const handleCreateFolder = async (name: string) => {
    try {
      await dispatch(addFolder(name)).unwrap();
    } catch (error) {
      console.error("Folder creation failed:", error);
      alert("Failed to create folder");
    }
  };

  const handleUpdateFolder = async (id: number, newName: string) => { 
    try {
      await dispatch(editFolder({ id, name: newName })).unwrap();
    } catch (error) {
      console.error("Folder update failed:", error);
      alert("Failed to update folder");
    }
  };

  const handleDeleteFolder = async (id: number) => { 
    if (!confirm("Delete folder and all notes inside?")) return;
    
    try {
      await dispatch(removeFolder(id)).unwrap();
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
    console.log('Saving note with:', { 
      text, 
      folderId: selectedFolder.id,
      isUpdate: !!selectedNote 
    });

    try {
      if (selectedNote) {
        console.log('Updating note:', selectedNote.id, 'with text:', text);
        await dispatch(updateNoteContent({
          ...selectedNote,
          text
        })).unwrap();
      } else {
        await dispatch(createNote({
          text,
          folderId: selectedFolder.id 
        })).unwrap();
        console.log(selectedNote);
      }
      // Refresh notes after update
      dispatch(fetchNotes(selectedFolder.id));
      setShowNoteModal(false);
      setSelectedNote(null);
    } catch (error) {
      console.error("Note save failed:", error);
      alert("Failed to save note");
    }
  };

  const handleDeleteNote = async (noteId: number) => { // number type
    if (!confirm("Delete this note permanently?")) return;
    
    try {
      await dispatch(deleteNote(noteId)).unwrap();
      // Refresh notes after deletion
      if (selectedFolder?.id) {
        dispatch(fetchNotes(selectedFolder.id));
      }
    } catch (error) {
      console.error("Note deletion failed:", error);
      alert("Failed to delete note");
    }
  };

  if (folderStatus === 'loading') return <div className="p-4">Loading folders...</div>;
  if (folderError) return <div className="p-4 text-red-500">Folder Error: {folderError}</div>;

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-700 p-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 bg-white dark:bg-gray-900 rounded-lg p-4">
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
        </div>

        <div className="md:col-span-3 flex flex-col gap-4 h-full">
          {noteStatus === 'loading' ? (
            <div className="p-4">Loading notes...</div>
          ) : noteError ? (
            <div className="p-4 text-red-500">Note Error: {noteError}</div>
          ) : selectedFolder ? (
            <NoteList
              folderId={selectedFolder.id}
              notes={notes}
              onEditNote={(noteId: number) => { 
                const note = notes.find(n => n.id === noteId);
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
              onViewNote={(noteId: number) => { 
                const note = notes.find(n => n.id === noteId);
                if (note) {
                  setSelectedNote(note);
                  setModalEditing(false);
                  setShowNoteModal(true);
                }
              }}
              onDeleteNote={handleDeleteNote}
            />
          ) : (
            <div className="p-4 text-gray-500">
              Select a folder to view notes
            </div>
          )}
        </div>
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