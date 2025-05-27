"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle} from "lucide-react";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md p-6 sm:p-8 bg-white dark:bg-gray-900">
        <DialogHeader className="flex flex-row items-start justify-between">
          <div className="flex items-center gap-2 ">
            <AlertTriangle className="text-yellow-500 w-6 h-6" />
            <DialogTitle className="text-lg items-center text-center font-semibold text-gray-900 dark:text-gray-100 mb-2">Are you sure?</DialogTitle>
          </div>
          <DialogClose asChild>
            
          </DialogClose>
        </DialogHeader>

        <DialogDescription className="text-gray-600 dark:text-gray-300 mt-2 mb-4">
          {message}
        </DialogDescription>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="sm:w-auto w-full"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white sm:w-auto w-full"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
