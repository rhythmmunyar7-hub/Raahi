import { useState } from "react";
import { useLocation } from "wouter";
import { Plus, Search } from "lucide-react";
import AIAssistant from "@/components/ai-assistant";

interface TopNavigationProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export default function TopNavigation({ onSearchChange, searchQuery: externalSearchQuery }: TopNavigationProps = {}) {
  const [, setLocation] = useLocation();
  const [internalSearchQuery, setInternalSearchQuery] = useState("");

  const searchQuery = externalSearchQuery ?? internalSearchQuery;

  const handleNewNote = () => {
    setLocation("/editor");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInternalSearchQuery(value);
    onSearchChange?.(value);
  };

  return (
    <nav className="sticky top-0 z-50 glass-effect shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: App Title */}
          <div className="flex items-center">
            <button
              onClick={() => setLocation("/")}
              className="text-xl font-bold text-gray-800 tracking-tight hover:text-teal-600 transition-colors"
            >
              NOTES
            </button>
          </div>
          
          {/* Center: Search Bar */}
          <div className="flex-1 flex justify-center mx-8">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 text-sm glass-effect rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder-gray-500"
              />
              <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Right: AI Assist and New Note Button */}
          <div className="flex items-center space-x-4">
            <AIAssistant />
            <button
              onClick={handleNewNote}
              className="glass-button px-6 py-2 rounded-sm text-black font-medium flex items-center space-x-2 hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Note</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
