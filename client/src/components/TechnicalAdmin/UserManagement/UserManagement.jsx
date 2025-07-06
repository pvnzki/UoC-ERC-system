// src/components/TechnicalAdmin/UserManagement/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import UserList from "./UserList";
import CreateUserForm from "./CreateUserForm";
import { adminServices } from "../../../../services/admin-services";
import { useAuth } from "../../../../context/auth/AuthContext";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user: currentUser } = useAuth();

  // Debug: Log currentUser changes
  useEffect(() => {
    console.log("UserManagement: currentUser changed:", currentUser);
    console.log("UserManagement: currentUser type:", typeof currentUser);
    console.log("UserManagement: currentUser user_id:", currentUser?.user_id);
    console.log("UserManagement: currentUser email:", currentUser?.email);
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await adminServices.getUsers();
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommittees = async () => {
    try {
      const committeesData = await adminServices.getCommittees();
      console.log("Fetched committees:", committeesData);
      setCommittees(committeesData);
    } catch (err) {
      console.error("Failed to load committees:", err);
      setCommittees([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCommittees();
  }, []);

  // Refresh users when currentUser changes (after login/logout)
  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleCreateUser = async (userData) => {
    try {
      const response = await adminServices.createUser(userData);

      // Refresh the users list after creating a new user
      fetchUsers();

      // Return the response for the form component to handle
      return response;
    } catch (error) {
      console.error("Error creating user:", error);

      // Re-throw the error so the form component can handle it
      throw error;
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      await adminServices.deleteUser(userId);

      // Refresh users list after deletion
      fetchUsers();

      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(
        "Failed to delete user: " + (err.response?.data?.error || err.message)
      );
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserStatus = async (userId, action) => {
    try {
      setLoading(true);
      console.log(`Attempting to ${action} user ${userId}`);

      const result = await adminServices.updateUserStatus(userId, action);
      console.log("Update status result:", result);

      fetchUsers();
      const actionText = action === "block" ? "blocked" : "activated";
      toast.success(`User ${actionText} successfully`);
    } catch (err) {
      const actionText = action === "block" ? "block" : "activate";
      setError(`Failed to ${actionText} user`);
      console.error("Error updating user status:", err);
      console.error("Error response:", err.response?.data);
      toast.error(
        `Failed to ${actionText} user: ${
          err.response?.data?.error || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showCreateForm ? "Cancel" : "Create User"}
        </button>
      </div>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {showCreateForm && (
        <CreateUserForm onSubmit={handleCreateUser} committees={committees} />
      )}

      {loading && !showCreateForm ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <UserList
          key={currentUser?.user_id || "no-user"} // Force re-render when user changes
          users={users}
          onUpdateStatus={handleUpdateUserStatus}
          onDeleteUser={handleDeleteUser}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default UserManagement;
