import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import ApplicationList from "../../components/TechnicalAdmin/ApplicationReview/ApplicationList.jsx";
import { adminServices } from "../../../services/admin-services";
import BeatLoader from "../../components/common/BeatLoader";

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
          <BeatLoader />
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

  // Transform the data to match the expected format for ApplicationReview's ApplicationList
  const transformedApplications = applications.map((app) => ({
    application_id: app.application_id || app.id || "N/A",
    applicant: app.applicant || {
      first_name: "Unknown",
      last_name: "Applicant",
    },
    submission_date: app.created_at || new Date().toISOString(),
    research_type: app.research_category || app.category || "N/A",
    status: app.status || "Pending",
  }));

  // Handler for view action (dummy for now)
  const handleViewApplication = (id) => {
    // You can implement navigation or modal logic here
    // For now, just log
    console.log("View application", id);
  };

  return (
    <ApplicationList
      applications={transformedApplications}
      onViewApplication={handleViewApplication}
    />
  );
};

export default Home;
