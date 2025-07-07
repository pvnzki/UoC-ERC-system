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
          className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 ${
            isDarkMode
              ? "bg-gray-800 text-white border border-gray-700"
              : "bg-gray-900 text-white border border-gray-600"
          }`}
        >
          {label}
          <div
            className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
              isDarkMode ? "border-t-gray-800" : "border-t-gray-900"
            }`}
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

            <Tooltip label="View Details">
              <button
                onClick={() => handleViewUserDetails(user)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? "bg-blue-600/80 hover:bg-blue-500/80 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                } shadow-md hover:shadow-lg`}
              >
                <Eye size={14} />
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
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isDarkMode
                          ? "bg-yellow-600/80 hover:bg-yellow-500/80 text-white"
                          : "bg-yellow-600 hover:bg-yellow-700 text-white"
                      } shadow-md hover:shadow-lg`}
                    >
                      <XCircle size={14} />
                    </button>
                  </Tooltip>
                ) : (
                  <Tooltip label="Activate User">
                    <button
                      onClick={() =>
                        handleConfirmationShow("activate", user.user_id)
                      }
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isDarkMode
                          ? "bg-green-600/80 hover:bg-green-500/80 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      } shadow-md hover:shadow-lg`}
                    >
                      <CheckCircle size={14} />
                    </button>
                  </Tooltip>
                )}

                <Tooltip label="Permanently Delete User">
                  <button
                    onClick={() =>
                      handleConfirmationShow("delete", user.user_id)
                    }
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isDarkMode
                        ? "bg-red-600/80 hover:bg-red-500/80 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    } shadow-md hover:shadow-lg`}
                  >
                    <Trash2 size={14} />
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
      <div
        className="max-w-md w-full mx-4 rounded-xl"
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
        <div className="flex items-center gap-3 mb-4">
          {confirmationDetails.icon}
          <h3 className="text-lg font-semibold">{confirmationDetails.title}</h3>
        </div>

        <p
          className={`mb-4 text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {confirmationDetails.message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancelAction}
            className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
              isDarkMode
                ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white"
                : "bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-gray-900"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmedAction}
            className={`px-3 py-2 rounded-lg transition-all duration-300 text-white text-sm ${confirmationDetails.buttonClass}`}
          >
            {confirmationDetails.actionText}
          </button>
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
