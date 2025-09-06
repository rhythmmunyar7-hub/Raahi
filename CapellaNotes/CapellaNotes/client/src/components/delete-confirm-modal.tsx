import { X } from "lucide-react";
import type { Note } from "@shared/schema";

interface DeleteConfirmModalProps {
  note: Note;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ note, onConfirm, onCancel }: DeleteConfirmModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="glass-card rounded-xl p-8 max-w-md mx-4 animate-slide-up relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <div className="text-4xl mb-4">🗑️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Delete this note?</h3>
          <p className="text-gray-600 mb-2">This action cannot be undone.</p>
          <p className="text-sm text-gray-500 mb-6 font-medium">"{note.title || 'Untitled Note'}"</p>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 glass-button-secondary px-4 py-2 rounded-sm text-gray-700 font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 glass-button-danger px-4 py-2 rounded-sm text-white font-medium transition-all duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}