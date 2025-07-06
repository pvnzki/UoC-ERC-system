import React from "react";
import { AlertTriangle, LogIn } from "lucide-react";

const SessionExpiredModal = ({ isOpen, onRedirectToLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Session Expired
              </h2>
              <p className="text-sm text-gray-500">Your session has ended</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="mb-4">
              <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your session has expired
              </h3>
              <p className="text-gray-600 mb-6">
                For your security, you have been automatically logged out.
                Please log in again to continue.
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={onRedirectToLogin}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
};

export default SessionExpiredModal;
