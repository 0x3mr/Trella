import { useState, useEffect, useRef, useCallback } from "react";

export default function CardDetailModal({ card, onClose, onSave }) {
  // Initialize state directly from card prop - NO useEffect needed for this
  const [title, setTitle] = useState(card?.title || "");
  const [description, setDescription] = useState(card?.description || "");
  const modalRef = useRef(null);
  const titleInputRef = useRef(null);

  // Wrap handleClose in useCallback to avoid recreating on every render
  const handleClose = useCallback(() => {
    onSave({ title, description });
    onClose();
  }, [title, description, onSave, onClose]);

  // Focus on mount only
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  // Focus trap and keyboard handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }

      // Focus trap logic
      if (e.key === "Tab") {
        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  if (!card) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <h2 id="modal-title" className="text-xl font-bold mb-4">
          Edit Card
        </h2>
        <div className="mb-4">
          <label
            htmlFor="card-title-input"
            className="block text-sm font-medium mb-1"
          >
            Card title
          </label>
          <input
            id="card-title-input"
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Card title"
            placeholder="Card title"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="card-description-input"
            className="block text-sm font-medium mb-1"
          >
            Card description
          </label>
          <textarea
            id="card-description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-label="Card description"
            className="w-full border border-gray-300 rounded px-3 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            data-testid="card-save-button"
            onClick={handleClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Save card changes"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Cancel and close modal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
