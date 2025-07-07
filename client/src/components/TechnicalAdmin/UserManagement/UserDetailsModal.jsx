import React from "react";
import { createPortal } from "react-dom";
import {
  X,
  User,
  Mail,
  Shield,
  Calendar,
  Hash,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";

const UserDetailsModal = ({ user, isOpen, onClose }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen || !user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleDisplayName = (role) => {
    return role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getStatusBadge = (validity) => {
    return validity ? (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isDarkMode
            ? "bg-green-900/30 text-green-200 border border-green-700/50"
            : "bg-green-50 text-green-700 border border-green-200"
        }`}
      >
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    ) : (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isDarkMode
            ? "bg-red-900/30 text-red-200 border border-red-700/50"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}
      >
        <XCircle className="w-3 h-3 mr-1" />
        Blocked
      </span>
    );
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div
        className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-xl"
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
            <div
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "bg-purple-900/30 border border-purple-700/50"
                  : "bg-purple-50 border border-purple-200"
              }`}
            >
              <User
                className={`w-5 h-5 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">User Details</h2>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {user.first_name} {user.last_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Basic Information */}
          <div>
            <h3
              className={`text-md font-medium mb-3 flex items-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <User
                className={`w-4 h-4 mr-2 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                className={`p-3 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600/50"
                    : "bg-gray-50/50 border border-gray-200/50"
                }`}
              >
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  User ID
                </label>
                <p
                  className={`text-sm font-mono ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.user_id}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600/50"
                    : "bg-gray-50/50 border border-gray-200/50"
                }`}
              >
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Identity Number
                </label>
                <p
                  className={`text-sm font-mono ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.identity_number || "Not assigned"}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600/50"
                    : "bg-gray-50/50 border border-gray-200/50"
                }`}
              >
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  First Name
                </label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.first_name}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600/50"
                    : "bg-gray-50/50 border border-gray-200/50"
                }`}
              >
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Last Name
                </label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.last_name}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3
              className={`text-md font-medium mb-3 flex items-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Mail
                className={`w-4 h-4 mr-2 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                className={`p-3 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600/50"
                    : "bg-gray-50/50 border border-gray-200/50"
                }`}
              >
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email Address
                </label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.email}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600/50"
                    : "bg-gray-50/50 border border-gray-200/50"
                }`}
              >
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Phone Number
                </label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.phone_number || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h3
              className={`text-md font-medium mb-3 flex items-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Shield
                className={`w-4 h-4 mr-2 ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              />
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                className={`p-3 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600/50"
                    : "bg-gray-50/50 border border-gray-200/50"
                }`}
              >
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Role
                </label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {getRoleDisplayName(user.role)}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600/50"
                    : "bg-gray-50/50 border border-gray-200/50"
                }`}
              >
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Status
                </label>
                <div className="mt-1">{getStatusBadge(user.validity)}</div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div>
            <h3
              className={`text-md font-medium mb-3 flex items-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Calendar
                className={`w-4 h-4 mr-2 ${
                  isDarkMode ? "text-orange-400" : "text-orange-600"
                }`}
              />
              Timestamps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                className={`p-3 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600/50"
                    : "bg-gray-50/50 border border-gray-200/50"
                }`}
              >
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Created At
                </label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {formatDate(user.created_at)}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600/50"
                    : "bg-gray-50/50 border border-gray-200/50"
                }`}
              >
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Last Updated
                </label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {formatDate(user.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default UserDetailsModal;
