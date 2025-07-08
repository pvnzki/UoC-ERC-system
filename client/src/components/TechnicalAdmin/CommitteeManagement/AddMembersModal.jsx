import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Users, User, Plus, Search } from "lucide-react";
import { adminServices } from "../../../../services/admin-services";
import { toast } from "react-toastify";
import { useTheme } from "../../../context/theme/ThemeContext";
import BeatLoader from "../../common/BeatLoader";

const AddMembersModal = ({ committee, isOpen, onClose, onMembersAdded }) => {
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch available users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await adminServices.getUsers();
      // Filter to only show COMMITTEE_MEMBER users who are not already members of this committee
      const availableUsers = usersData.filter(
        (user) =>
          user.role === "COMMITTEE_MEMBER" && // Only show committee members
          user.validity && // Only show active users
          !committee.members?.some(
            (member) => member.user.user_id === user.user_id
          )
      );
      setUsers(availableUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    const isSelected = selectedUsers.some((u) => u.userId === user.user_id);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((u) => u.userId !== user.user_id));
    } else {
      setSelectedUsers([
        ...selectedUsers,
        {
          userId: user.user_id,
          role: "MEMBER",
        },
      ]);
    }
  };

  const handleRoleChange = (userId, role) => {
    setSelectedUsers(
      selectedUsers.map((user) =>
        user.userId === userId ? { ...user, role } : user
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      toast.warning("Please select at least one user to add");
      return;
    }

    try {
      setSubmitting(true);
      console.log("=== FRONTEND: Adding members to committee ===");
      console.log("Committee ID:", committee.committee_id);
      console.log("Selected users:", selectedUsers);

      const result = await adminServices.addMembersToCommittee({
        committeeId: committee.committee_id,
        members: selectedUsers,
      });

      console.log("Backend response:", result);
      toast.success("Members added successfully");

      console.log("Calling onMembersAdded callback");
      onMembersAdded();
      onClose();
      setSelectedUsers([]);
      console.log("=== END FRONTEND DEBUG ===");
    } catch (error) {
      console.error("Error adding members:", error);
      toast.error("Failed to add members to committee");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_id.toString().includes(searchQuery)
  );

  const isUserSelected = (userId) => {
    return selectedUsers.some((u) => u.userId === userId);
  };

  const getSelectedUserRole = (userId) => {
    const selectedUser = selectedUsers.find((u) => u.userId === userId);
    return selectedUser ? selectedUser.role : "MEMBER";
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div
        className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-xl"
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
                  ? "bg-green-900/30 border border-green-700/50"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <Users
                className={`w-5 h-5 ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Add Members to Committee
              </h2>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {committee.committee_name}
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
          <form onSubmit={handleSubmit}>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-3 py-2 border rounded-lg leading-5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    isDarkMode
                      ? "border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-400"
                      : "border-gray-300/50 bg-gray-50/50 text-gray-900"
                  }`}
                  placeholder="Search committee members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Selected Users Summary */}
            {selectedUsers.length > 0 && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  isDarkMode
                    ? "bg-blue-900/30 border border-blue-700/50"
                    : "bg-blue-50/50 border border-blue-200/50"
                }`}
              >
                <h3
                  className={`text-sm font-medium mb-2 ${
                    isDarkMode ? "text-blue-300" : "text-blue-900"
                  }`}
                >
                  Selected Users ({selectedUsers.length})
                </h3>
                <div className="space-y-2">
                  {selectedUsers.map((selectedUser) => {
                    const user = users.find(
                      (u) => u.user_id === selectedUser.userId
                    );
                    return (
                      <div
                        key={selectedUser.userId}
                        className={`flex items-center justify-between p-2 rounded ${
                          isDarkMode ? "bg-blue-800/30" : "bg-blue-100/50"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <User
                            className={`w-4 h-4 ${
                              isDarkMode ? "text-blue-300" : "text-blue-600"
                            }`}
                          />
                          <span className="text-sm">
                            {user?.first_name} {user?.last_name}
                          </span>
                        </div>
                        <select
                          value={selectedUser.role}
                          onChange={(e) =>
                            handleRoleChange(
                              selectedUser.userId,
                              e.target.value
                            )
                          }
                          className={`text-xs px-2 py-1 rounded border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        >
                          <option value="MEMBER">Member</option>
                          <option value="CHAIR">Chair</option>
                          <option value="SECRETARY">Secretary</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Users List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <BeatLoader />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div
                  className={`text-center py-8 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <Users
                    className={`w-8 h-8 mx-auto mb-2 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <p className="text-sm">No available users found</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.user_id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      isUserSelected(user.user_id)
                        ? isDarkMode
                          ? "bg-blue-900/30 border border-blue-700/50"
                          : "bg-blue-50/50 border border-blue-200/50"
                        : isDarkMode
                        ? "bg-gray-700/50 border border-gray-600/50 hover:bg-gray-600/50"
                        : "bg-gray-50/50 border border-gray-200/50 hover:bg-gray-100/50"
                    }`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-1 rounded ${
                            isUserSelected(user.user_id)
                              ? isDarkMode
                                ? "bg-blue-800/50"
                                : "bg-blue-100"
                              : isDarkMode
                              ? "bg-gray-600/50"
                              : "bg-gray-200/50"
                          }`}
                        >
                          <User
                            className={`w-4 h-4 ${
                              isUserSelected(user.user_id)
                                ? isDarkMode
                                  ? "text-blue-300"
                                  : "text-blue-600"
                                : isDarkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {user.first_name} {user.last_name}
                          </p>
                          <p
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {user.email}
                          </p>
                        </div>
                      </div>
                      {isUserSelected(user.user_id) && (
                        <div className="flex items-center space-x-2">
                          <select
                            value={getSelectedUserRole(user.user_id)}
                            onChange={(e) =>
                              handleRoleChange(user.user_id, e.target.value)
                            }
                            onClick={(e) => e.stopPropagation()}
                            className={`text-xs px-2 py-1 rounded border ${
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                          >
                            <option value="MEMBER">Member</option>
                            <option value="CHAIR">Chair</option>
                            <option value="SECRETARY">Secretary</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Actions */}
            <div
              className={`mt-6 pt-4 border-t ${
                isDarkMode ? "border-gray-700/50" : "border-gray-200/50"
              }`}
            >
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-gray-200 hover:bg-gray-700/50"
                      : "text-gray-600 hover:text-gray-700 hover:bg-gray-100/50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || selectedUsers.length === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    isDarkMode
                      ? "bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-600"
                      : "bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {submitting
                      ? "Adding..."
                      : `Add ${selectedUsers.length} Member${
                          selectedUsers.length !== 1 ? "s" : ""
                        }`}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AddMembersModal;
