import { useState } from "react";
import { useLocation } from "wouter";
import NoteCard from "@/components/note-card";
import DeleteConfirmModal from "@/components/delete-confirm-modal";
import { mockNotes, deleteNote } from "@/lib/mock-data";
import type { Note } from "@shared/schema";

interface HomeProps {
  searchQuery?: string;
}

export default function Home({ searchQuery: externalSearchQuery }: HomeProps = {}) {
  const [, setLocation] = useLocation();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [notes, setNotes] = useState(mockNotes);
  const [deleteModalNote, setDeleteModalNote] = useState<Note | null>(null);

  // Use external search query from top navigation if available, otherwise use local search
  const searchQuery = externalSearchQuery || localSearchQuery;

  const filteredNotes = notes.filter(note => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const titleMatch = note.title.toLowerCase().includes(query);
    const contentMatch = note.content.replace(/<[^>]*>/g, '').toLowerCase().includes(query);
    const tagMatch = note.tags?.some(tag => tag.toLowerCase().includes(query)) || false;
    
    return titleMatch || contentMatch || tagMatch;
  });

  const handleNoteClick = (note: Note) => {
    setLocation(`/editor/${note.id}`);
  };

  const handleEditNote = (note: Note) => {
    setLocation(`/editor/${note.id}`);
  };

  const handleDeleteNote = (note: Note) => {
    setDeleteModalNote(note);
  };

  const confirmDelete = () => {
    if (deleteModalNote) {
      deleteNote(deleteModalNote.id);
      setNotes([...mockNotes]);
      setDeleteModalNote(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalNote(null);
  };

  const handleShareNote = (note: Note) => {
    const noteText = `${note.title}\n\n${note.content.replace(/<[^>]*>/g, '')}`;
    
    if (navigator.share) {
      navigator.share({
        title: note.title || 'Untitled Note',
        text: noteText,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(noteText);
        alert('Note copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(noteText);
      alert('Note copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-fade-in">

        {/* Search Bar for Mobile */}
        <div className="block sm:hidden mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="w-full px-4 py-3 text-sm glass-effect rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder-gray-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No notes found</div>
              <p className="text-gray-500">
                {searchQuery ? "Try adjusting your search terms" : "Create your first note to get started"}
              </p>
            </div>
          ) : (
            filteredNotes.map((note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => handleNoteClick(note)}
                onEdit={() => handleEditNote(note)}
                onDelete={() => handleDeleteNote(note)}
                onShare={() => handleShareNote(note)}
                animationDelay={index * 50}
              />
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalNote && (
        <DeleteConfirmModal
          note={deleteModalNote}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
