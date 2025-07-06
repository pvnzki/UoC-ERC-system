import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import ApplicationList from "../../components/TechnicalAdmin/ApplicationList/ApplicationList.jsx";
import { adminServices } from "../../../services/admin-services";

const Home = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminServices.getApplications({ limit: 50 });
      setApplications(response.applications || response || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-lg text-gray-600">{error}</p>
          <button
            onClick={fetchApplications}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Transform the data to match the expected format
  const transformedData = applications.map((app) => ({
    id: app.application_id?.toString() || app.id?.toString() || "N/A",
    name: app.applicant
      ? `${app.applicant.first_name || ""} ${
          app.applicant.last_name || ""
        }`.trim()
      : "Unknown Applicant",
    date: app.created_at ? new Date(app.created_at).toLocaleString() : "N/A",
    category: app.research_category || app.category || "N/A",
    status: app.status || "Pending",
  }));

  return <ApplicationList data={transformedData} />;
};

export default Home;
