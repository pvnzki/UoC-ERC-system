import React from "react";
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
            ? "bg-green-900/50 text-green-200"
            : "bg-green-100 text-green-800"
        }`}
      >
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    ) : (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isDarkMode
            ? "bg-red-900/50 text-red-200"
            : "bg-red-100 text-red-800"
        }`}
      >
        <XCircle className="w-3 h-3 mr-1" />
        Blocked
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${
                isDarkMode ? "bg-blue-900/50" : "bg-blue-100"
              }`}
            >
              <User
                className={`w-6 h-6 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                User Details
              </h2>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Complete information for {user.first_name} {user.last_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3
              className={`text-lg font-medium mb-4 flex items-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <User
                className={`w-5 h-5 mr-2 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <label
                  className={`block text-sm font-medium mb-1 ${
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
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <label
                  className={`block text-sm font-medium mb-1 ${
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
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <label
                  className={`block text-sm font-medium mb-1 ${
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
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <label
                  className={`block text-sm font-medium mb-1 ${
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
              className={`text-lg font-medium mb-4 flex items-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Mail
                className={`w-5 h-5 mr-2 ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              />
              Contact Information
            </h3>
            <div
              className={`p-4 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <label
                className={`block text-sm font-medium mb-1 ${
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
          </div>

          {/* Account Information */}
          <div>
            <h3
              className={`text-lg font-medium mb-4 flex items-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Shield
                className={`w-5 h-5 mr-2 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <label
                  className={`block text-sm font-medium mb-1 ${
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
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Account Status
                </label>
                <div className="mt-1">{getStatusBadge(user.validity)}</div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div>
            <h3
              className={`text-lg font-medium mb-4 flex items-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Calendar
                className={`w-5 h-5 mr-2 ${
                  isDarkMode ? "text-orange-400" : "text-orange-600"
                }`}
              />
              Account Timestamps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <label
                  className={`block text-sm font-medium mb-1 ${
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
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <label
                  className={`block text-sm font-medium mb-1 ${
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

          {/* Additional Information */}
          {user.password && (
            <div>
              <h3
                className={`text-lg font-medium mb-4 flex items-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <Hash
                  className={`w-5 h-5 mr-2 ${
                    isDarkMode ? "text-red-400" : "text-red-600"
                  }`}
                />
                Security Information
              </h3>
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Password Status
                </label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Password is {user.password ? "set" : "not set"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex justify-end p-6 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md transition-colors ${
              isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
