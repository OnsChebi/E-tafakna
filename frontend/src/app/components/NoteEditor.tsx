// components/NoteEditor.tsx (updated)
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

type NoteEditorProps = {
  onAddNote: () => void;
};

export default function NoteEditor({ onAddNote }: NoteEditorProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <Button 
        onClick={onAddNote}
        className="w-full gap-2 bg-[#1366e8] text-white hover:bg-[#1158c7]"
      >
        <PlusIcon className="h-4 w-4" />
        Add New Note
      </Button>
    </div>
  );
}