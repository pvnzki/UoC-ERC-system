import React, { useState } from "react";
import { toast } from "react-toastify";
import { Loader, CheckCircle, Mail, AlertTriangle } from "lucide-react";
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

  return (
    <div
      className={`shadow-md rounded-lg p-6 mb-6 relative ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`text-xl font-semibold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Create New User
      </h2>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-lg p-6 max-w-md w-full mx-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-3 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Confirm User Creation
            </h3>
            <p
              className={`mb-4 ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
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
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <Mail size={16} className="text-blue-500" />
              An email with login credentials will be sent to{" "}
              <strong>{formData.email}</strong>.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className={`px-4 py-2 border rounded-md hover:bg-gray-100 ${
                  isDarkMode
                    ? "border-gray-600 text-gray-200 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700"
                }`}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
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
      )}

      {/* Form Content */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label
            className={`block text-sm font-bold mb-2 ${
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
            className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "text-gray-700 border-gray-300"
            }`}
            required
          />
        </div>

        <div>
          <label
            className={`block text-sm font-bold mb-2 ${
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
            className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "text-gray-700 border-gray-300"
            }`}
            required
          />
        </div>

        <div>
          <label
            className={`block text-sm font-bold mb-2 ${
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
            className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "text-gray-700 border-gray-300"
            }`}
            required
          />
        </div>

        <div>
          <label
            className={`block text-sm font-bold mb-2 ${
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
            className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "text-gray-700 border-gray-300"
            }`}
            required
          >
            <option value="">Select Role</option>
            <option value="ADMIN">Admin</option>
            <option value="COMMITTEE_MEMBER">Committee Member</option>
            <option value="STAFF">Staff</option>
          </select>
        </div>

        {formData.role === "COMMITTEE_MEMBER" && (
          <div>
            <label
              className={`block text-sm font-bold mb-2 ${
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
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "text-gray-700 border-gray-300"
              }`}
              required
            >
              <option value="">Select Committee</option>
              {committees && committees.length > 0 ? (
                committees.map((committee) => (
                  <option
                    key={committee.committee_id}
                    value={committee.committee_id}
                  >
                    {committee.committee_name} ({committee.committee_type})
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No committees available
                </option>
              )}
            </select>
            {committees && committees.length === 0 && (
              <p className="text-red-500 text-xs mt-1">
                No committees available. Please create a committee first.
              </p>
            )}
          </div>
        )}

        {formData.role === "ADMIN" && (
          <div>
            <label
              className={`block text-sm font-bold mb-2 ${
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
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "text-gray-700 border-gray-300"
              }`}
              required
            >
              <option value="">Select Admin Type</option>
              <option value="ERC_TECHNICAL">ERC Technical</option>
              <option value="ERC_ADMINISTRATIVE">ERC Administrative</option>
            </select>
          </div>
        )}

        <div className="md:col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create User"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
