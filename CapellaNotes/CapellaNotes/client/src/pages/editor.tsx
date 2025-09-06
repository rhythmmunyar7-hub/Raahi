import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Share2, Trash2, X, Bold, Italic, Underline, List, ListOrdered, Highlighter, Undo, Redo, AlignLeft, AlignCenter, AlignRight, Search, Sparkles, Palette, ChevronDown, Strikethrough, CheckSquare, Heading, Info, Tag, Plus } from "lucide-react";
import RichTextEditor from "@/components/rich-text-editor";
import DeleteConfirmModal from "@/components/delete-confirm-modal";
import { mockNotes, updateNote, deleteNote, addNote } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Note } from "@shared/schema";

export default function Editor() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [deleteModalNote, setDeleteModalNote] = useState<Note | null>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showTextColorDropdown, setShowTextColorDropdown] = useState(false);
  const [showHighlightDropdown, setShowHighlightDropdown] = useState(false);
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const [showAIInfoModal, setShowAIInfoModal] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  useEffect(() => {
    if (id) {
      const foundNote = mockNotes.find(n => n.id === id);
      if (foundNote) {
        setNote(foundNote);
        setTitle(foundNote.title);
        setContent(foundNote.content);
        setTags(foundNote.tags || []);
        setLastSaved(foundNote.updatedAt);
      }
    } else {
      // New note
      setNote(null);
      setTitle("");
      setContent("");
      setTags([]);
      setLastSaved(new Date());
    }
    setHasUnsavedChanges(false);
  }, [id]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        handleSave();
      }, 2000); // Auto-save after 2 seconds of no changes

      return () => clearTimeout(timeoutId);
    }
  }, [title, content, hasUnsavedChanges]);

  const handleClose = () => {
    if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
      return;
    }
    setLocation("/");
  };

  const handleSave = () => {
    const now = new Date();
    if (id && note) {
      // Update existing note
      updateNote(id, { title, content, tags });
      setNote({ ...note, title, content, tags, updatedAt: now });
    } else {
      // Create new note
      const newNote = addNote({ title, content, tags });
      setNote(newNote);
      setLocation(`/editor/${newNote.id}`, { replace: true });
    }
    setLastSaved(now);
    setHasUnsavedChanges(false);
  };

  const handleDelete = () => {
    if (note) {
      setDeleteModalNote(note);
    }
  };

  const confirmDelete = () => {
    if (deleteModalNote && id) {
      deleteNote(id);
      setLocation("/");
    }
    setDeleteModalNote(null);
  };

  const cancelDelete = () => {
    setDeleteModalNote(null);
  };

  const handleShare = () => {
    const noteText = `${title}\n\n${content.replace(/<[^>]*>/g, '')}`;
    
    if (navigator.share) {
      navigator.share({
        title: title || 'Untitled Note',
        text: noteText,
      }).catch(() => {
        navigator.clipboard.writeText(noteText);
        alert('Note copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(noteText);
      alert('Note copied to clipboard!');
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setHasUnsavedChanges(true);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      setShowTagInput(false);
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setHasUnsavedChanges(true);
  };

  const tagColors = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-pink-100 text-pink-800 border-pink-200', 
    'bg-green-100 text-green-800 border-green-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200'
  ];

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateActiveFormats();
  };

  const handleTextColorChange = (color: string) => {
    executeCommand('foreColor', color);
    setShowTextColorDropdown(false);
  };

  const handleHighlightColorChange = (color: string) => {
    executeCommand('hiliteColor', color);
    setShowHighlightDropdown(false);
  };

  const textColors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' }
  ];

  const highlightColors = [
    { name: 'Yellow', value: '#fef08a' },
    { name: 'Pink', value: '#fda4af' },
    { name: 'Light Blue', value: '#93c5fd' }
  ];

  const updateActiveFormats = () => {
    const formats = new Set<string>();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('insertUnorderedList')) formats.add('unordered');
    if (document.queryCommandState('insertOrderedList')) formats.add('ordered');
    if (document.queryCommandState('hiliteColor')) formats.add('highlight');
    if (document.queryCommandState('justifyLeft')) formats.add('alignLeft');
    if (document.queryCommandState('justifyCenter')) formats.add('alignCenter');
    if (document.queryCommandState('justifyRight')) formats.add('alignRight');
    
    setActiveFormats(formats);
  };

  const handleAIAssist = (action: string) => {
    setShowAIDropdown(false);
    alert(`${action} feature coming soon! This will help you improve your writing with AI.`);
  };

  const handleAIInfo = () => {
    setShowAIInfoModal(true);
    setShowAIDropdown(false);
  };

  const handleSearchInNote = (query: string) => {
    setSearchQuery(query);
    // Basic search functionality - highlight matching text
    if (query) {
      const content = document.querySelector('[contenteditable]');
      if (content) {
        const text = content.textContent || '';
        if (text.toLowerCase().includes(query.toLowerCase())) {
          // Simple highlight - in a real app you'd want more sophisticated highlighting
          console.log(`Found "${query}" in note`);
        }
      }
    }
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    return date.toLocaleDateString();
  };

  const toolbarButtons = [
    // Basic formatting group
    {
      command: 'bold',
      icon: Bold,
      title: 'Bold',
      key: 'bold',
      group: 'basic'
    },
    {
      command: 'italic',
      icon: Italic,
      title: 'Italic',
      key: 'italic',
      group: 'basic'
    },
    {
      command: 'underline',
      icon: Underline,
      title: 'Underline',
      key: 'underline',
      group: 'basic'
    },
    {
      command: 'strikethrough',
      icon: Strikethrough,
      title: 'Strikethrough',
      key: 'strikethrough',
      group: 'basic'
    },
    // Lists and structure group
    {
      command: 'insertUnorderedList',
      icon: List,
      title: 'Bullet List',
      key: 'unordered',
      group: 'structure'
    },
    {
      command: 'insertOrderedList',
      icon: ListOrdered,
      title: 'Numbered List',
      key: 'ordered',
      group: 'structure'
    },
    {
      command: 'insertHTML',
      icon: CheckSquare,
      title: 'Checklist',
      key: 'checklist',
      value: '<input type="checkbox"> ',
      group: 'structure'
    },
    {
      command: 'formatBlock',
      icon: Heading,
      title: 'Heading',
      key: 'heading',
      value: 'h2',
      group: 'structure'
    },
    // Actions group
    {
      command: 'undo',
      icon: Undo,
      title: 'Undo',
      key: 'undo',
      group: 'action'
    },
    {
      command: 'redo',
      icon: Redo,
      title: 'Redo',
      key: 'redo',
      group: 'action'
    }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 z-50 animate-fade-in">
      {/* Compact Toolbar */}
      <div className="bg-gray-900 border-b border-gray-700 py-2 px-4" style={{ backgroundColor: '#111111' }}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left Section - Close + Formatting */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClose}
              className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 shadow p-1.5 rounded-md text-gray-300 transition-all duration-200"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Text Formatting Buttons */}
            <div className="flex items-center space-x-1">
              {toolbarButtons.map((button, index) => {
                const Icon = button.icon;
                const isActive = activeFormats.has(button.key);
                const prevButton = toolbarButtons[index - 1];
                const showSeparator = prevButton && prevButton.group !== button.group;
                
                return (
                  <div key={button.command} className="flex items-center">
                    {showSeparator && <div className="w-px h-4 bg-gray-600 mx-2" />}
                    <button
                      type="button"
                      onClick={() => executeCommand(button.command, button.value)}
                      className={cn(
                        "backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 shadow p-1.5 rounded-md transition-all duration-200 text-gray-300",
                        isActive && "bg-teal-100 border-teal-300 text-gray-900"
                      )}
                      title={button.title}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Section - Search Bar */}
          <div className="flex-1 max-w-md mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInNote(e.target.value)}
                placeholder="Search in note or tags"
                className="w-full pl-10 pr-4 py-1.5 text-sm backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 shadow rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 placeholder-gray-400 text-gray-300 search-animate-border"
              />
            </div>
          </div>
          
          {/* Right Section - AI Assist + Actions */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowAIDropdown(!showAIDropdown)}
                className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 shadow px-3 py-1.5 rounded-md text-purple-400 transition-all duration-200 flex items-center space-x-1"
                title="AI Assist"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">AI Assist</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>
              
              {showAIDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-20 min-w-48">
                  <button
                    onClick={() => handleAIAssist('Summarize')}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                  >
                    Summarize
                  </button>
                  <button
                    onClick={() => handleAIAssist('Rewrite')}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                  >
                    Rewrite
                  </button>
                  <button
                    onClick={() => handleAIAssist('Expand')}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                  >
                    Expand
                  </button>
                  <button
                    onClick={() => handleAIAssist('Translate')}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                  >
                    Translate
                  </button>
                  <button
                    onClick={() => handleAIAssist('Smart Tagging')}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                  >
                    Smart Tagging
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={handleAIInfo}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-50 text-sm flex items-center"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    Info
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={handleShare}
              className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 shadow p-1.5 rounded-md text-blue-400 transition-all duration-200"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            
            {id && (
              <button
                onClick={handleDelete}
                className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 shadow p-1.5 rounded-md text-red-400 transition-all duration-200"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto p-8 flex flex-col">
          {/* Note Header with Title and Tags */}
          <div className="flex items-start justify-between mb-8">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="flex-1 text-4xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-400 focus:placeholder-gray-300 mr-4"
              placeholder="Your Note"
              autoFocus
            />
            
            {/* Tags Section */}
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag, index) => (
                <span
                  key={tag}
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border shadow-sm",
                    tagColors[index % tagColors.length]
                  )}
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-red-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
              
              {showTagInput ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    onBlur={() => {
                      if (newTag.trim()) handleAddTag();
                      else setShowTagInput(false);
                    }}
                    className="px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-teal-400"
                    placeholder="Add tag"
                    autoFocus
                  />
                </div>
              ) : (
                <button
                  onClick={() => setShowTagInput(true)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md bg-gray-100 hover:bg-gray-200 border border-gray-300 shadow-sm transition-colors"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add tag
                </button>
              )}
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="flex-1 overflow-hidden">
            <RichTextEditor
              content={content}
              onChange={handleContentChange}
              onFormatChange={setActiveFormats}
            />
          </div>

          {/* Last Edited Time */}
          <div className="mt-4 text-sm text-gray-500 text-center">
            {hasUnsavedChanges ? (
              <span className="text-orange-600">• Auto-saving...</span>
            ) : (
              <span>Last saved: {formatLastSaved(lastSaved)}</span>
            )}
          </div>
        </div>
      </div>

      {/* AI Info Modal */}
      {showAIInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-lg p-6 max-w-md w-full text-white">
            <h3 className="text-xl font-semibold mb-4">AI Assist Features</h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium">Summarize</h4>
                <p className="text-gray-300">Create a concise summary of your note content</p>
              </div>
              <div>
                <h4 className="font-medium">Rewrite</h4>
                <p className="text-gray-300">Improve clarity and style of your text</p>
              </div>
              <div>
                <h4 className="font-medium">Expand</h4>
                <p className="text-gray-300">Add more detail and depth to your ideas</p>
              </div>
              <div>
                <h4 className="font-medium">Translate</h4>
                <p className="text-gray-300">Convert your text to different languages</p>
              </div>
              <div>
                <h4 className="font-medium">Smart Tagging</h4>
                <p className="text-gray-300">Automatically suggest relevant tags for your note</p>
              </div>
            </div>
            <button
              onClick={() => setShowAIInfoModal(false)}
              className="mt-6 w-full backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 shadow px-4 py-2 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
