import React from "react";
import { X, Download, FileText } from "lucide-react";

const LetterModal = ({ isOpen, onClose, letter, applicationId }) => {
  if (!isOpen || !letter) return null;

  const handleDownload = () => {
    // Create a blob from the letter content
    const blob = new Blob([letter], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `letter_application_${applicationId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">
              Letter for Application #{applicationId}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Letter Content */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
              {letter}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Download PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LetterModal;
