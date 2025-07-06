// src/components/TechnicalAdmin/CommitteeManagement/CreateCommitteeForm.jsx
import React, { useState } from "react";
import { X, Users, Calendar, FileText } from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";

const CreateCommitteeForm = ({ onSubmit }) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      className={`shadow-md rounded-lg p-6 mb-6 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`text-xl font-semibold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Create New Committee
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className={`block text-sm font-bold mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
            htmlFor="name"
          >
            Committee Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "text-gray-700 border-gray-300"
            }`}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className={`block text-sm font-bold mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
            htmlFor="type"
          >
            Committee Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "text-gray-700 border-gray-300"
            }`}
            required
          >
            <option value="">Select Type</option>
            <option value="ERC">ERC</option>
            <option value="CTSC">CTSC</option>
            <option value="ARWC">ARWC</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Committee
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommitteeForm;
