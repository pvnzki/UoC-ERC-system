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

const UserProfileModal = ({ isOpen, onClose, user }) => {
  const { logout } = useAuth();
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Profile Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <img
            src={user?.profile_pic || defaultProfile}
            alt="User Profile"
            className="h-24 w-24 rounded-full border-4 border-gray-200 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultProfile;
            }}
          />
        </div>

        {/* User Information */}
        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-center space-x-3">
            <User className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-semibold text-gray-800">
                {getUserDisplayName()}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center space-x-3">
            <Mail className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-semibold text-gray-800">{getUserEmail()}</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center space-x-3">
            <Shield className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-semibold text-gray-800">
                {formatRole(getUserRole())}
              </p>
            </div>
          </div>

          {/* User ID */}
          <div className="flex items-center space-x-3">
            <User className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="font-semibold text-gray-800">{getUserID()}</p>
            </div>
          </div>

          {/* Additional Info based on role */}
          {user?.applicant_id && (
            <div className="flex items-center space-x-3">
              <User className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Applicant ID</p>
                <p className="font-semibold text-gray-800">
                  {user.applicant_id}
                </p>
              </div>
            </div>
          )}

          {user?.member_id && (
            <div className="flex items-center space-x-3">
              <User className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Member ID</p>
                <p className="font-semibold text-gray-800">{user.member_id}</p>
              </div>
            </div>
          )}

          {user?.committee_id && (
            <div className="flex items-center space-x-3">
              <User className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Committee ID</p>
                <p className="font-semibold text-gray-800">
                  {user.committee_id}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleLogoutClick}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Logout Confirmation Dialog */}
        {showLogoutConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <div className="flex items-center mb-4">
                <AlertTriangle className="text-yellow-500 mr-3" size={24} />
                <h3 className="text-lg font-semibold text-gray-800">
                  Confirm Logout
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout? You will be redirected to the
                login page.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleLogoutCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
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
