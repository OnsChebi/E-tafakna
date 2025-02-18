"use client";

import React from "react";
import { Folder } from "../notepad/page";

type NoteListProps = {
  folder: Folder;
};

export default function NoteList({ folder }: NoteListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Notes in {folder.name}
      </h2>
      {folder.notes.length > 0 ? (
        <ul className="space-y-4">
          {folder.notes.map((note) => (
            <li key={note.id} className="border-b pb-2">
              <p className="text-gray-700 dark:text-gray-300">{note.content}</p>
              <span className="text-xs text-gray-500">
                {new Date(note.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No notes in this folder yet.</p>
      )}
    </div>
  );
}
