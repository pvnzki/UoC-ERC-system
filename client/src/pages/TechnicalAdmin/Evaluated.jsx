import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import pdf from "../../assets/TechnicalAdmin/Group 4.png";
import { adminServices } from "../../../services/admin-services";
import BeatLoader from "../../components/common/BeatLoader";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

const EvaluatedApplicationDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Fetch application details and documents using the ID from useParams
    const fetchApplicationData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await adminServices.getApplication(id);
        setApplicationDetails(response.application || response);

        // If documents are included in the response, use them
        if (response.documents) {
          setDocuments(response.documents);
        } else {
          // Fallback to basic document structure if not provided
          setDocuments([
            {
              id: 1,
              name: "Research Proposal",
              fileName: "research-proposal.pdf",
              status: "Approved",
            },
            {
              id: 2,
              name: "CV/Resume",
              fileName: "cv.pdf",
              status: "Approved",
            },
            {
              id: 3,
              name: "Payment Receipt",
              fileName: "payment-receipt.pdf",
              status: "Approved",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching application details:", error);
        setError("Failed to load application details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplicationData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BeatLoader />
          <p className="text-lg text-gray-600">
            Loading application details...
          </p>
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
        </div>
      </div>
    );
  }

  if (!applicationDetails) {
    return (
      <div className="text-center text-lg font-semibold p-6">
        Application not found
      </div>
    );
  }

  const hasRejectedDocuments = documents.some(
    (doc) => doc.status === "Rejected"
  );

  return (
    <div className="w-full bg-gray-100 p-6 rounded-lg shadow-md overflow-y-auto h-screen pb-20">
      <Card>
        <h2 className="text-xl font-semibold mb-2">Applicant Details</h2>
        <div className="border-b pb-4 mb-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p>
              <strong>User Name:</strong>{" "}
              {applicationDetails.applicant
                ? `${applicationDetails.applicant.first_name || ""} ${
                    applicationDetails.applicant.last_name || ""
                  }`.trim()
                : "N/A"}
            </p>
            <p>
              <strong>User ID:</strong>{" "}
              {applicationDetails.applicant?.applicant_id ||
                applicationDetails.application_id ||
                "N/A"}
            </p>
            <p>
              <strong>User Email:</strong>{" "}
              {applicationDetails.applicant?.email || "N/A"}
            </p>
            <p>
              <strong>Application Category:</strong>{" "}
              {applicationDetails.research_category ||
                applicationDetails.category ||
                "N/A"}
            </p>
            <p>
              <strong>Research Type:</strong>{" "}
              {applicationDetails.research_type || "N/A"}
            </p>
          </div>
          <div>
            <p>
              <strong>Apply Date:</strong>{" "}
              {applicationDetails.created_at
                ? new Date(applicationDetails.created_at).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Apply Time:</strong>{" "}
              {applicationDetails.created_at
                ? new Date(applicationDetails.created_at).toLocaleTimeString()
                : "N/A"}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-3">Documents</h2>
        <div className="space-y-3 p-2 px-10">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-1 px-10 border-2 border-gray-300 rounded-3xl bg-gray-50"
            >
              <p className="font-medium text-lg w-32 border-r-2 border-r-gray-300 mr-10">
                {doc.name}
              </p>
              <div className="text-xs font-medium px-2 py-1 rounded-md pl-10">
                <a
                  href={`/path/to/${doc.fileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={pdf} className="w-10 h-10 cursor-pointer" />
                </a>
              </div>
              <p className="text-md text-gray-500 flex-1 truncate ml-3">
                <a
                  href={`/path/to/${doc.fileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-600"
                >
                  {doc.fileName}
                </a>
              </p>
              <div
                className={`px-4 py-1 rounded-full text-white text-sm font-semibold ${
                  doc.status === "Approved" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {doc.status}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-lg font-semibold">
          {hasRejectedDocuments ? (
            <p className="text-red-600">
              Returned to the applicant for resubmission
            </p>
          ) : (
            <p className="text-green-600">
              Successfully forwarded to ERC technical committee
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EvaluatedApplicationDetails;
