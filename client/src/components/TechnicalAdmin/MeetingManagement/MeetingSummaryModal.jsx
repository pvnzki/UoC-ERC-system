import React from "react";
import {
  X,
  FileText,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";

const MeetingSummaryModal = ({ isOpen, onClose, summary }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen || !summary) return null;

  const getDecisionColor = (decision) => {
    switch (decision) {
      case "APPROVED":
        return isDarkMode ? "text-green-400" : "text-green-600";
      case "REJECTED":
        return isDarkMode ? "text-red-400" : "text-red-600";
      case "REVISE":
        return isDarkMode ? "text-yellow-300" : "text-yellow-600";
      case "PENDING":
        return isDarkMode ? "text-gray-300" : "text-gray-600";
      default:
        return isDarkMode ? "text-gray-300" : "text-gray-600";
    }
  };

  const getDecisionIcon = (decision) => {
    switch (decision) {
      case "APPROVED":
        return (
          <CheckCircle
            size={16}
            className={isDarkMode ? "text-green-400" : "text-green-600"}
          />
        );
      case "REJECTED":
        return (
          <XCircle
            size={16}
            className={isDarkMode ? "text-red-400" : "text-red-600"}
          />
        );
      case "REVISE":
        return (
          <RefreshCw
            size={16}
            className={isDarkMode ? "text-yellow-300" : "text-yellow-600"}
          />
        );
      default:
        return (
          <FileText
            size={16}
            className={isDarkMode ? "text-gray-300" : "text-gray-600"}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Meeting Summary
          </h2>
          <button
            onClick={onClose}
            className={`transition-colors rounded p-1 ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Meeting Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center space-x-3">
            <Users
              className={isDarkMode ? "text-gray-400" : "text-gray-400"}
              size={20}
            />
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Committee
              </p>
              <p
                className={`font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {summary.committeeName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar
              className={isDarkMode ? "text-gray-400" : "text-gray-400"}
              size={20}
            />
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Meeting Date
              </p>
              <p
                className={`font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {new Date(summary.meetingDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FileText
              className={isDarkMode ? "text-gray-400" : "text-gray-400"}
              size={20}
            />
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Total Applications
              </p>
              <p
                className={`font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {summary.totalApplications}
              </p>
            </div>
          </div>
        </div>

        {/* Decision Summary */}
        <div
          className={`rounded-lg p-4 mb-6 ${
            isDarkMode ? "bg-gray-700" : "bg-gray-50"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-3 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Decision Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                {summary.decisions.APPROVED || 0}
              </div>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Approved
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-red-400" : "text-red-600"
                }`}
              >
                {summary.decisions.REJECTED || 0}
              </div>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Rejected
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-yellow-300" : "text-yellow-600"
                }`}
              >
                {summary.decisions.REVISE || 0}
              </div>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Revise
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {summary.decisions.PENDING || 0}
              </div>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Pending
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Applications
          </h3>
          {summary.applications.length === 0 ? (
            <p
              className={`text-center py-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No applications for this meeting
            </p>
          ) : (
            <div className="space-y-3">
              {summary.applications.map((app) => (
                <div
                  key={app.applicationId}
                  className={`border rounded-lg p-4 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getDecisionIcon(app.decision)}
                        <h4
                          className={`font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Application #{app.applicationId}
                        </h4>
                      </div>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <span className="font-medium">Applicant:</span>{" "}
                        {app.applicantName}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <span className="font-medium">Research Type:</span>{" "}
                        {app.researchType}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <span className="font-medium">Application Type:</span>{" "}
                        {app.applicationType}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-semibold ${getDecisionColor(
                          app.decision
                        )}`}
                      >
                        {app.decision}
                      </span>
                      {app.ratified && (
                        <div
                          className={`text-xs mt-1 ${
                            isDarkMode ? "text-green-400" : "text-green-600"
                          }`}
                        >
                          ✓ Ratified
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className={`flex justify-end mt-6 pt-6 border-t ${
            isDarkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
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

export default MeetingSummaryModal;
