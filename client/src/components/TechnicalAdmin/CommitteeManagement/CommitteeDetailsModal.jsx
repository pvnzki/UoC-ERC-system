import React from "react";
import { createPortal } from "react-dom";
import {
  X,
  Users,
  Calendar,
  Building,
  User,
  Mail,
  Shield,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";

const CommitteeDetailsModal = ({
  committee,
  isOpen,
  onClose,
  onRemoveMember,
}) => {
  const { isDarkMode } = useTheme();
  const [showRemoveModal, setShowRemoveModal] = React.useState(false);
  const [memberToRemove, setMemberToRemove] = React.useState(null);

  if (!isOpen || !committee) return null;

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

  const handleRemoveMember = (memberId) => {
    setMemberToRemove(memberId);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (memberToRemove) {
      onRemoveMember(committee.committee_id, memberToRemove);
    }
    setShowRemoveModal(false);
    setMemberToRemove(null);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setMemberToRemove(null);
  };

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
            <div>
              <h2 className="text-lg font-semibold">Committee Details</h2>
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
        <div className="p-4 space-y-4">
          {/* Committee Information */}
          <div>
            <h3
              className={`text-md font-medium mb-3 flex items-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Building
                className={`w-4 h-4 mr-2 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              Committee Information
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
                  Committee ID
                </label>
                <p
                  className={`text-sm font-mono ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {committee.committee_id}
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
                  Committee Name
                </label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {committee.committee_name}
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
                  Committee Type
                </label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {committee.committee_type}
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
                  Total Members
                </label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {committee.members?.length || 0} members
                </p>
              </div>
            </div>
          </div>

          {/* Committee Members */}
          <div>
            <h3
              className={`text-md font-medium mb-3 flex items-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Users
                className={`w-4 h-4 mr-2 ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              />
              Committee Members
            </h3>
            {committee.members && committee.members.length > 0 ? (
              <div className="space-y-3">
                {committee.members.map((member) => (
                  <div
                    key={member.member_id}
                    className={`p-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700/50 border border-gray-600/50"
                        : "bg-gray-50/50 border border-gray-200/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isDarkMode
                              ? "bg-purple-900/30 border border-purple-700/50"
                              : "bg-purple-50 border border-purple-200"
                          }`}
                        >
                          <User
                            className={`w-4 h-4 ${
                              isDarkMode ? "text-purple-400" : "text-purple-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {member.user.first_name} {member.user.last_name}
                          </p>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {member.user.email}
                          </p>
                          <p
                            className={`text-xs ${
                              isDarkMode ? "text-gray-500" : "text-gray-600"
                            }`}
                          >
                            Role: {getRoleDisplayName(member.role)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.user.user_id)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isDarkMode
                            ? "text-red-400 hover:text-red-300 hover:bg-red-900/30"
                            : "text-red-500 hover:text-red-600 hover:bg-red-50"
                        }`}
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`p-4 text-center rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600/50"
                    : "bg-gray-50/50 border border-gray-200/50"
                }`}
              >
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No members assigned to this committee
                </p>
              </div>
            )}
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
                  {formatDate(committee.created_at)}
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
                  {formatDate(committee.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const removeModal = showRemoveModal
    ? createPortal(
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
                  isDarkMode
                    ? "bg-orange-900/60 border-orange-700/60"
                    : "bg-orange-100 border-orange-200"
                }`}
                style={{ width: 54, height: 54 }}
              >
                <AlertTriangle className="w-7 h-7 text-orange-500" />
              </div>
              <h3
                className={`text-xl font-bold mb-2 text-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Remove Committee Member
              </h3>
              <p
                className={`mb-4 text-base text-center ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Are you sure you want to remove this member from the committee?
                This action cannot be undone.
              </p>
              <div className="flex w-full justify-end gap-3 mt-2">
                <button
                  onClick={handleCancelRemove}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isDarkMode
                      ? "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700/60 hover:text-white focus:ring-gray-500"
                      : "bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-blue-300"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRemove}
                  className="px-4 py-2 rounded-lg transition-all duration-200 text-white text-sm font-medium flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-orange-500 hover:bg-orange-600 focus:ring-orange-400"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {createPortal(modalContent, document.body)}
      {removeModal}
    </>
  );
};

export default CommitteeDetailsModal;
