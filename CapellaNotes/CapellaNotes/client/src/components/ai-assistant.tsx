import { useState } from "react";
import { X } from "lucide-react";

export default function AIAssistant() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <>
      {/* AI Assistant Button */}
      <button
        onClick={handleOpenModal}
        className="glass-button px-4 py-2 rounded-sm text-black font-medium flex items-center space-x-2 hover:shadow-lg transition-all duration-200"
      >
        <span>AI Assist</span>
      </button>

      {/* AI Assistant Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleModalBackdropClick}
        >
          <div className="glass-card rounded-xl p-8 max-w-md mx-4 animate-slide-up relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Suggestions</h3>
              <p className="text-gray-600 mb-6">AI-powered writing assistance coming soon! This feature will help you:</p>
              <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
                <li>• Improve writing clarity and tone</li>
                <li>• Generate creative content ideas</li>
                <li>• Fix grammar and style issues</li>
                <li>• Summarize and organize long notes</li>
                <li>• Smart formatting suggestions</li>
              </ul>
              <button
                onClick={handleCloseModal}
                className="glass-button px-6 py-2 rounded-sm text-black font-medium"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
