"use client";

import React from "react";
import { Folder } from "../notepad/page";
import { Button } from "@/components/ui/button";
import { EditIcon, TrashIcon, PlusIcon } from "lucide-react";

type NoteListProps = {
  folder: Folder;
  onEditNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onAddNote: () => void;
  onViewNote: (noteId: string) => void;
};

export default function NoteList({ 
  folder, 
  onEditNote, 
  onDeleteNote,
  onAddNote,
  onViewNote
}: NoteListProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Notes in {folder.name}
        </h2>
        <Button 
          onClick={onAddNote}
          className="bg-[#1366e8] hover:bg-[#1158c7] text-white"
          size="sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>
      
      {folder.notes.length > 0 ? (
        <ul className="space-y-4 flex-1 overflow-y-auto max-h-[60vh]">
          {folder.notes.map((note) => (
            <li 
              key={note.id} 
              className="border-b pb-2 group hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onViewNote(note.id)}
                >
                  <p className="text-gray-700 dark:text-gray-100 whitespace-pre-wrap line-clamp-3">
                    {note.content}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(note.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditNote(note.id);
                    }}
                  >
                    <EditIcon className="h-4 w-4 dark:text-white" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No notes in this folder yet.</p>
        </div>
      )}
    </div>
  );
}