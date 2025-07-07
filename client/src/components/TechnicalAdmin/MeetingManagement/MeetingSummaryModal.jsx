import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, FileText, Download, Eye, Calendar, Users, Clock } from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";

const MeetingSummaryModal = ({ isOpen, onClose, meetingData, committeeName }) => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!meetingData || !meetingData.summary_url) {
      console.error("No summary URL available");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(meetingData.summary_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `meeting_summary_${committeeName}_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading summary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = () => {
    if (meetingData && meetingData.summary_url) {
      window.open(meetingData.summary_url, "_blank");
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div
        className="max-w-3xl w-full mx-4 rounded-xl"
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
          className={`flex items-center justify-between p-4 border-b ${
            isDarkMode ? "border-gray-700/50" : "border-gray-200/50"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDarkMode ? "bg-green-900/30 border border-green-700/50" : "bg-green-50 border border-green-200"
            }`}>
              <FileText className={`w-5 h-5 ${
                isDarkMode ? "text-green-400" : "text-green-600"
              }`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Meeting Summary
              </h2>
              <p className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                {committeeName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {meetingData ? (
            <div className="space-y-4">
              {/* Meeting Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600/50"
                      : "bg-gray-50/50 border-gray-200/50"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className={`w-4 h-4 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`} />
                    <h3 className={`font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}>
                      Meeting Details
                    </h3>
                  </div>
                  <div className={`text-sm space-y-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}>
                    <p><strong>Date:</strong> {new Date(meetingData.meeting_date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(meetingData.meeting_date).toLocaleTimeString()}</p>
                    <p><strong>Status:</strong> {meetingData.status || "Completed"}</p>
                    <p><strong>Type:</strong> {meetingData.meeting_type || "Regular"}</p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600/50"
                      : "bg-gray-50/50 border-gray-200/50"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <Users className={`w-4 h-4 ${
                      isDarkMode ? "text-purple-400" : "text-purple-600"
                    }`} />
                    <h3 className={`font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}>
                      Attendance
                    </h3>
                  </div>
                  <div className={`text-sm space-y-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}>
                    <p><strong>Present:</strong> {meetingData.attendance?.present || 0} members</p>
                    <p><strong>Absent:</strong> {meetingData.attendance?.absent || 0} members</p>
                    <p><strong>Quorum:</strong> {meetingData.quorum_met ? "Met" : "Not Met"}</p>
                  </div>
                </div>
              </div>

              {/* Summary Details */}
              <div
                className={`p-4 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700/50 border-gray-600/50"
                    : "bg-gray-50/50 border-gray-200/50"
                }`}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className={`w-4 h-4 ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`} />
                  <h3 className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}>
                    Summary Details
                  </h3>
                </div>
                <div className={`text-sm space-y-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                  <p><strong>Generated:</strong> {new Date(meetingData.created_at).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {meetingData.summary_status || "Generated"}</p>
                  {meetingData.summary_url && (
                    <p><strong>File:</strong> Available for download</p>
                  )}
                  {meetingData.notes && (
                    <div>
                      <strong>Notes:</strong>
                      <p className="mt-1">{meetingData.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                {meetingData.summary_url && (
                  <>
                    <button
                      onClick={handleView}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                        isDarkMode
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                        isDarkMode
                          ? "bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-600"
                          : "bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      <span>{isLoading ? "Downloading..." : "Download"}</span>
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-gray-200 hover:bg-gray-700/50"
                      : "text-gray-600 hover:text-gray-700 hover:bg-gray-100/50"
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText
                className={`w-12 h-12 mx-auto mb-3 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <p className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                No meeting summary data available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default MeetingSummaryModal;
