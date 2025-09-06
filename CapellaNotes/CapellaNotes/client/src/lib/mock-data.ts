import type { Note } from "@shared/schema";

// Create a global notes array that can be modified
export let mockNotes: Note[] = [];

// Helper functions for managing notes
export const updateNote = (id: string, updates: Partial<Note>) => {
  const index = mockNotes.findIndex(note => note.id === id);
  if (index !== -1) {
    mockNotes[index] = { 
      ...mockNotes[index], 
      ...updates, 
      updatedAt: new Date() 
    };
  }
};

export const deleteNote = (id: string) => {
  const index = mockNotes.findIndex(note => note.id === id);
  if (index !== -1) {
    mockNotes.splice(index, 1);
  }
};

export const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newNote: Note = {
    ...note,
    id: Date.now().toString(),
    tags: note.tags || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockNotes.unshift(newNote);
  return newNote;
};
