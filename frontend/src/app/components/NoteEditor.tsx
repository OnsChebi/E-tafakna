"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // shadcn UI button component
import { Textarea } from "@/components/ui/textarea"; // shadcn UI textarea component

type NoteEditorProps = {
  folderId: string;
  onAddNote: (folderId: string, content: string) => void;
};

export default function NoteEditor({ folderId, onAddNote }: NoteEditorProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddNote(folderId, content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
        Add New Note
      </h2>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your note here..."
        className="mb-4"
      />
      <Button type="submit" className="w-full">
        Add Note
      </Button>
    </form>
  );
}
