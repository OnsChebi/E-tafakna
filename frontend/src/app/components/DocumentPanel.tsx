"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadIcon, TrashIcon } from "lucide-react";
import { documentApi, DocumentType } from "../service/document";
import ConfirmDialog from "./ConfirmPopUp";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export default function DocumentsPanel({ folderId }: { folderId: number }) {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 2000);
      return () => clearTimeout(timer); 
    }
  }, [error]);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await documentApi.getByFolder(folderId);
        setDocuments(res.data);
      } catch {
        setError("❌ Failed to load documents.");
      } finally {
        setLoading(false);
      }
    };

    if (folderId) fetchDocuments();
  }, [folderId]);

  const handleDelete = async (id: number) => {
    try {
      await documentApi.delete(id);
      setDocuments((docs) => docs.filter((doc) => doc.id !== id));
    } catch {
      setError("❌ Failed to delete document.");
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const fullUrl = `${BASE_URL}${url}`;
      const res = await fetch(fullUrl);
      if (!res.ok) throw new Error("Network response was not ok");

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      setError("❌ Failed to download file.");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderId", folderId.toString());
      formData.append("title", file.name);
      const simplifiedType = file.type.split("/")[1] || "unknown";
      formData.append("type", simplifiedType);

      const res = await documentApi.create(formData);
      setDocuments((docs) => [...docs, res.data]);
    } catch {
      setError("❌ Failed to upload document.");
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setDialogOpen(true);
  };

  const onConfirmDelete = () => {
    if (deleteId !== null) {
      handleDelete(deleteId);
    }
    setDialogOpen(false);
    setDeleteId(null);
  };

  const onCancelDelete = () => {
    setDialogOpen(false);
    setDeleteId(null);
  };

  return (
    <>
      <div className="mt-4 h-full flex flex-col">
        <CardContent className="p-4 flex flex-col h-full">
          {/* Header */}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            📎 Documents
          </h3>

          {/* Upload Input */}
          <div className="mb-4">
            <input
              type="file"
              onChange={handleUpload}
              className="text-sm text-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded transition-opacity duration-500">
              {error}
            </div>
          )}

          {/* Scrollable Document List */}
          <div className="flex-1 overflow-y-auto max-h-[50vh] pr-2">
            {loading ? (
              <div className="text-gray-600 dark:text-gray-300">Loading...</div>
            ) : documents.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400">
                No documents uploaded.
              </div>
            ) : (
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded hover:shadow transition"
                  >
                    <div className="truncate">
                      <a
                        href={`${BASE_URL}${doc.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {doc.title}
                      </a>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(doc.uploadedAt).toLocaleString()} - {doc.type}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDownload(doc.url, doc.title)}
                      >
                        <DownloadIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => confirmDelete(doc.id)}
                      >
                        <TrashIcon className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </div>

      {/* Confirm Delete Dialog */}
      {dialogOpen && (
        <ConfirmDialog
          message="Delete this document?"
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      )}
    </>
  );
}
