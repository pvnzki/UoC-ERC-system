import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";
import UserDetailsModal from "./UserDetailsModal";

const UserList = ({ users, onUpdateStatus, onDeleteUser, currentUser }) => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState({});

  const handleConfirmationShow = (actionType, userId) => {
    const user = users.find((u) => u.user_id === userId);
    if (!user) return;

    let details = {};
    switch (actionType) {
      case "block":
        details = {
          title: "Block User",
          message: `Are you sure you want to block ${user.first_name} ${user.last_name}? They will not be able to access the system.`,
          actionText: "Block User",
          buttonClass: "bg-red-600 hover:bg-red-700",
          icon: <XCircle className="w-6 h-6 text-red-600" />,
          action: () => onUpdateStatus(userId, "block"),
        };
        break;
      case "activate":
        details = {
          title: "Activate User",
          message: `Are you sure you want to activate ${user.first_name} ${user.last_name}? They will be able to access the system again.`,
          actionText: "Activate User",
          buttonClass: "bg-green-600 hover:bg-green-700",
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          action: () => onUpdateStatus(userId, "activate"),
        };
        break;
      case "delete":
        details = {
          title: "Delete User",
          message: `Are you sure you want to permanently delete ${user.first_name} ${user.last_name}? This action cannot be undone.`,
          actionText: "Delete User",
          buttonClass: "bg-red-600 hover:bg-red-700",
          icon: <Trash2 className="w-6 h-6 text-red-600" />,
          action: () => onDeleteUser(userId),
        };
        break;
      default:
        return;
    }
    setConfirmationDetails(details);
    setShowConfirmation(true);
  };

  const handleConfirmedAction = () => {
    confirmationDetails.action();
    setShowConfirmation(false);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterRole("");
    setFilterStatus("");
  };

  const handleCancelAction = () => {
    setShowConfirmation(false);
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleCloseUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
  };

  const getConfirmationMessage = () => {
    const activeFilters = [];
    if (searchQuery) activeFilters.push(`Search: "${searchQuery}"`);
    if (filterRole) activeFilters.push(`Role: ${filterRole}`);
    if (filterStatus) activeFilters.push(`Status: ${filterStatus}`);

    if (activeFilters.length === 0) return null;

    return (
      <div
        className={`mb-4 p-3 rounded-lg ${
          isDarkMode
            ? "bg-blue-900/20 border border-blue-700/30"
            : "bg-blue-50/80 border border-blue-200/50"
        }`}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Search
              className={`h-4 w-4 ${
                isDarkMode ? "text-blue-400" : "text-blue-500"
              }`}
            />
          </div>
          <div className="ml-2">
            <p
              className={`text-sm font-medium ${
                isDarkMode ? "text-blue-300" : "text-blue-800"
              }`}
            >
              Active Filters: {activeFilters.join(", ")}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const hasActiveFilters = searchQuery || filterRole || filterStatus;

  // Get unique roles for filter dropdown
  const uniqueRoles = [...new Set(users.map((user) => user.role))].sort();

  // Filter users based on search query and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_id.toString().includes(searchQuery);

    const matchesRole = filterRole === "" || user.role === filterRole;

    const matchesStatus =
      filterStatus === "" ||
      (filterStatus === "active" && user.validity) ||
      (filterStatus === "blocked" && !user.validity);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const Tooltip = ({ children, label }) => {
    return (
      <div className="relative group">
        {children}
        <div
          className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-gray-900 text-white border-gray-600"
          }`}
          style={{
            boxShadow: isDarkMode
              ? "0 4px 16px 0 rgba(0,0,0,0.45)"
              : "0 4px 16px 0 rgba(0,0,0,0.18)",
          }}
        >
          {label}
          <div
            className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
              isDarkMode ? "border-t-gray-800" : "border-t-gray-900"
            }`}
            style={{ zIndex: 51 }}
          ></div>
        </div>
      </div>
    );
  };

  const renderUserCard = (user) => {
    const isCurrentUser = currentUser && currentUser.user_id === user.user_id;

    return (
      <div
        key={user.user_id}
        className={`p-4 rounded-lg transition-all duration-300 hover:scale-[1.01] ${
          isDarkMode
            ? "bg-gray-700/50 border border-gray-600/50 hover:bg-gray-600/50"
            : "bg-gray-50/50 border border-gray-200/50 hover:bg-gray-100/50"
        } shadow-md hover:shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
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

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3
                  className={`font-semibold truncate ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.first_name} {user.last_name}
                </h3>
                {isCurrentUser && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isDarkMode
                        ? "bg-blue-900/30 text-blue-200 border border-blue-700/50"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    You
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1">
                  <Mail
                    className={`w-3 h-3 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm truncate ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {user.email}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <Shield
                    className={`w-3 h-3 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {user.role.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <Calendar
                    className={`w-3 h-3 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.validity
                  ? isDarkMode
                    ? "bg-green-900/30 text-green-200 border border-green-700/50"
                    : "bg-green-50 text-green-700 border border-green-200"
                  : isDarkMode
                  ? "bg-red-900/30 text-red-200 border border-red-700/50"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {user.validity ? "Active" : "Blocked"}
            </span>

            {/* Glassmorphic Icon Buttons with animated circular glow */}
            <Tooltip label="View Details">
              <button
                onClick={() => handleViewUserDetails(user)}
                className="group p-0 m-0 bg-transparent border-none outline-none focus:outline-none"
                style={{ boxShadow: "none" }}
                aria-label="View Details"
              >
                <span
                  className={`flex items-center justify-center rounded-full transition-all duration-300 w-9 h-9 relative overflow-visible`}
                  style={{
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-full pointer-events-none z-0"
                    style={{
                      transition: "box-shadow 0.3s, opacity 0.3s",
                      boxShadow: "none",
                      opacity: 0,
                    }}
                  ></span>
                  <Eye
                    className={`w-5 h-5 z-10 transition-all duration-300 group-hover:scale-110 ${
                      isDarkMode ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                  <span
                    className="absolute inset-0 rounded-full pointer-events-none z-0 transition-all duration-300"
                    style={{
                      boxShadow: "0 0 0 0 rgba(59,130,246,0.0)",
                      opacity: 0,
                      transition: "box-shadow 0.3s, opacity 0.3s",
                    }}
                  />
                  <style>{`
                    .group:hover .z-10 {
                      filter: drop-shadow(0 0 8px rgba(59,130,246,0.45));
                    }
                    .group:hover .absolute.inset-0 {
                      box-shadow: 0 0 0 12px rgba(59,130,246,0.18);
                      opacity: 1;
                      transition: box-shadow 0.3s, opacity 0.3s;
                    }
                  `}</style>
                </span>
              </button>
            </Tooltip>

            {!isCurrentUser && (
              <>
                {user.validity ? (
                  <Tooltip label="Block User">
                    <button
                      onClick={() =>
                        handleConfirmationShow("block", user.user_id)
                      }
                      className="group p-0 m-0 bg-transparent border-none outline-none focus:outline-none"
                      style={{ boxShadow: "none" }}
                      aria-label="Block User"
                    >
                      <span
                        className={`flex items-center justify-center rounded-full transition-all duration-300 w-9 h-9 relative overflow-visible`}
                        style={{
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                        }}
                      >
                        <span
                          className="absolute inset-0 rounded-full pointer-events-none z-0"
                          style={{
                            transition: "box-shadow 0.3s, opacity 0.3s",
                            boxShadow: "none",
                            opacity: 0,
                          }}
                        ></span>
                        <XCircle
                          className={`w-5 h-5 z-10 transition-all duration-300 group-hover:scale-110 ${
                            isDarkMode ? "text-orange-400" : "text-orange-500"
                          }`}
                        />
                        <span
                          className="absolute inset-0 rounded-full pointer-events-none z-0 transition-all duration-300"
                          style={{
                            boxShadow: "0 0 0 0 rgba(251,146,60,0.0)",
                            opacity: 0,
                            transition: "box-shadow 0.3s, opacity 0.3s",
                          }}
                        />
                        <style>{`
                          .group:hover .z-10 {
                            filter: drop-shadow(0 0 8px rgba(251,146,60,0.45));
                          }
                          .group:hover .absolute.inset-0 {
                            box-shadow: 0 0 0 12px rgba(251,146,60,0.18);
                            opacity: 1;
                            transition: box-shadow 0.3s, opacity 0.3s;
                          }
                        `}</style>
                      </span>
                    </button>
                  </Tooltip>
                ) : (
                  <Tooltip label="Activate User">
                    <button
                      onClick={() =>
                        handleConfirmationShow("activate", user.user_id)
                      }
                      className="group p-0 m-0 bg-transparent border-none outline-none focus:outline-none"
                      style={{ boxShadow: "none" }}
                      aria-label="Activate User"
                    >
                      <span
                        className={`flex items-center justify-center rounded-full transition-all duration-300 w-9 h-9 relative overflow-visible`}
                        style={{
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                        }}
                      >
                        <span
                          className="absolute inset-0 rounded-full pointer-events-none z-0"
                          style={{
                            transition: "box-shadow 0.3s, opacity 0.3s",
                            boxShadow: "none",
                            opacity: 0,
                          }}
                        ></span>
                        <CheckCircle
                          className={`w-5 h-5 z-10 transition-all duration-300 group-hover:scale-110 ${
                            isDarkMode ? "text-green-400" : "text-green-600"
                          }`}
                        />
                        <span
                          className="absolute inset-0 rounded-full pointer-events-none z-0 transition-all duration-300"
                          style={{
                            boxShadow: "0 0 0 0 rgba(16,185,129,0.0)",
                            opacity: 0,
                            transition: "box-shadow 0.3s, opacity 0.3s",
                          }}
                        />
                        <style>{`
                          .group:hover .z-10 {
                            filter: drop-shadow(0 0 8px rgba(16,185,129,0.45));
                          }
                          .group:hover .absolute.inset-0 {
                            box-shadow: 0 0 0 12px rgba(16,185,129,0.18);
                            opacity: 1;
                            transition: box-shadow 0.3s, opacity 0.3s;
                          }
                        `}</style>
                      </span>
                    </button>
                  </Tooltip>
                )}

                <Tooltip label="Permanently Delete User">
                  <button
                    onClick={() =>
                      handleConfirmationShow("delete", user.user_id)
                    }
                    className="group p-0 m-0 bg-transparent border-none outline-none focus:outline-none"
                    style={{ boxShadow: "none" }}
                    aria-label="Delete User"
                  >
                    <span
                      className={`flex items-center justify-center rounded-full transition-all duration-300 w-9 h-9 relative overflow-visible`}
                      style={{
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                      }}
                    >
                      <span
                        className="absolute inset-0 rounded-full pointer-events-none z-0"
                        style={{
                          transition: "box-shadow 0.3s, opacity 0.3s",
                          boxShadow: "none",
                          opacity: 0,
                        }}
                      ></span>
                      <Trash2
                        className={`w-5 h-5 z-10 transition-all duration-300 group-hover:scale-110 ${
                          isDarkMode ? "text-red-400" : "text-red-600"
                        }`}
                      />
                      <span
                        className="absolute inset-0 rounded-full pointer-events-none z-0 transition-all duration-300"
                        style={{
                          boxShadow: "0 0 0 0 rgba(239,68,68,0.0)",
                          opacity: 0,
                          transition: "box-shadow 0.3s, opacity 0.3s",
                        }}
                      />
                      <style>{`
                        .group:hover .z-10 {
                          filter: drop-shadow(0 0 8px rgba(239,68,68,0.45));
                        }
                        .group:hover .absolute.inset-0 {
                          box-shadow: 0 0 0 12px rgba(239,68,68,0.18);
                          opacity: 1;
                          transition: box-shadow 0.3s, opacity 0.3s;
                        }
                      `}</style>
                    </span>
                  </button>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const confirmationModalContent = showConfirmation ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative max-w-md w-full mx-4 rounded-2xl shadow-2xl border flex flex-col items-center"
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(31,41,55,0.92), rgba(55,65,81,0.92))"
            : "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(249,250,251,0.85))",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: isDarkMode
            ? "1.5px solid rgba(75,85,99,0.25)"
            : "1.5px solid rgba(229,231,235,0.25)",
          boxShadow: isDarkMode
            ? "0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)"
            : "0 8px 32px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.10)",
        }}
      >
        <div className="flex flex-col items-center w-full px-6 pt-7 pb-6">
          <div
            className={`flex items-center justify-center mb-4 rounded-full shadow-lg border-2 ${
              confirmationDetails.title === "Delete User" ||
              confirmationDetails.title === "Block User"
                ? isDarkMode
                  ? "bg-orange-900/60 border-orange-700/60"
                  : "bg-orange-100 border-orange-200"
                : confirmationDetails.title === "Activate User"
                ? isDarkMode
                  ? "bg-green-900/60 border-green-700/60"
                  : "bg-green-100 border-green-200"
                : isDarkMode
                ? "bg-blue-900/60 border-blue-700/60"
                : "bg-blue-100 border-blue-200"
            }`}
            style={{ width: 54, height: 54 }}
          >
            {confirmationDetails.icon}
          </div>
          <h3
            className={`text-xl font-bold mb-2 text-center ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {confirmationDetails.title}
          </h3>
          <p
            className={`mb-4 text-base text-center ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {confirmationDetails.message}
          </p>

          {(confirmationDetails.title === "Delete User" ||
            confirmationDetails.title === "Block User") && (
            <div
              className={`mb-4 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium w-full justify-center ${
                confirmationDetails.title === "Delete User"
                  ? isDarkMode
                    ? "bg-red-900/20 text-red-200 border border-red-700/30"
                    : "bg-red-50/80 text-red-700 border border-red-200/50"
                  : isDarkMode
                  ? "bg-orange-900/20 text-orange-200 border border-orange-700/30"
                  : "bg-orange-50/80 text-orange-700 border border-orange-200/50"
              }`}
            >
              <AlertTriangle size={16} className="mr-1" />
              {confirmationDetails.title === "Delete User"
                ? "This action is irreversible. All user data will be permanently deleted."
                : "The user will be immediately blocked and unable to access the system."}
            </div>
          )}

          <div className="flex w-full justify-end gap-3 mt-2">
            <button
              onClick={handleCancelAction}
              className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isDarkMode
                  ? "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700/60 hover:text-white focus:ring-gray-500"
                  : "bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-blue-300"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmedAction}
              className={`px-4 py-2 rounded-lg transition-all duration-200 text-white text-sm font-medium flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                confirmationDetails.title === "Delete User"
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  : confirmationDetails.title === "Block User"
                  ? "bg-orange-500 hover:bg-orange-600 focus:ring-orange-400"
                  : confirmationDetails.title === "Activate User"
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {confirmationDetails.title === "Delete User"
                ? "Delete"
                : confirmationDetails.title === "Block User"
                ? "Block"
                : confirmationDetails.title === "Activate User"
                ? "Activate"
                : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div
        className={`rounded-lg backdrop-blur-xl border shadow-lg overflow-hidden ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700/50"
            : "bg-white/70 border-gray-200/50"
        }`}
      >
        {/* Compact Filters Section */}
        <div
          className={`p-4 border-b ${
            isDarkMode ? "border-gray-600/50" : "border-gray-200/50"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <Search
                  size={16}
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-9 pr-3 py-2 rounded-lg border transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                      : "bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  }`}
                />
              </div>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className={`px-3 py-2 rounded-lg border transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700/50 border-gray-600/50 text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                    : "bg-gray-50/50 border-gray-300/50 text-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                }`}
              >
                <option value="">All Roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role.replace(/_/g, " ")}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-3 py-2 rounded-lg border transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700/50 border-gray-600/50 text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                    : "bg-gray-50/50 border-gray-300/50 text-gray-900 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                }`}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                    isDarkMode
                      ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white"
                      : "bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Clear Filters
                </button>
              )}

              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {filteredUsers.length} users
              </span>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="p-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <User
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
                No users found
              </p>
            </div>
          ) : (
            <div className="space-y-2">{filteredUsers.map(renderUserCard)}</div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={showUserDetails}
        onClose={handleCloseUserDetails}
      />

      {/* Confirmation Modal Portal */}
      {showConfirmation &&
        createPortal(confirmationModalContent, document.body)}
    </>
  );
};

export default UserList;
