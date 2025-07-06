// src/components/TechnicalAdmin/ApplicationReview/ApplicationList.jsx
import React from "react";
import { FileText } from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";

const ApplicationList = ({ applications, onViewApplication }) => {
  const { isDarkMode } = useTheme();

  const statusColors = {
    SUBMITTED: isDarkMode
      ? "bg-blue-800 text-blue-200"
      : "bg-blue-100 text-blue-600",
    DOCUMENT_CHECK: isDarkMode
      ? "bg-yellow-800 text-yellow-200"
      : "bg-yellow-100 text-yellow-600",
    PRELIMINARY_REVIEW: isDarkMode
      ? "bg-purple-800 text-purple-200"
      : "bg-purple-100 text-purple-600",
    ERC_REVIEW: isDarkMode
      ? "bg-indigo-800 text-indigo-200"
      : "bg-indigo-100 text-indigo-600",
    APPROVED: isDarkMode
      ? "bg-green-800 text-green-200"
      : "bg-green-100 text-green-600",
    REJECTED: isDarkMode
      ? "bg-red-800 text-red-200"
      : "bg-red-100 text-red-600",
    DRAFT: isDarkMode
      ? "bg-gray-600 text-gray-200"
      : "bg-gray-100 text-gray-800",
  };

  const getStatusBadge = (status) => {
    return `px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
      statusColors[status] || "bg-gray-100 text-gray-800"
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
      className={`shadow-md rounded-lg overflow-hidden ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
          <tr>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              ID
            </th>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Applicant ID
            </th>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Applicant
            </th>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Type
            </th>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Submitted
            </th>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Status
            </th>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody
          className={`divide-y ${
            isDarkMode
              ? "bg-gray-800 divide-gray-700"
              : "bg-white divide-gray-200"
          }`}
        >
          {applications.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className={`px-6 py-4 text-center ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No applications found.
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app.application_id}>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  #{app.application_id}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {app.applicant?.applicant_id || "N/A"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {app.applicant?.first_name} {app.applicant?.last_name}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {app.research_type}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {formatDate(app.submission_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(app.status)}>
                    {app.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  <button
                    onClick={() => onViewApplication(app.application_id)}
                    className={`flex items-center ${
                      isDarkMode
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    <FileText size={16} className="mr-1" /> View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationList;
