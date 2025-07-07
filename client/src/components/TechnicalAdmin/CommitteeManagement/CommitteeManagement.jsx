// src/components/TechnicalAdmin/CommitteeManagement/CommitteeManagement.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  Users, 
  UserPlus, 
  X, 
  AlertCircle
} from "lucide-react";
import CommitteeList from "./CommitteeList";
import CreateCommitteeForm from "./CreateCommitteeForm";
import { adminServices } from "../../../../services/admin-services";
import { useTheme } from "../../../context/theme/ThemeContext";

const CommitteeManagement = () => {
  const { isDarkMode } = useTheme();
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchCommittees = async () => {
    try {
      setLoading(true);
      const committeesData = await adminServices.getCommittees();
      setCommittees(committeesData);
      setError(null);
    } catch (err) {
      setError("Failed to load committees");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittees();
  }, []);

  const handleCreateCommittee = async (committeeData) => {
    try {
      setLoading(true);
      await adminServices.createCommittee(committeeData);
      fetchCommittees();
      setShowCreateForm(false);
      setRefreshKey((prev) => prev + 1);
      toast.success("Committee created successfully");
    } catch (err) {
      setError("Failed to create committee");
      console.error(err);
      toast.error("Failed to create committee");
    } finally {
      setLoading(false);
    }
  };

  const handleCommitteeUpdated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className={`p-4 rounded-lg backdrop-blur-xl border ${
        isDarkMode 
          ? "bg-gray-800/50 border-gray-700/50 text-white" 
          : "bg-white/70 border-gray-200/50 text-gray-900"
      } shadow-lg`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Committees
            </h1>
          </div>
          
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              isDarkMode
                ? "bg-green-600/80 hover:bg-green-500/80 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            } shadow-lg hover:shadow-xl`}
          >
            {showCreateForm ? (
              <>
                <X size={16} />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Add Committee</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Create Committee Form */}
      {showCreateForm && (
        <div className={`p-4 rounded-lg backdrop-blur-xl border ${
          isDarkMode 
            ? "bg-gray-800/50 border-gray-700/50 text-white" 
            : "bg-white/70 border-gray-200/50 text-gray-900"
        } shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Create New Committee</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white"
                  : "bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-gray-900"
              }`}
            >
              <X size={16} />
            </button>
          </div>
          <CreateCommitteeForm onSubmit={handleCreateCommittee} />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className={`p-3 rounded-lg backdrop-blur-xl border ${
          isDarkMode
            ? "bg-red-900/20 border-red-700/30 text-red-200"
            : "bg-red-50/80 border-red-200/50 text-red-700"
        } shadow-lg`}>
          <div className="flex items-center space-x-2">
            <AlertCircle size={16} />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Committees List */}
      {loading && !showCreateForm ? (
        <div className={`flex justify-center items-center h-32 rounded-lg backdrop-blur-xl border ${
          isDarkMode 
            ? "bg-gray-800/50 border-gray-700/50" 
            : "bg-white/70 border-gray-200/50"
        } shadow-lg`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto mb-2"></div>
            <p className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              Loading...
            </p>
          </div>
        </div>
      ) : (
        <CommitteeList
          key={refreshKey}
          committees={committees}
          onCommitteeUpdated={handleCommitteeUpdated}
        />
      )}
    </div>
  );
};

export default CommitteeManagement;
