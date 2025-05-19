import { useState } from "react";

type CancelPopupProps = {
  meetingId: number;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

const CancelPopup = ({ meetingId, onClose, onConfirm }: CancelPopupProps) => {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Cancel Meeting
        </h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter cancellation reason..."
          className="w-full h-24 p-2 border dark:border-gray-700 rounded dark:bg-gray-900 dark:text-white"
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
          >
            Close
          </button>
          <button
            onClick={() => onConfirm(reason)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            disabled={!reason.trim()}
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelPopup;
