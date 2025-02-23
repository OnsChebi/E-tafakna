"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { XIcon } from "lucide-react";

type NoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content?: string;
  onSave: (content: string) => void;
  isEditing?: boolean;
};

export const NoteModal = ({ 
  isOpen, 
  onClose, 
  content = "", 
  onSave,
  isEditing = false
}: NoteModalProps) => {
  const [noteContent, setNoteContent] = useState(content);
  const [internalEditing, setInternalEditing] = useState(isEditing);//Controls whether the user is editing or just viewing the note

  useEffect(() => {
    if (isOpen) {
      setNoteContent(content);//to ensure the modal shows the latest note
      setInternalEditing(isEditing || !content);
    }
  }, [isOpen, content, isEditing]);

  const handleSave = () => {
    if (noteContent.trim()) {
      onSave(noteContent.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold dark:text-gray-100">
            {internalEditing ? (content ? "Edit Note" : "New Note") : "View Note"}
          </h3>
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <XIcon className="h-4 w-4 dark:text-white" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {internalEditing ? (
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your note here..."
              className="min-h-[200px] dark:bg-gray-700 dark:text-gray-100"
              autoFocus
            />
          ) : (
            <pre className="whitespace-pre-wrap dark:text-gray-100 overflow-auto">
              {noteContent}
            </pre>
          )}
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t">
          {internalEditing ? (
            <>
               <Button
                    
                    size="sm"
                    onClick={onClose}
                    className="bg-gray-500 hover:bg-[#5a5a5a] text-white hover:text-white"

                  >
                    <XIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
              <Button 
                onClick={handleSave}
                className="bg-[#1366e8] hover:bg-[#1158c7] text-white"
                disabled={!noteContent.trim()}
              >
                Save Note
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setInternalEditing(true)}
              className="bg-[#1366e8] hover:bg-[#1158c7] text-white"
            >
              Edit Note
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};