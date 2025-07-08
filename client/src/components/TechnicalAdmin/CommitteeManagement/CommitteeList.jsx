// src/components/TechnicalAdmin/CommitteeManagement/CommitteeList.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Users,
  Building,
  Eye,
  UserPlus,
  Trash2,
  AlertTriangle,
  Calendar,
  Search,
  Plus,
  X,
} from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";
import { adminServices } from "../../../../services/admin-services";
import { toast } from "react-toastify";
import CommitteeDetailsModal from "./CommitteeDetailsModal";
import AddMembersModal from "./AddMembersModal";
import BeatLoader from "../../common/BeatLoader";

const CommitteeList = ({ committees, onCommitteeUpdated }) => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [committeeToDelete, setCommitteeToDelete] = useState(null);
  const [committeesWithMembers, setCommitteesWithMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch committees with member details
  const fetchCommitteesWithMembers = async () => {
    try {
      setLoading(true);
      // Use getCommitteesWithMembers to get members included
      const committeesData = await adminServices.getCommitteesWithMembers();
      setCommitteesWithMembers(committeesData);
    } catch (error) {
      console.error("Error fetching committees:", error);
      toast.error("Failed to load committees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitteesWithMembers();
  }, []);

  // Handle view committee details
  const handleViewDetails = (committee) => {
    setSelectedCommittee(committee);
    setShowDetailsModal(true);
  };

  // Handle add members to committee
  const handleAddMembers = async (committee) => {
    // Fetch the latest committee details before opening the modal
    try {
      setLoading(true);
      const latestCommittees = await adminServices.getCommitteesWithMembers();
      const latestCommittee = latestCommittees.find(
        (c) => c.committee_id === committee.committee_id
      );
      setSelectedCommittee(latestCommittee || committee); // fallback to old if not found
      setShowAddMembersModal(true);
    } catch (error) {
      toast.error("Failed to fetch latest committee data");
      setSelectedCommittee(committee);
      setShowAddMembersModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle members added successfully
  const handleMembersAdded = () => {
    fetchCommitteesWithMembers();
    onCommitteeUpdated();
  };

  // Handle remove member from committee
  const handleRemoveMember = async (committeeId, memberId) => {
    try {
      await adminServices.removeMemberFromCommittee(committeeId, memberId);
      toast.success("Member removed successfully");
      fetchCommitteesWithMembers();
      onCommitteeUpdated();
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }
  };

  // Handle close details modal
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedCommittee(null);
  };

  // Handle close add members modal
  const handleCloseAddMembersModal = () => {
    setShowAddMembersModal(false);
    setSelectedCommittee(null);
  };

  // Handle delete committee
  const handleDeleteCommittee = (committee) => {
    setCommitteeToDelete(committee);
    setShowDeleteModal(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      const result = await adminServices.deleteCommittee(
        committeeToDelete.committee_id
      );

      let message = `Committee "${committeeToDelete.committee_name}" deleted successfully!`;
      if (result.removedMembers > 0) {
        message += ` ${result.removedMembers} members were removed.`;
      }
      if (result.unassignedApplications > 0) {
        message += ` ${result.unassignedApplications} applications were unassigned.`;
      }
      if (result.deletedMeetings > 0) {
        message += ` ${result.deletedMeetings} meetings were deleted.`;
      }

      toast.success(message);
      setShowDeleteModal(false);
      setCommitteeToDelete(null);
      fetchCommitteesWithMembers();
      onCommitteeUpdated();
    } catch (error) {
      console.error("Error deleting committee:", error);
      toast.error(error.response?.data?.error || "Failed to delete committee");
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCommitteeToDelete(null);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterType("");
  };

  // Get unique committee types for filter dropdown
  const uniqueTypes = [
    ...new Set(
      committeesWithMembers.map((committee) => committee.committee_type)
    ),
  ].sort();

  // Filter committees based on search query and filters
  const filteredCommittees = committeesWithMembers.filter((committee) => {
    const matchesSearch =
      searchQuery === "" ||
      committee.committee_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      committee.committee_id.toString().includes(searchQuery);

    const matchesType =
      filterType === "" || committee.committee_type === filterType;

    return matchesSearch && matchesType;
  });

  const hasActiveFilters = searchQuery || filterType;

  const deleteModalContent =
    showDeleteModal && committeeToDelete ? (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
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
                    ? "bg-red-900/30 border border-red-700/50"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <Trash2
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-red-400" : "text-red-600"
                  }`}
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Delete Committee</h2>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  This action cannot be undone
                </p>
              </div>
            </div>
            <button
              onClick={handleCancelDelete}
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
            <div className="mb-4">
              <p
                className={`mb-3 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Are you sure you want to delete the committee:
              </p>
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600/50"
                    : "bg-gray-50/50 border border-gray-200/50"
                }`}
              >
                <p className="font-medium">
                  {committeeToDelete.committee_name}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Type: {committeeToDelete.committee_type}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  ID: {committeeToDelete.committee_id}
                </p>
              </div>
            </div>

            <div
              className={`border rounded-lg p-4 mb-4 ${
                isDarkMode
                  ? "bg-blue-900/20 border-blue-700/30"
                  : "bg-blue-50/80 border-blue-200/50"
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      isDarkMode ? "text-blue-400" : "text-blue-500"
                    }`}
                  />
                </div>
                <div className="ml-3">
                  <h3
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-blue-300" : "text-blue-800"
                    }`}
                  >
                    What will happen:
                  </h3>
                  <div
                    className={`mt-2 text-sm ${
                      isDarkMode ? "text-blue-200" : "text-blue-700"
                    }`}
                  >
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        Committee members will be removed from this committee
                      </li>
                      <li>
                        Applications assigned to this committee will be
                        unassigned
                      </li>
                      <li>All committee meetings will be deleted</li>
                      <li>The committee will be permanently deleted</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white"
                    : "bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-gray-900"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Trash2 size={16} />
                <span>Delete Committee</span>
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
                  placeholder="Search committees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-9 pr-3 py-2 rounded-lg border transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                      : "bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`px-3 py-2 rounded-lg border transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700/50 border-gray-600/50 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    : "bg-gray-50/50 border-gray-300/50 text-gray-900 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                }`}
              >
                <option value="">All Types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
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
                {filteredCommittees.length} committees
              </span>
            </div>
          </div>
        </div>

        {/* Committees List */}
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <BeatLoader />
            </div>
          ) : filteredCommittees.length === 0 ? (
            <div className="text-center py-12">
              <Building
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
                No committees found
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCommittees.map((committee) => (
                <div
                  key={committee.committee_id}
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
                            ? "bg-blue-900/30 border border-blue-700/50"
                            : "bg-blue-50 border border-blue-200"
                        }`}
                      >
                        <Building
                          className={`w-5 h-5 ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold truncate ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {committee.committee_name}
                        </h3>

                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-2">
                            <Users
                              size={16}
                              className={
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }
                            />
                            <span
                              className={`text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {committee.members?.length || 0} members
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Building
                              size={16}
                              className={
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }
                            />
                            <span
                              className={`text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {committee.committee_type || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(committee)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isDarkMode
                            ? "bg-blue-600/80 hover:bg-blue-500/80 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        } shadow-lg hover:shadow-xl`}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => handleAddMembers(committee)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isDarkMode
                            ? "bg-green-600/80 hover:bg-green-500/80 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        } shadow-lg hover:shadow-xl`}
                      >
                        <UserPlus size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteCommittee(committee)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isDarkMode
                            ? "bg-red-600/80 hover:bg-red-500/80 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        } shadow-lg hover:shadow-xl`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Committee Details Modal */}
      <CommitteeDetailsModal
        committee={selectedCommittee}
        isOpen={showDetailsModal}
        onClose={handleCloseDetailsModal}
        onRemoveMember={handleRemoveMember}
      />

      {/* Add Members Modal */}
      <AddMembersModal
        committee={selectedCommittee}
        isOpen={showAddMembersModal}
        onClose={handleCloseAddMembersModal}
        onMembersAdded={handleMembersAdded}
      />

      {/* Delete Confirmation Modal Portal */}
      {showDeleteModal && createPortal(deleteModalContent, document.body)}
    </>
  );
};

export default CommitteeList;
