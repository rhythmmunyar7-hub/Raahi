import { Edit, Trash2, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { Note } from "@shared/schema";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
  animationDelay?: number;
}

export default function NoteCard({ note, onClick, onEdit, onDelete, onShare, animationDelay = 0 }: NoteCardProps) {
  const getPreviewText = (content: string) => {
    // Strip HTML tags and get first 150 characters
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  const formatLastEdited = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const tagColors = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-pink-100 text-pink-800 border-pink-200', 
    'bg-green-100 text-green-800 border-green-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200'
  ];

  return (
    <div
      onClick={onClick}
      className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group animate-slide-up note-card-hover relative"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="h-full flex flex-col">
        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span
                key={tag}
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md border shadow-sm",
                  tagColors[index % tagColors.length]
                )}
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md bg-gray-100 text-gray-600 border border-gray-200 shadow-sm">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <h3 className="font-semibold text-gray-800 mb-3 text-lg line-clamp-2 pr-8">
          {note.title || "Untitled Note"}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-4 flex-grow">
          {getPreviewText(note.content)}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <span className="font-medium">{formatLastEdited(note.updatedAt)}</span>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => handleButtonClick(e, onEdit)}
              className="glass-button-small p-1.5 rounded-md text-teal-600 transition-all duration-200"
              title="Edit"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => handleButtonClick(e, onShare)}
              className="glass-button-small p-1.5 rounded-md text-blue-600 transition-all duration-200"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => handleButtonClick(e, onDelete)}
              className="glass-button-small p-1.5 rounded-md text-red-600 transition-all duration-200"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
