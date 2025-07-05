// src/components/TechnicalAdmin/CommitteeManagement/CommitteeManagement.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CommitteeList from "./CommitteeList";
import CreateCommitteeForm from "./CreateCommitteeForm";
import { adminServices } from "../../../../services/admin-services";

const CommitteeManagement = () => {
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
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Committee Management
        </h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showCreateForm ? "Cancel" : "Create Committee"}
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
        <CreateCommitteeForm onSubmit={handleCreateCommittee} />
      )}

      {loading && !showCreateForm ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
