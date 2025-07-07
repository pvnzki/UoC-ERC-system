import React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, LogIn } from "lucide-react";
import { useTheme } from "../../context/theme/ThemeContext";

const SessionExpiredModal = ({ isOpen, onRedirectToLogin }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
      <div
        className="max-w-md w-full mx-4 rounded-xl"
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(31, 41, 55, 0.7), rgba(55, 65, 81, 0.7))"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(249, 250, 251, 0.7))",
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
          border: isDarkMode
            ? "1px solid rgba(75, 85, 99, 0.2)"
            : "1px solid rgba(229, 231, 235, 0.3)",
          boxShadow: isDarkMode
            ? "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)"
            : "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? "border-gray-700/50" : "border-gray-200/50"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDarkMode ? "bg-yellow-900/30 border border-yellow-700/50" : "bg-yellow-50 border border-yellow-200"
            }`}>
              <AlertTriangle className={`w-6 h-6 ${
                isDarkMode ? "text-yellow-400" : "text-yellow-600"
              }`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Session Expired
              </h2>
              <p className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Your session has ended
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="mb-4">
              <AlertTriangle className={`w-16 h-16 mx-auto mb-4 ${
                isDarkMode ? "text-yellow-400" : "text-yellow-500"
              }`} />
              <h3 className={`text-lg font-medium mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Your session has expired
              </h3>
              <p className={`mb-6 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                For your security, you have been automatically logged out.
                Please log in again to continue.
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={onRedirectToLogin}
                className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Log In Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default SessionExpiredModal;
