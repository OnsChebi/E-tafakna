// components/ConfirmDialog.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

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
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 border dark:border-gray-700"
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
            >
              <AlertTriangle
                className="w-12 h-12 text-yellow-500 mb-4"
                strokeWidth={1.5}
              />
            </motion.div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Are you sure?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {message}
            </p>
            
            <div className="w-full flex flex-col sm:flex-row justify-center gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="w-full sm:w-auto px-6 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                className="w-full sm:w-auto px-6 bg-blue-600 hover:bg-blue-700 
                         dark:bg-blue-700 dark:hover:bg-blue-800 text-white 
                         transition-colors"
              >
                Confirm
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}