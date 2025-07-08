// src/components/TechnicalAdmin/CommitteeManagement/CreateCommitteeForm.jsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { Loader, CheckCircle, AlertTriangle, Users } from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";
import BeatLoader from "../../common/BeatLoader";

const CreateCommitteeForm = ({ onSubmit }) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    committeeName: "",
    committeeType: "",
    description: "",
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
      console.log("Submitting committee data:", formData);

      const result = await onSubmit(formData);
      console.log("Committee creation result:", result);

      // Show success notification
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-500" size={18} />
          <div>
            <p className="font-semibold">Committee created successfully!</p>
            <p className="text-sm">
              The committee "{formData.committeeName}" has been created.
            </p>
          </div>
        </div>
      );

      // Reset form after successful creation
      setFormData({
        committeeName: "",
        committeeType: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating committee:", error);
      // Show error notification
      toast.error(
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-500" size={18} />
          <div>
            <p className="font-semibold">Failed to create committee</p>
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
        <h3 className="text-lg font-semibold mb-3">
          Confirm Committee Creation
        </h3>
        <p
          className={`mb-3 text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Are you sure you want to create the committee{" "}
          <strong>"{formData.committeeName}"</strong>?
        </p>
        <div
          className={`mb-4 p-3 rounded-lg ${
            isDarkMode
              ? "bg-blue-900/20 border border-blue-700/30"
              : "bg-blue-50/80 border border-blue-200/50"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-blue-500" />
            <span
              className={`text-sm font-medium ${
                isDarkMode ? "text-blue-300" : "text-blue-800"
              }`}
            >
              Committee Details
            </span>
          </div>
          <div
            className={`text-sm space-y-1 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <p>
              <strong>Name:</strong> {formData.committeeName}
            </p>
            <p>
              <strong>Type:</strong> {formData.committeeType}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {formData.description || "No description"}
            </p>
          </div>
        </div>
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
                <BeatLoader />
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
          <Users
            className={`w-5 h-5 mr-2 ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}
          />
          Create New Committee
        </h2>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="committeeName"
            >
              Committee Name
            </label>
            <input
              type="text"
              id="committeeName"
              name="committeeName"
              value={formData.committeeName}
              onChange={handleChange}
              className={`w-full py-2 px-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${
                isDarkMode
                  ? "bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400"
                  : "bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500"
              }`}
              placeholder="Enter committee name"
              required
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="committeeType"
            >
              Committee Type
            </label>
            <select
              id="committeeType"
              name="committeeType"
              value={formData.committeeType}
              onChange={handleChange}
              required
              className={`w-full py-2 px-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${
                isDarkMode
                  ? "bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400"
                  : "bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500"
              }`}
            >
              <option value="" disabled>
                Select committee type
              </option>
              <option value="Research Ethics">Research Ethics</option>
              <option value="Clinical Trials">Clinical Trials</option>
              <option value="Animal Research">Animal Research</option>
              <option value="Data Protection">Data Protection</option>
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={`w-full py-2 px-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors resize-none ${
                isDarkMode
                  ? "bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400"
                  : "bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500"
              }`}
              placeholder="Enter committee description (optional)"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Create Committee
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

export default CreateCommitteeForm;
