import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Shield,
  Calendar,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../../../assets/default-profile.png";
import { useAuth } from "../../../../context/auth/AuthContext";
import { useTheme } from "../../../context/theme/ThemeContext";

const UserProfileModal = ({ isOpen, onClose, user }) => {
  const { logout } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  if (!isOpen) return null;

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    onClose();
    setShowLogoutConfirmation(false);
    navigate("/login");
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  const formatRole = (role) => {
    if (!role) return "Guest";

    return role
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Helper function to get user display name
  const getUserDisplayName = () => {
    const firstName = user?.first_name || user?.firstName || "N/A";
    const lastName = user?.last_name || user?.lastName || "N/A";
    return `${firstName} ${lastName}`.trim() || "N/A";
  };

  // Helper function to get user ID
  const getUserID = () => {
    return user?.user_id || user?.id || "N/A";
  };

  // Helper function to get user email
  const getUserEmail = () => {
    return user?.email || "N/A";
  };

  // Helper function to get user role
  const getUserRole = () => {
    return user?.role || "N/A";
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div
        className="max-w-sm w-full mx-4 p-4 rounded-xl"
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
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Profile Details
          </h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-105 ${
              isDarkMode
                ? "text-gray-300 hover:text-white hover:bg-white/10"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          <div className="relative">
          <img
            src={user?.profile_pic || defaultProfile}
            alt="User Profile"
              className="h-16 w-16 rounded-full object-cover transition-all duration-500 hover:scale-105"
              style={{
                border: isDarkMode
                  ? "2px solid rgba(255, 255, 255, 0.15)"
                  : "2px solid rgba(229, 231, 235, 0.4)",
                boxShadow: isDarkMode
                  ? "0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)"
                  : "0 4px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)",
              }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultProfile;
            }}
          />
          </div>
        </div>

        {/* User Information */}
        <div className="space-y-2">
          {/* Name */}
          <div
            className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:scale-[1.01] ${
              isDarkMode
                ? "bg-white/3 hover:bg-white/8 border border-white/5"
                : "bg-gray-50/30 hover:bg-gray-100/40 border border-gray-200/30"
            }`}
          >
            <div
              className={`p-1.5 rounded-md ${
                isDarkMode ? "bg-white/8" : "bg-blue-50/60"
              }`}
            >
              <User
                className={`${isDarkMode ? "text-blue-300" : "text-blue-500"}`}
                size={14}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Full Name
              </p>
              <p
                className={`font-medium text-sm truncate ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {getUserDisplayName()}
              </p>
            </div>
          </div>

          {/* Email */}
          <div
            className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:scale-[1.01] ${
              isDarkMode
                ? "bg-white/3 hover:bg-white/8 border border-white/5"
                : "bg-gray-50/30 hover:bg-gray-100/40 border border-gray-200/30"
            }`}
          >
            <div
              className={`p-1.5 rounded-md ${
                isDarkMode ? "bg-white/8" : "bg-green-50/60"
              }`}
            >
              <Mail
                className={`${
                  isDarkMode ? "text-green-300" : "text-green-500"
                }`}
                size={14}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Email Address
              </p>
              <p
                className={`font-medium text-sm truncate ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {getUserEmail()}
              </p>
            </div>
          </div>

          {/* Role */}
          <div
            className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:scale-[1.01] ${
              isDarkMode
                ? "bg-white/3 hover:bg-white/8 border border-white/5"
                : "bg-gray-50/30 hover:bg-gray-100/40 border border-gray-200/30"
            }`}
          >
            <div
              className={`p-1.5 rounded-md ${
                isDarkMode ? "bg-white/8" : "bg-purple-50/60"
              }`}
            >
              <Shield
                className={`${
                  isDarkMode ? "text-purple-300" : "text-purple-500"
                }`}
                size={14}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Role
              </p>
              <p
                className={`font-medium text-sm truncate ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {formatRole(getUserRole())}
              </p>
            </div>
          </div>

          {/* User ID */}
          <div
            className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:scale-[1.01] ${
              isDarkMode
                ? "bg-white/3 hover:bg-white/8 border border-white/5"
                : "bg-gray-50/30 hover:bg-gray-100/40 border border-gray-200/30"
            }`}
          >
            <div
              className={`p-1.5 rounded-md ${
                isDarkMode ? "bg-white/8" : "bg-orange-50/60"
              }`}
            >
              <User
                className={`${
                  isDarkMode ? "text-orange-300" : "text-orange-500"
                }`}
                size={14}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                User ID
              </p>
              <p
                className={`font-medium text-sm truncate ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {getUserID()}
              </p>
            </div>
          </div>

          {/* Additional Info based on role */}
          {user?.applicant_id && (
            <div
              className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:scale-[1.01] ${
                isDarkMode
                  ? "bg-white/3 hover:bg-white/8 border border-white/5"
                  : "bg-gray-50/30 hover:bg-gray-100/40 border border-gray-200/30"
              }`}
            >
              <div
                className={`p-1.5 rounded-md ${
                  isDarkMode ? "bg-white/8" : "bg-indigo-50/60"
                }`}
              >
                <User
                  className={`${
                    isDarkMode ? "text-indigo-300" : "text-indigo-500"
                  }`}
                  size={14}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Applicant ID
                </p>
                <p
                  className={`font-medium text-sm truncate ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {user.applicant_id}
                </p>
              </div>
            </div>
          )}

          {user?.member_id && (
            <div
              className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:scale-[1.01] ${
                isDarkMode
                  ? "bg-white/3 hover:bg-white/8 border border-white/5"
                  : "bg-gray-50/30 hover:bg-gray-100/40 border border-gray-200/30"
              }`}
            >
              <div
                className={`p-1.5 rounded-md ${
                  isDarkMode ? "bg-white/8" : "bg-teal-50/60"
                }`}
              >
                <User
                  className={`${
                    isDarkMode ? "text-teal-300" : "text-teal-500"
                  }`}
                  size={14}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Member ID
                </p>
                <p
                  className={`font-medium text-sm truncate ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {user.member_id}
                </p>
              </div>
            </div>
          )}

          {user?.committee_id && (
            <div
              className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:scale-[1.01] ${
                isDarkMode
                  ? "bg-white/3 hover:bg-white/8 border border-white/5"
                  : "bg-gray-50/30 hover:bg-gray-100/40 border border-gray-200/30"
              }`}
            >
              <div
                className={`p-1.5 rounded-md ${
                  isDarkMode ? "bg-white/8" : "bg-pink-50/60"
                }`}
              >
                <User
                  className={`${
                    isDarkMode ? "text-pink-300" : "text-pink-500"
                  }`}
                  size={14}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Committee ID
                </p>
                <p
                  className={`font-medium text-sm truncate ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {user.committee_id}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <button
            onClick={handleLogoutClick}
            className="w-full px-3 py-2 rounded-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center text-sm font-medium"
            style={{
              background: isDarkMode
                ? "linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))"
                : "linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow:
                "0 2px 8px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <LogOut size={14} className="mr-2 text-white" />
            <span className="text-white">Logout</span>
          </button>
          <div className="flex justify-between gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-[1.02] text-sm font-medium"
              style={{
                background: isDarkMode
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: isDarkMode
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(229, 231, 235, 0.4)",
                boxShadow: isDarkMode
                  ? "0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                  : "0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              <span className={isDarkMode ? "text-white" : "text-gray-700"}>
              Close
              </span>
            </button>
          </div>
        </div>

        {/* Logout Confirmation Dialog */}
        {showLogoutConfirmation && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-60 p-4">
            <div
              className="max-w-xs w-full mx-4 p-4 rounded-xl"
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
              <div className="flex items-center mb-3">
                <div
                  className={`p-1.5 rounded-md mr-2 ${
                    isDarkMode ? "bg-yellow-500/20" : "bg-yellow-100/60"
                  }`}
                >
                  <AlertTriangle className="text-yellow-500" size={18} />
                </div>
                <h3
                  className={`text-base font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Confirm Logout
                </h3>
              </div>
              <p
                className={`mb-4 text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Are you sure you want to logout? You will be redirected to the
                login page.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleLogoutCancel}
                  className="px-3 py-2 rounded-lg transition-all duration-300 hover:scale-[1.02] text-sm font-medium"
                  style={{
                    background: isDarkMode
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: isDarkMode
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "1px solid rgba(229, 231, 235, 0.4)",
                    boxShadow: isDarkMode
                      ? "0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                      : "0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <span className={isDarkMode ? "text-white" : "text-gray-700"}>
                  Cancel
                  </span>
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="px-3 py-2 rounded-lg transition-all duration-300 hover:scale-[1.02] flex items-center text-sm font-medium"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow:
                      "0 2px 8px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <LogOut size={14} className="mr-2 text-white" />
                  <span className="text-white">Yes, Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;
