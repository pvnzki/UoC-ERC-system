import React, { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { Loader, CheckCircle, Mail, AlertTriangle, User } from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";

const CreateUserForm = ({ onSubmit, committees }) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    committeeId: "",
    userType: "",
  });
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show confirmation dialog instead of immediate submission
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    try {
      console.log("Submitting user data:", formData);

      // Validate required fields based on role
      if (formData.role === "COMMITTEE_MEMBER" && !formData.committeeId) {
        throw new Error("Committee is required for Committee Members");
      }
      if (formData.role === "ADMIN" && !formData.userType) {
        throw new Error("Admin Type is required for Administrators");
      }

      const result = await onSubmit(formData);
      console.log("User creation result:", result);

      // Show success notification
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-500" size={18} />
          <div>
            <p className="font-semibold">User created successfully!</p>
            <p className="text-sm">
              An email has been sent with login credentials.
            </p>
          </div>
        </div>
      );

      // Reset form after successful creation
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        role: "",
        committeeId: "",
        userType: "",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      // Show error notification
      toast.error(
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-500" size={18} />
          <div>
            <p className="font-semibold">Failed to create user</p>
            <p className="text-sm">
              {error.response?.data?.error ||
                error.message ||
                "Please try again"}
            </p>
          </div>
        </div>
      );
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
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
        <h3 className="text-lg font-semibold mb-3">Confirm User Creation</h3>
        <p
          className={`mb-3 text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Are you sure you want to create an account for{" "}
          <strong>
            {formData.firstName} {formData.lastName}
          </strong>
          ?
        </p>
        <p
          className={`mb-4 text-sm flex items-center gap-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <Mail size={16} className="text-blue-500" />
          An email with login credentials will be sent to{" "}
          <strong>{formData.email}</strong>.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? "text-gray-300 hover:text-gray-200 hover:bg-gray-700/50"
                : "text-gray-600 hover:text-gray-700 hover:bg-gray-100/50"
            }`}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSubmit}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              isDarkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Confirm & Create"
            )}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div
        className={`backdrop-blur-xl border shadow-xl rounded-2xl p-4 mb-4 relative ${
          isDarkMode
            ? "bg-gray-800/90 border-gray-700/50 text-white"
            : "bg-white/90 border-gray-200/50 text-gray-900"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <User
            className={`w-5 h-5 mr-2 ${
              isDarkMode ? "text-purple-400" : "text-purple-600"
            }`}
          />
          Create New User
        </h2>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full py-2 px-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${
                isDarkMode
                  ? "bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400"
                  : "bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500"
              }`}
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full py-2 px-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${
                isDarkMode
                  ? "bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400"
                  : "bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500"
              }`}
              placeholder="Enter first name"
              required
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full py-2 px-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${
                isDarkMode
                  ? "bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400"
                  : "bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500"
              }`}
              placeholder="Enter last name"
              required
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="role"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full py-2 px-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${
                isDarkMode
                  ? "bg-gray-700/50 border-gray-600/50 text-white"
                  : "bg-gray-50/50 border-gray-300/50 text-gray-900"
              }`}
              required
            >
              <option value="">Select Role</option>
              <option value="ADMIN">Administrator</option>
              <option value="COMMITTEE_MEMBER">Committee Member</option>
              <option value="OFFICE_STAFF">Office Staff</option>
            </select>
          </div>

          {formData.role === "COMMITTEE_MEMBER" && (
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
                htmlFor="committeeId"
              >
                Committee
              </label>
              <select
                id="committeeId"
                name="committeeId"
                value={formData.committeeId}
                onChange={handleChange}
                className={`w-full py-2 px-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${
                  isDarkMode
                    ? "bg-gray-700/50 border-gray-600/50 text-white"
                    : "bg-gray-50/50 border-gray-300/50 text-gray-900"
                }`}
                required
              >
                <option value="">Select Committee</option>
                {committees.map((committee) => (
                  <option
                    key={committee.committee_id}
                    value={committee.committee_id}
                  >
                    {committee.committee_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.role === "ADMIN" && (
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
                htmlFor="userType"
              >
                Admin Type
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className={`w-full py-2 px-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${
                  isDarkMode
                    ? "bg-gray-700/50 border-gray-600/50 text-white"
                    : "bg-gray-50/50 border-gray-300/50 text-gray-900"
                }`}
                required
              >
                <option value="">Select Admin Type</option>
                <option value="TECHNICAL_ADMIN">Technical Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
          )}

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Create User
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal Portal */}
      {showConfirmation &&
        createPortal(confirmationModalContent, document.body)}
    </>
  );
};

export default CreateUserForm;
