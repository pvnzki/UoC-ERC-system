import React, { useState } from "react";
import { X, User, Mail, LogOut } from "lucide-react";
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

  const getUserDisplayName = () => {
    const firstName = user?.first_name || user?.firstName || "N/A";
    const lastName = user?.last_name || user?.lastName || "N/A";
    return `${firstName} ${lastName}`.trim() || "N/A";
  };

  const getUserEmail = () => {
    return user?.email || "N/A";
  };

  const getUserRole = () => {
    if (!user?.role) return "N/A";
    return user.role
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
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
                Email
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
              <LogOut
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
                {getUserRole()}
              </p>
            </div>
          </div>
        </div>
        {/* Logout Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleLogoutClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400/40 ${
              isDarkMode
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
        {/* Logout Confirmation Modal */}
        {showLogoutConfirmation && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div
              className="max-w-xs w-full mx-4 rounded-xl p-4"
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(55, 65, 81, 0.9))"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.95))",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: isDarkMode
                  ? "1px solid rgba(75, 85, 99, 0.2)"
                  : "1px solid rgba(229, 231, 235, 0.3)",
                boxShadow: isDarkMode
                  ? "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)"
                  : "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3
                  className={`text-base font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Confirm Logout
                </h3>
                <button
                  onClick={handleLogoutCancel}
                  className={`p-1.5 rounded-lg transition-all duration-300 ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
                  }`}
                >
                  <X size={16} />
                </button>
              </div>
              <div
                className={`text-sm mb-4 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Are you sure you want to logout? You will be redirected to the
                login page.
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleLogoutCancel}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-gray-200 hover:bg-gray-700/50"
                      : "text-gray-600 hover:text-gray-700 hover:bg-gray-100/50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  <LogOut size={16} />
                  Yes, Logout
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
