import { useState, useRef, useEffect } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onFormatChange?: (formats: Set<string>) => void;
}

export default function RichTextEditor({ content, onChange, onFormatChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateActiveFormats();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const updateActiveFormats = () => {
    const formats = new Set<string>();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('insertUnorderedList')) formats.add('unordered');
    if (document.queryCommandState('insertOrderedList')) formats.add('ordered');
    
    setActiveFormats(formats);
    onFormatChange?.(formats);
  };

  const handleKeyUp = () => {
    updateActiveFormats();
  };

  const handleMouseUp = () => {
    updateActiveFormats();
  };

  const toolbarButtons = [
    {
      command: 'bold',
      icon: Bold,
      title: 'Bold',
      key: 'bold'
    },
    {
      command: 'italic',
      icon: Italic,
      title: 'Italic',
      key: 'italic'
    },
    {
      command: 'underline',
      icon: Underline,
      title: 'Underline',
      key: 'underline'
    },
    {
      command: 'insertUnorderedList',
      icon: List,
      title: 'Bullet List',
      key: 'unordered'
    },
    {
      command: 'insertOrderedList',
      icon: ListOrdered,
      title: 'Numbered List',
      key: 'ordered'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Text Editor - No toolbar here, moved to top bar */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
        className="flex-1 w-full p-6 text-gray-700 leading-relaxed bg-white/30 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-300 resize-none overflow-y-auto scrollbar-none note-editor-glow"
        style={{ minHeight: '400px', fontSize: '16px', lineHeight: '1.6' }}
        suppressContentEditableWarning={true}
      />
    </div>
  );
}
