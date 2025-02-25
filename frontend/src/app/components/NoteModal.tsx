"use client";

import React, { useEffect, useState } from "react";
import FroalaEditorComponent from "react-froala-wysiwyg";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

type NoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content?: string;
  onSave: (content: string) => void;
  isEditing?: boolean;
};

// Utility function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, "").trim();
};

export const NoteModal = ({
  isOpen,
  onClose,
  content = "",
  onSave,
  isEditing = false,
}: NoteModalProps) => {
  const [noteContent, setNoteContent] = useState(content);
  const [internalEditing, setInternalEditing] = useState(isEditing);
  const [isClient, setIsClient] = useState(false);

  // Ensure this runs only on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle saving the note
  const handleSave = () => {
    if (noteContent.trim()) {
      // Strip HTML tags and sanitize the content
      const strippedContent = stripHtmlTags(noteContent);
      const sanitizedContent = DOMPurify.sanitize(strippedContent);
      onSave(sanitizedContent); // Save the sanitized content
      onClose(); // Close the modal
    }
  };

  // Reset the modal state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setNoteContent(content);
      setInternalEditing(isEditing || !content); // Open in edit mode for new notes
    }
  }, [isOpen, content, isEditing]);

  // Don't render the modal if it's not open or not on the client
  if (!isOpen || !isClient) return null;

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
            <FroalaEditorComponent
              tag="textarea"
              model={noteContent}
              onModelChange={(newContent: string) => setNoteContent(newContent)}
              config={{
                placeholderText: "Write your note here...",
                toolbarButtons: {
                  moreText: {
                    buttons: [
                      "bold",
                      "italic",
                      "underline",
                      "strikeThrough",
                      "subscript",
                      "superscript",
                      "fontFamily",
                      "fontSize",
                      "textColor",
                      "backgroundColor",
                      "inlineClass",
                      "inlineStyle",
                      
                    ],
                  },
                  moreParagraph: {
                    buttons: [
                      "alignLeft",
                      "alignCenter",
                      "alignRight",
                      "alignJustify",
                      "formatOL",
                      "formatUL",
                      "paragraphFormat",
                      "paragraphStyle",
                      "lineHeight",
                      "outdent",
                      "indent",
                      "quote",
                    ],
                  },
                  moreRich: {
                    buttons: [
                      
                      "insertTable",
                      "emoticons",
                      "fontAwesome",
                      
                    ],
                  },
                  moreMisc: {
                    buttons: [
                      "undo",
                      "redo",
                      "fullscreen",
                      "print",
                      "getPDF",
                      "spellChecker",
                      "selectAll",
                    ],
                    align: "right",
                    buttonsVisible: 2,
                  },
                },
                quickInsertEnabled: false,
                pastePlain: true,
                charCounterCount: true, 
                charCounterMax: 1000, 
                events: {
                  initialized: () => {
                    console.log("Froala Editor initialized");
                  },
                  keydown: (e: KeyboardEvent) => {
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowDown",
                      "Tab",
                      "Enter",
                    ];
                    const isAllowedKey = allowedKeys.includes(e.key);
                    const isAlphanumeric = /^[a-zA-Z0-9\s.,!?;:'"()-]$/.test(e.key);

                    if (!isAllowedKey && !isAlphanumeric) {
                      e.preventDefault();
                    }
                  },
                },
              }}
            />
          ) : (
            <div
              className="prose dark:prose-invert dark:bg-gray-700 dark:text-gray-100 p-4 rounded min-h-[200px] overflow-auto"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(noteContent) }}
            />
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