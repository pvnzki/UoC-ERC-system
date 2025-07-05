import React, { useState, useEffect } from "react";
import { X, Users, User, Plus, Search } from "lucide-react";
import { adminServices } from "../../../../services/admin-services";
import { toast } from "react-toastify";

const AddMembersModal = ({ committee, isOpen, onClose, onMembersAdded }) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Add Members to Committee
              </h2>
              <p className="text-sm text-gray-500">
                {committee.committee_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search committee members by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Selected Users Summary */}
            {selectedUsers.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Selected Users ({selectedUsers.length})
                </h3>
                <div className="space-y-2">
                  {selectedUsers.map((selectedUser) => {
                    const user = users.find(
                      (u) => u.user_id === selectedUser.userId
                    );
                    return user ? (
                      <div
                        key={selectedUser.userId}
                        className="flex items-center justify-between bg-white p-2 rounded border"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={selectedUser.role}
                            onChange={(e) =>
                              handleRoleChange(
                                selectedUser.userId,
                                e.target.value
                              )
                            }
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="MEMBER">Member</option>
                            <option value="CHAIR">Chair</option>
                            <option value="SECRETARY">Secretary</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleUserSelect(user)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Available Users */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Available Committee Members
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Only active committee members can be added to committees. Other
                user types (admins, applicants, staff) are not shown.
              </p>

              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p>No available committee members found.</p>
                  <p className="text-sm mt-2">
                    All committee members may already be assigned to this
                    committee, or there are no active committee members in the
                    system.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Select
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.user_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={isUserSelected(user.user_id)}
                              onChange={() => handleUserSelect(user)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.first_name} {user.last_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {user.user_id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.role.replace(/_/g, " ")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.validity ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Blocked
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedUsers.length === 0 || submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>
                      Add {selectedUsers.length} Member
                      {selectedUsers.length !== 1 ? "s" : ""}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;
