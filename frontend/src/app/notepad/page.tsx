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

export default function NotepadPage() {
  const dispatch = useDispatch<AppDispatch>();//sending  actions to redux store
  const search = useSelector((state: RootState) => state.folders.search);//bch njibou search value from redux store(useSelector 3akss use dispatch )
  const { folders, selectedFolder, status: folderStatus, error: folderError } = 
    useSelector((state: RootState) => state.folders);
  const { notes, status: noteStatus, error: noteError } = 
    useSelector((state: RootState) => state.notes);
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [modalEditing, setModalEditing] = useState(false);//track edit mode

  // Load initial data
  useEffect(() => {
    dispatch(fetchFolders());
  }, [dispatch]);

  // Load notes when selected folder changes
  useEffect(() => {
  if (selectedFolder?.id) {
    //console.log('Fetching notes for folder ID:', selectedFolder.id);
    dispatch(fetchNotes(selectedFolder.id))
      // .then((notes) => {
      //   console.log('Received notes:', notes);
      // })
      .catch((error) => {
        console.error('Error fetching notes:', error);
        // console.log('Error details:', {
        //   config: error.config,
        //   response: error.response?.data
        // });
      });
  }
}, [dispatch, selectedFolder]);//run when selectd folder change

  const filteredFolders = useMemo(
    () => folders.filter(folder =>
      folder.name.toLowerCase().includes(search.toLowerCase())
    ),
    [folders, search]
  );

  const handleCreateFolder = async (name: string) => {
    try {
      await dispatch(addFolder(name))
    } catch (error) {
      console.error("Folder creation failed:", error);
      alert("Failed to create folder");
    }
  };

  const handleUpdateFolder = async (id: number, newName: string) => { 
    try {
      await dispatch(editFolder({ id, name: newName }))
    } catch (error) {
      console.error("Folder update failed:", error);
      alert("Failed to update folder");
    }
  };

  const handleDeleteFolder = async (id: number) => { 
    if (!confirm("Delete folder and all notes inside?")) return;
    
    try {
      await dispatch(removeFolder(id))
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
    // console.log('Saving note with:', { 
    //   text, 
    //   folderId: selectedFolder.id,
    //   isUpdate: !!selectedNote 
    // });

    try {
      if (selectedNote) {
        //console.log('Updating note:', selectedNote.id, 'with text:', text);
        await dispatch(updateNoteContent({
          ...selectedNote,
          text
        }))
      } else {
        await dispatch(createNote({
          text,
          folderId: selectedFolder.id 
        }))
        //console.log(selectedNote);
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

  const handleDeleteNote = async (noteId: number) => { 
    if (!confirm("Delete this note permanently?")) return;
    
    try {
      await dispatch(deleteNote(noteId))
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
    <div className="min-h-screen  dark:bg-gray-900 py-2 px-2 md:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
  
        {/* Folder Panel - 1/3 */}
        <Card className="col-span-1 h-full overflow-hidden   bg-white  dark:bg-gray-800 border dark:border-gray-700 ">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-bold  text-gray-800 dark:text-gray-100">📁 Folders</h2>
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
  
        {/* Notes Panel - 2/3 */}
        <Card className="col-span-1 md:col-span-2 flex flex-col border bg-white  dark:bg-gray-800 dark:border-gray-700 ">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                📝 {selectedFolder ? `Notes in "${selectedFolder.name}"` : "No Folder Selected"}
              </h2>
            </div>
  
            {noteStatus === "loading" ? (
              <Skeleton className="w-full h-32 rounded-md" />
            ) : noteError ? (
              <div className="text-red-500">Error: {noteError}</div>
            ) : selectedFolder ? (
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
            ) : (
              <div className="text-gray-600 dark:text-gray-300">
                Select a folder to view notes.
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