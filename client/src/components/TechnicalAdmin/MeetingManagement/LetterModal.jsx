import React from "react";
import { X, Download, Mail } from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";

const LetterModal = ({ isOpen, onClose, letter, applicationId }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen || !letter) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`max-w-4xl w-full mx-4 rounded-lg shadow-xl ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`flex justify-between items-center p-6 border-b ${
            isDarkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <Mail
              className={isDarkMode ? "text-blue-400" : "text-blue-600"}
              size={24}
            />
            <h2
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Letter for Application #{applicationId}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`transition-colors rounded p-1 ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div
            className={`border rounded-lg p-4 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <pre
              className={`whitespace-pre-wrap font-sans text-sm ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {letter}
            </pre>
          </div>
        </div>

        <div
          className={`flex justify-end space-x-3 p-6 border-t ${
            isDarkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <button
            onClick={() => {
              // Download functionality
              const blob = new Blob([letter], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `letter-application-${applicationId}.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              isDarkMode
                ? "bg-green-700 text-white hover:bg-green-800"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <Download size={16} />
            <span>Download</span>
          </button>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md transition-colors ${
              isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LetterModal;
