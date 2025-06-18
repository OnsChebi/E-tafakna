"use client";

import React, { useEffect, useState } from "react";
import FroalaEditorComponent from "react-froala-wysiwyg";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type NoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content?: string;
  onSave: (content: string) => void;
  isEditing?: boolean;
};

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

  const handleSave = () => {
    if (noteContent.trim()) {
      const strippedContent = stripHtmlTags(noteContent);
      const sanitizedContent = DOMPurify.sanitize(strippedContent);
      onSave(sanitizedContent);
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setNoteContent(content);
      setInternalEditing(isEditing || !content);
    }
  }, [isOpen, content, isEditing]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 max-h-[80vh] flex flex-col">
        <DialogHeader className="border-b p-4">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold dark:text-gray-100">
              {internalEditing ? (content ? "Edit Note" : "New Note") : "View Note"}
            </DialogTitle>
            
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {internalEditing ? (
            <FroalaEditorComponent
              tag="textarea"
              model={noteContent}
              onModelChange={setNoteContent}
              config={{
                placeholderText: "Write your note here...",
                toolbarButtons: {
                  moreText: {
                    buttons: [
                      "bold", "italic", "underline", "strikeThrough",
                      "subscript", "superscript", "fontFamily", "fontSize",
                      "textColor", "backgroundColor", "inlineClass", "inlineStyle",
                    ],
                  },
                  moreParagraph: {
                    buttons: [
                      "alignLeft", "alignCenter", "alignRight", "alignJustify",
                      "formatOL", "formatUL", "paragraphFormat", "paragraphStyle",
                      "lineHeight", "outdent", "indent", "quote",
                    ],
                  },
                  moreRich: {
                    buttons: ["insertTable", "emoticons", "fontAwesome"],
                  },
                  moreMisc: {
                    buttons: [
                      "undo", "redo", "fullscreen", "print",
                      "getPDF", "spellChecker", "selectAll",
                    ],
                    align: "right",
                    buttonsVisible: 2,
                  },
                },
                quickInsertEnabled: false,
                pastePlain: true,
                charCounterCount: true,
                charCounterMax: 1000,
              }}
            />
          ) : (
            <div
              className="prose  dark:bg-gray-800/50 dark:text-gray-100 p-4 rounded min-h-[200px] overflow-auto"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(noteContent) }}
            />
          )}
        </div>

        <DialogFooter className="border-t p-4">
          {internalEditing ? (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 bg-gray-600 dark:bg-gray-200"
              >
                Cancel
              </Button>
              <Button
              className="bg-blue-700 text-white hover:bg-blue-500"
                onClick={handleSave}
                disabled={!noteContent.trim()}
              >
                Save Note
              </Button>
            </>
          ) : (
            <Button className="bg-blue-700 text-white hover:bg-blue-500" onClick={() => setInternalEditing(true)}>
              Edit Note
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};