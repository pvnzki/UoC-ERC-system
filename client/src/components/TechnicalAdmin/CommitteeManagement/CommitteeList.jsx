// src/components/TechnicalAdmin/CommitteeManagement/CommitteeList.jsx
import React, { useState, useEffect } from "react";
import { Eye, Users, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import CommitteeDetailsModal from "./CommitteeDetailsModal";
import AddMembersModal from "./AddMembersModal";
import { adminServices } from "../../../../services/admin-services";

const CommitteeList = ({ committees, onCommitteeUpdated }) => {
  const [committeesWithMembers, setCommitteesWithMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [committeeToDelete, setCommitteeToDelete] = useState(null);

  // Fetch committees with members
  const fetchCommitteesWithMembers = async () => {
    try {
      setLoading(true);
      const committeesData = await adminServices.getCommitteesWithMembers();
      console.log("=== FRONTEND: Received committees data ===");
      console.log("Raw data:", committeesData);

      if (committeesData && Array.isArray(committeesData)) {
        committeesData.forEach((committee, index) => {
          console.log(`Committee ${index + 1}:`, {
            committee_id: committee.committee_id,
            committee_name: committee.committee_name,
            member_count: committee.members ? committee.members.length : 0,
            members: committee.members
              ? committee.members.map((m) => ({
                  member_id: m.member_id,
                  user_id: m.user ? m.user.user_id : "N/A",
                  user_name: m.user
                    ? `${m.user.first_name} ${m.user.last_name}`
                    : "N/A",
                  role: m.role,
                }))
              : [],
          });
        });
      }
      console.log("=== END FRONTEND DEBUG ===");

      setCommitteesWithMembers(committeesData || []);
    } catch (error) {
      console.error("Error fetching committees with members:", error);
      toast.error("Failed to load committee details");
      setCommitteesWithMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle view committee details
  const handleViewDetails = (committee) => {
    console.log("Viewing details for committee:", committee);
    console.log("Available committees with members:", committeesWithMembers);

    const committeeWithMembers = committeesWithMembers.find(
      (c) => c.committee_id === committee.committee_id
    );
    console.log("Found committee with members:", committeeWithMembers);

    setSelectedCommittee(committeeWithMembers || committee);
    setShowDetailsModal(true);
  };

  // Handle add members
  const handleAddMembers = (committee) => {
    const committeeWithMembers = committeesWithMembers.find(
      (c) => c.committee_id === committee.committee_id
    );
    setSelectedCommittee(committeeWithMembers || committee);
    setShowAddMembersModal(true);
  };

  // Handle members added
  const handleMembersAdded = () => {
    console.log("=== FRONTEND: handleMembersAdded called ===");
    console.log("Refreshing committees data...");

    // Force a fresh fetch with a small delay to ensure backend has processed the changes
    setTimeout(() => {
      console.log("Executing delayed refresh...");
      fetchCommitteesWithMembers();
    }, 500);

    if (onCommitteeUpdated) {
      console.log("Calling onCommitteeUpdated callback");
      onCommitteeUpdated();
    }
    console.log("=== END FRONTEND DEBUG ===");
  };

  // Handle remove member
  const handleRemoveMember = async (committeeId, memberId) => {
    try {
      await adminServices.removeMembersFromCommittee({
        committeeId,
        memberIds: [memberId],
      });
      toast.success("Member removed successfully");
      fetchCommitteesWithMembers();
      if (onCommitteeUpdated) {
        onCommitteeUpdated();
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }
  };

  // Close modals
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedCommittee(null);
  };

  const handleCloseAddMembersModal = () => {
    setShowAddMembersModal(false);
    setSelectedCommittee(null);
  };

  // Handle delete committee
  const handleDeleteCommittee = (committee) => {
    setCommitteeToDelete(committee);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!committeeToDelete) return;

    try {
      const result = await adminServices.deleteCommittee(
        committeeToDelete.committee_id
      );
      const summary = result.summary;
      let message = `Committee "${committeeToDelete.committee_name}" deleted successfully!`;

      if (summary) {
        const details = [];
        if (summary.membersRemoved > 0) {
          details.push(`${summary.membersRemoved} member(s) removed`);
        }
        if (summary.applicationsUnassigned > 0) {
          details.push(
            `${summary.applicationsUnassigned} application(s) unassigned`
          );
        }
        if (summary.meetingsDeleted > 0) {
          details.push(`${summary.meetingsDeleted} meeting(s) deleted`);
        }

        if (details.length > 0) {
          message += ` (${details.join(", ")})`;
        }
      }

      toast.success(message);
      setShowDeleteModal(false);
      setCommitteeToDelete(null);

      // Refresh the committees list
      if (onCommitteeUpdated) {
        onCommitteeUpdated();
      }
    } catch (error) {
      console.error("Error deleting committee:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to delete committee";
      toast.error(errorMessage);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCommitteeToDelete(null);
  };

  // Fetch committees with members on component mount
  useEffect(() => {
    fetchCommitteesWithMembers();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Manual Refresh Button for Debugging */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => {
            console.log("Manual refresh triggered");
            fetchCommitteesWithMembers();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          🔄 Refresh Committees
        </button>
        <span className="ml-2 text-sm text-gray-500">
          (Debug: {committeesWithMembers.length} committees loaded)
        </span>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && committeeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Delete Committee
                  </h2>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to delete the committee:
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-900">
                    {committeeToDelete.committee_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Type: {committeeToDelete.committee_type}
                  </p>
                  <p className="text-sm text-gray-500">
                    ID: {committeeToDelete.committee_id}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      What will happen:
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          Committee members will be removed from this committee
                          (users remain in system)
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
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 size={16} />
                <span>Delete Committee</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with refresh button */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Committees</h3>
        <button
          onClick={fetchCommitteesWithMembers}
          disabled={loading}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Members
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {committees.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                No committees found. Create one to get started.
              </td>
            </tr>
          ) : (
            committees.map((committee) => (
              <tr key={committee.committee_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {committee.committee_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {committee.committee_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {committee.committee_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {committee.members?.length || 0} members
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(committee)}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      title="View Committee Details"
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleAddMembers(committee)}
                      className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                      title="Add Members"
                    >
                      <Users size={16} />
                      <span>Add Members</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCommittee(committee)}
                      className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                      title="Delete Committee"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CommitteeList;
