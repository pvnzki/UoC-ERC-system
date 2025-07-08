import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import ApplicationList from "../../components/OfficeStaff/ApplicationList/ApplicationList.jsx";
import { officeStaffServices } from "../../../services/office-staff-services";
import BeatLoader from "../../components/common/BeatLoader";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await officeStaffServices.getApplications({ limit: 50 });
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
  const statusMap = {
    DRAFT: "Draft",
    SUBMITTED: "Submitted",
    DOCUMENT_CHECK: "Checked",
    RETURNED_FOR_RESUBMISSION: "Returned",
    PRELIMINARY_REVIEW: "Forwarded",
    ERC_REVIEW: "ERC Review",
    CTSC_REVIEW: "CTSC Review",
    ARWC_REVIEW: "ARWC Review",
    EXPEDITED_APPROVED: "Expedited Approved",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  };
  const transformedData = applications.map((app) => ({
    id: app.application_id?.toString() || app.id?.toString() || "N/A",
    applicantId: app.applicant?.applicant_id?.toString() || "N/A",
    name: app.applicant?.user
      ? `${app.applicant.user.first_name || ""} ${
          app.applicant.user.last_name || ""
        }`.trim() || "Unknown Applicant"
      : "Unknown Applicant",
    date: app.submission_date
      ? new Date(app.submission_date).toLocaleString()
      : "N/A",
    category:
      app.application_type || app.research_type || app.category || "N/A",
    status: statusMap[app.status] || app.status || "Pending",
  }));

  return <ApplicationList data={transformedData} />;
};

export default Applications;
