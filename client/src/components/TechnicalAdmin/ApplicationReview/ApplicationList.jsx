// src/components/TechnicalAdmin/ApplicationReview/ApplicationList.jsx
import React from "react";
import { FileText, Eye, Calendar, User, Hash } from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";

const ApplicationList = ({ applications, onViewApplication }) => {
  const { isDarkMode } = useTheme();

  const statusColors = {
    SUBMITTED: isDarkMode
      ? "bg-blue-900/30 text-blue-200 border-blue-700/50"
      : "bg-blue-50 text-blue-700 border-blue-200",
    DOCUMENT_CHECK: isDarkMode
      ? "bg-yellow-900/30 text-yellow-200 border-yellow-700/50"
      : "bg-yellow-50 text-yellow-700 border-yellow-200",
    PRELIMINARY_REVIEW: isDarkMode
      ? "bg-purple-900/30 text-purple-200 border-purple-700/50"
      : "bg-purple-50 text-purple-700 border-purple-200",
    ERC_REVIEW: isDarkMode
      ? "bg-indigo-900/30 text-indigo-200 border-indigo-700/50"
      : "bg-indigo-50 text-indigo-700 border-indigo-200",
    APPROVED: isDarkMode
      ? "bg-green-900/30 text-green-200 border-green-700/50"
      : "bg-green-50 text-green-700 border-green-200",
    REJECTED: isDarkMode
      ? "bg-red-900/30 text-red-200 border-red-700/50"
      : "bg-red-50 text-red-700 border-red-200",
    DRAFT: isDarkMode
      ? "bg-gray-700/30 text-gray-200 border-gray-600/50"
      : "bg-gray-50 text-gray-700 border-gray-200",
  };

  const getStatusBadge = (status) => {
    return `px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
      statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200"
    }`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Debug: Log the first application to see the data structure
  if (applications.length > 0) {
    console.log("First application data:", applications[0]);
    console.log("Applicant data:", applications[0].applicant);
  }

  return (
    <div
      className={`rounded-lg backdrop-blur-xl border shadow-lg overflow-hidden ${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700/50"
          : "bg-white/70 border-gray-200/50"
      }`}
    >
      {applications.length === 0 ? (
        <div className="text-center py-12">
          <FileText
            size={32}
            className={`mx-auto mb-3 ${
              isDarkMode ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No applications found
          </p>
        </div>
      ) : (
        <div className="space-y-2 p-4">
          {applications.map((app) => (
            <div
              key={app.application_id}
              className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md hover:scale-[1.01] ${
                isDarkMode
                  ? "bg-gray-700/30 border-gray-600/50 hover:border-gray-500/50 hover:bg-gray-700/40"
                  : "bg-gray-50/50 border-gray-200/50 hover:border-gray-300/50 hover:bg-gray-50/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-lg ${
                      isDarkMode ? "bg-gray-600/50" : "bg-gray-100/50"
                    }`}
                  >
                    <FileText
                      size={20}
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Hash
                          size={14}
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        />
                        <span
                          className={`font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          #{app.application_id}
                        </span>
                      </div>
                      <span className={getStatusBadge(app.status)}>
                        {app.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <User
                          size={14}
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        />
                        <span
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }
                        >
                          {app.applicant?.first_name} {app.applicant?.last_name}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <FileText
                          size={14}
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        />
                        <span
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }
                        >
                          {app.research_type}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Calendar
                          size={14}
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        />
                        <span
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }
                        >
                          {formatDate(app.submission_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onViewApplication(app.application_id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isDarkMode
                      ? "bg-blue-600/80 hover:bg-blue-500/80 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  } shadow-md hover:shadow-lg`}
                >
                  <Eye size={14} />
                  <span className="text-sm">View</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationList;
