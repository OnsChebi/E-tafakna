"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X as XIcon, Trash2 } from "lucide-react";
import { tagApi } from "../service/tag";

export type Tag = {
  id: number;
  name: string;
  color: string;
};

interface FolderTagsProps {
  folderId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FolderTags({
  folderId,
  open,
  onOpenChange,
}: FolderTagsProps) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [folderTags, setFolderTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#2563eb");
  const [selectedExistingTag, setSelectedExistingTag] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadTags = async () => {
    try {
      setError(null);
      setLoading(true);

      const [allTagsRes, folderTagsRes] = await Promise.all([
        tagApi
          .getAllTags()
          .then((res: { data: any; }) => res.data)
          .catch((err: { response: { status: number; }; }) => {
            if (err.response?.status === 404) return [];
            throw err;
          }),
        tagApi
          .getTagsByFolder(folderId)
          .then((res: { data: any; }) => res.data)
          .catch((err: { response: { status: number; }; }) => {
            if (err.response?.status === 404) return [];
            throw err;
          }),
      ]);

      setAllTags(allTagsRes);
      setFolderTags(folderTagsRes);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while loading tags.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadTags();
    }
  }, [open, folderId]);

  const handleCreateAndAssign = async () => {
    if (!newTagName.trim()) {
      setError("Tag name is required");
      return;
    }
    try {
      setError(null);
      await tagApi.createAndAssignTag(folderId, newTagName.trim(), newTagColor);
      setNewTagName("");
      await loadTags();
    } catch {
      setError("Failed to create tag");
    }
  };

  const handleAssignExisting = async () => {
    if (!selectedExistingTag) return;
    try {
      await tagApi.assignExistingTagToFolder(folderId, selectedExistingTag);
      await loadTags();
    } catch {
      setError("Failed to assign tag");
    }
  };

  const handleRemoveTagFromFolder = async (tagId: number) => {
    try {
      await tagApi.removeTagFromFolder(folderId, tagId);
      setFolderTags((prev) => prev.filter((t) => t.id !== tagId));
    } catch {
      setError("Failed to remove tag");
    }
  };

  const handleDeleteTagCompletely = async (tagId: number) => {
    try {
      await tagApi.deleteTag(tagId);
      await loadTags();
    } catch {
      setError("Failed to delete tag");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-w-lg w-[90vw] max-h-[85vh] overflow-auto rounded-lg bg-white dark:bg-gray-900 p-6 shadow-lg transform -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Manage Tags for Folder #{folderId}
          </Dialog.Title>

          {/* Folder's current tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {folderTags.length === 0 && !loading && (
              <p className="text-gray-500 dark:text-gray-400">No tags assigned.</p>
            )}
            {folderTags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold text-white"
                style={{ backgroundColor: tag.color }}
              >
                <span>{tag.name}</span>
                <button
                  onClick={() => handleRemoveTagFromFolder(tag.id)}
                  aria-label={`Remove tag ${tag.name}`}
                  className="hover:brightness-90"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Assign existing tag */}
          <div className="flex gap-2 mb-4">
            <select
              className="flex-grow border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
              value={selectedExistingTag ?? ""}
              onChange={(e) =>
                setSelectedExistingTag(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Select existing tag</option>
              {allTags
                .filter((t) => !folderTags.some((ft) => ft.id === t.id))
                .map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
            </select>
            <Button onClick={handleAssignExisting}>Assign</Button>
          </div>

          {/* Create new tag */}
          <div className="flex gap-2 items-center mb-4">
            <Input
              type="text"
              placeholder="New tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="flex-grow dark:bg-gray-800 dark:text-white"
            />
            <input
              type="color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="w-10 h-10 border rounded"
            />
            <Button onClick={handleCreateAndAssign}>Create & Assign</Button>
          </div>

          {/* All tags list with delete option */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              All Tags
            </h3>
            {allTags.length === 0 && !loading ? (
              <p className="text-gray-500 dark:text-gray-400">No tags created yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    <span>{tag.name}</span>
                    <button
                      onClick={() => handleDeleteTagCompletely(tag.id)}
                      aria-label={`Delete tag ${tag.name}`}
                      className="hover:brightness-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

          <Dialog.Close asChild>
            <Button variant="outline" className="mt-4 w-full">
              Close
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
