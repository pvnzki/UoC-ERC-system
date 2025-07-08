import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/theme/ThemeContext";
import { officeStaffServices } from "../../../../services/office-staff-services";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Forward,
  RotateCcw,
  Download,
  Eye,
  Info,
  CheckSquare,
  FileText,
  FileImage,
  File,
} from "lucide-react";
import defaultProfile from "../../../assets/default-profile.png";
import ReturnForwardModal from "./ReturnForwardModal";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isForwarded, setIsForwarded] = useState(false);
  const [isReturned, setIsReturned] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState({});
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [hoveredDocId, setHoveredDocId] = useState(null);
  const docTextRefs = useRef({});
  // Add state for dialogs/modals
  const [showMarkCheckedConfirm, setShowMarkCheckedConfirm] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await officeStaffServices.getApplication(id);
        setApplicationDetails(data);

        // Set initial states based on current status
        if (data.status === "DOCUMENT_CHECK") {
          setIsChecked(true);
        } else if (
          [
            "PRELIMINARY_REVIEW",
            "ERC_REVIEW",
            "CTSC_REVIEW",
            "ARWC_REVIEW",
          ].includes(data.status)
        ) {
          setIsForwarded(true);
        } else if (data.status === "RETURNED_FOR_RESUBMISSION") {
          setIsReturned(true);
        }

        // Initialize checkedDocs state when applicationDetails/documents change
        if (data && data.documents) {
          const initialChecked = {};
          data.documents.forEach((doc) => {
            initialChecked[doc.document_id] = false;
          });
          setCheckedDocs(initialChecked);
        }
      } catch (err) {
        console.error("Error fetching application details:", err);
        setError("Failed to load application details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleMarkChecked = async () => {
    try {
      setActionLoading(true);
      await officeStaffServices.markChecked(id);
      setIsChecked(true);
      // Refresh application details to get updated status
      const data = await officeStaffServices.getApplication(id);
      setApplicationDetails(data);
    } catch (err) {
      console.error("Error marking as checked:", err);
      alert("Failed to mark as checked. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleForward = async () => {
    try {
      setActionLoading(true);
      await officeStaffServices.markOutcome(id, "forward");
      setIsForwarded(true);
      // Refresh application details
      const data = await officeStaffServices.getApplication(id);
      setApplicationDetails(data);
    } catch (err) {
      console.error("Error forwarding application:", err);
      alert("Failed to forward application. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!returnReason.trim()) {
      alert("Please provide a reason for return");
      return;
    }
    try {
      setActionLoading(true);
      await officeStaffServices.markOutcome(id, "return");
      await officeStaffServices.sendReturnEmail(id, returnReason);
      setIsReturned(true);
      setEmailSent(true);
      // Refresh application details
      const data = await officeStaffServices.getApplication(id);
      setApplicationDetails(data);
    } catch (err) {
      console.error("Error returning application:", err);
      alert("Failed to return application or send email. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Document checking handlers
  const handleCheckDocument = (docId) => {
    setCheckedDocs((prev) => ({ ...prev, [docId]: !prev[docId] }));
  };

  const handleCheckAllDocuments = () => {
    if (!applicationDetails?.documents) return;
    const allChecked = applicationDetails.documents.every(
      (doc) => checkedDocs[doc.document_id]
    );
    const newChecked = {};
    applicationDetails.documents.forEach((doc) => {
      newChecked[doc.document_id] = !allChecked;
    });
    setCheckedDocs(newChecked);
  };

  const checkedCount =
    applicationDetails?.documents?.filter((doc) => checkedDocs[doc.document_id])
      .length || 0;
  const totalDocs = applicationDetails?.documents?.length || 0;
  const allDocsChecked = totalDocs > 0 && checkedCount === totalDocs;

  // Helper to determine file type
  const getFileType = (filePath) => {
    if (!filePath) return "other";
    const ext = filePath.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext))
      return "image";
    if (["pdf"].includes(ext)) return "pdf";
    return "other";
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      DRAFT: { label: "Draft", color: "bg-gray-500" },
      SUBMITTED: { label: "Submitted", color: "bg-blue-500" },
      DOCUMENT_CHECK: { label: "Document Check", color: "bg-yellow-500" },
      RETURNED_FOR_RESUBMISSION: { label: "Returned", color: "bg-red-500" },
      PRELIMINARY_REVIEW: {
        label: "Preliminary Review",
        color: "bg-green-500",
      },
      ERC_REVIEW: { label: "ERC Review", color: "bg-purple-500" },
      CTSC_REVIEW: { label: "CTSC Review", color: "bg-indigo-500" },
      ARWC_REVIEW: { label: "ARWC Review", color: "bg-pink-500" },
      EXPEDITED_APPROVED: {
        label: "Expedited Approved",
        color: "bg-green-600",
      },
      APPROVED: { label: "Approved", color: "bg-green-600" },
      REJECTED: { label: "Rejected", color: "bg-red-600" },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      color: "bg-gray-500",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  // Toggle switch component
  const ToggleSwitch = ({ checked, onChange, disabled }) => (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/60 border border-transparent
        ${
          checked
            ? isDarkMode
              ? "bg-green-600 shadow-green-400/20"
              : "bg-green-400 shadow-green-200/40"
            : isDarkMode
            ? "bg-gray-700"
            : "bg-gray-300"
        }
        ${checked ? "shadow-md" : ""}
        ${disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-105"}`}
      title={checked ? "Mark as unchecked" : "Mark as checked"}
      style={{
        boxShadow: checked
          ? isDarkMode
            ? "0 0 8px 2px #22c55e33"
            : "0 0 8px 2px #bbf7d0"
          : undefined,
      }}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-out
          ${checked ? "translate-x-5" : "translate-x-1"}`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)", // springy
          boxShadow: checked
            ? isDarkMode
              ? "0 2px 8px 0 #22c55e55"
              : "0 2px 8px 0 #bbf7d0"
            : "0 1px 3px 0 rgba(0,0,0,0.10)",
        }}
      />
    </button>
  );

  if (loading) {
    return (
      <div
        className={`min-h-screen w-full px-4 py-6 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
        }`}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Loading application details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen w-full px-4 py-6 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
        }`}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!applicationDetails) {
    return (
      <div
        className={`min-h-screen w-full px-4 py-6 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
        }`}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-yellow-500" />
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              No application found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const documents = applicationDetails.documents || [];
  const payment = applicationDetails.payment;
  const applicant = applicationDetails.applicant || {};

  return (
    <React.Fragment>
      {/* Confirmation Dialog for Mark as Checked */}
      {showMarkCheckedConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className={`w-full max-w-sm p-0 rounded-3xl border border-white/30 shadow-2xl transition-all duration-300 relative overflow-hidden ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/95 border-gray-700/60"
                : "bg-gradient-to-br from-white/90 via-blue-50/80 to-white/95 border-gray-200/60"
            }`}
            style={{
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: isDarkMode
                ? "0 8px 32px 0 rgba(31, 38, 135, 0.25)"
                : "0 8px 32px 0 rgba(60, 60, 120, 0.10)",
            }}
          >
            <div className="flex flex-col items-center p-6 gap-4">
              <CheckCircle className="w-14 h-14 mb-2 text-blue-500 drop-shadow-lg" />
              <h3
                className={`text-2xl font-bold mb-1 tracking-tight ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Mark as Checked?
              </h3>
              <p
                className={`mb-4 text-center text-base ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Are you sure you want to mark this application as{" "}
                <span className="font-semibold text-blue-500">checked</span>?
                This action cannot be undone.
              </p>
              <div className="flex w-full justify-center gap-4 mt-2">
                <button
                  onClick={() => setShowMarkCheckedConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-md hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-lg transition-all font-medium backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-300/30"
                  title="Cancel and close this dialog"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowMarkCheckedConfirm(false);
                    setShowActionModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-500/60 text-white font-semibold shadow-md hover:bg-blue-500/80 hover:shadow-lg transition-all border border-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-400/40 backdrop-blur"
                  title="Confirm and proceed"
                >
                  Yes, Mark as Checked
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Action Modal: Forward or Return */}
      <ReturnForwardModal
        open={showActionModal}
        isDarkMode={isDarkMode}
        actionLoading={actionLoading}
        actionError={actionError}
        onForward={async () => {
          setActionLoading(true);
          setActionError("");
          try {
            // Use the backend integration for forwarding
            await officeStaffServices.forwardApplication(id);
            setIsChecked(true);
            setIsForwarded(true);
            setShowActionModal(false);
            // Refresh application details
            const data = await officeStaffServices.getApplication(id);
            setApplicationDetails(data);
          } catch (err) {
            setActionError("Failed to forward application. Please try again.");
          } finally {
            setActionLoading(false);
          }
        }}
        onReturn={async () => {
          if (!returnReason.trim()) return;
          setActionLoading(true);
          setActionError("");
          try {
            // Use the backend integration for returning
            await officeStaffServices.returnApplication(id, returnReason);
            setIsChecked(true);
            setIsReturned(true);
            setEmailSent(true);
            setShowActionModal(false);
            // Refresh application details
            const data = await officeStaffServices.getApplication(id);
            setApplicationDetails(data);
          } catch (err) {
            setActionError("Failed to return application. Please try again.");
          } finally {
            setActionLoading(false);
          }
        }}
        onCancel={() => setShowActionModal(false)}
        returnReason={returnReason}
        setReturnReason={setReturnReason}
      />
      {/* Main content */}
      <div
        className={`min-h-screen w-full px-4 py-6 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
        }`}
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <div className={`w-full max-w-7xl mx-auto px-2 space-y-4`}>
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 rounded-2xl shadow-xl border transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-900/70 border-gray-700/60 backdrop-blur-lg"
                : "bg-white/80 border-gray-200/60 backdrop-blur-lg"
            }`}
            style={{
              boxShadow: isDarkMode
                ? "0 4px 16px 0 rgba(31, 38, 135, 0.18)"
                : "0 4px 16px 0 rgba(60, 60, 120, 0.06)",
            }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/officestaff/applications")}
                title="Back to Applications"
                className={`p-1.5 rounded-full transition-all duration-300 shadow hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400/60 ${
                  isDarkMode
                    ? "hover:bg-gray-800/70 text-gray-300 hover:text-white"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1
                className={`text-xl font-bold tracking-tight ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Application Details
              </h1>
              <span
                className={`ml-2 text-xs font-medium px-2 py-1 rounded ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                #{applicationDetails.application_id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(applicationDetails.status)}
            </div>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Applicant Information */}
            <div
              className={`p-5 rounded-2xl shadow-xl border transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-900/70 border-gray-700/60 backdrop-blur-lg"
                  : "bg-white/80 border-gray-200/60 backdrop-blur-lg"
              }`}
              style={{
                boxShadow: isDarkMode
                  ? "0 2px 8px 0 rgba(31, 38, 135, 0.10)"
                  : "0 2px 8px 0 rgba(60, 60, 120, 0.03)",
              }}
            >
              <h2
                className={`text-lg font-semibold mb-3 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Applicant Information
              </h2>
              <div className="flex items-center gap-4 border-b pb-4 mb-3 border-gray-300 dark:border-gray-700">
                <img
                  src={defaultProfile}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 shadow"
                />
                <div>
                  <h3
                    className={`text-base font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {applicant.user?.first_name || ""}{" "}
                    {applicant.user?.last_name || ""}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {applicant.user?.email || "N/A"}
                  </p>
                </div>
              </div>
              <div
                className={`grid grid-cols-1 gap-2 text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <div>
                  <span className="font-semibold">Application ID:</span>{" "}
                  {applicationDetails.application_id}
                </div>
                <div>
                  <span className="font-semibold">Applicant ID:</span>{" "}
                  {applicant.applicant_id}
                </div>
                <div>
                  <span className="font-semibold">Category:</span>{" "}
                  {applicant.applicant_category}
                </div>
                <div>
                  <span className="font-semibold">Research Type:</span>{" "}
                  {applicationDetails.research_type}
                </div>
                <div>
                  <span className="font-semibold">Application Type:</span>{" "}
                  {applicationDetails.application_type}
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div
              className={`p-5 rounded-2xl shadow-xl border transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-900/70 border-gray-700/60 backdrop-blur-lg"
                  : "bg-white/80 border-gray-200/60 backdrop-blur-lg"
              }`}
              style={{
                boxShadow: isDarkMode
                  ? "0 2px 8px 0 rgba(31, 38, 135, 0.10)"
                  : "0 2px 8px 0 rgba(60, 60, 120, 0.03)",
              }}
            >
              <h2
                className={`text-lg font-semibold mb-3 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Application Details
              </h2>
              <div
                className={`grid grid-cols-1 gap-2 text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <div>
                  <span className="font-semibold">Submission Date:</span>{" "}
                  {applicationDetails.submission_date
                    ? new Date(
                        applicationDetails.submission_date
                      ).toLocaleDateString()
                    : "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Submission Time:</span>{" "}
                  {applicationDetails.submission_date
                    ? new Date(
                        applicationDetails.submission_date
                      ).toLocaleTimeString()
                    : "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Last Updated:</span>{" "}
                  {applicationDetails.last_updated
                    ? new Date(applicationDetails.last_updated).toLocaleString()
                    : "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Expiry Date:</span>{" "}
                  {applicationDetails.expiry_date
                    ? new Date(
                        applicationDetails.expiry_date
                      ).toLocaleDateString()
                    : "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Is Extension:</span>{" "}
                  {applicationDetails.is_extension ? "Yes" : "No"}
                </div>
              </div>
              {payment && (
                <div
                  className={`mt-4 space-y-1 text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <div>
                    <span className="font-semibold">Payment Amount:</span> $
                    {payment.amount}
                  </div>
                  <div>
                    <span className="font-semibold">Payment Status:</span>{" "}
                    {payment.payment_status}
                  </div>
                  <div>
                    <span className="font-semibold">Payment Date:</span>{" "}
                    {payment.payment_date
                      ? new Date(payment.payment_date).toLocaleString()
                      : "N/A"}
                  </div>
                  {payment.payment_evidence && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Payment Evidence:</span>
                      <a
                        href={payment.payment_evidence}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          isDarkMode
                            ? "bg-blue-600/20 text-blue-300 hover:bg-blue-600/30"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        }`}
                      >
                        <Download className="w-3 h-3" />
                        View
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div
            className={`p-5 rounded-2xl shadow-xl border transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-900/70 border-gray-700/60 backdrop-blur-lg"
                : "bg-white/80 border-gray-200/60 backdrop-blur-lg"
            }`}
            style={{
              boxShadow: isDarkMode
                ? "0 2px 8px 0 rgba(31, 38, 135, 0.10)"
                : "0 2px 8px 0 rgba(60, 60, 120, 0.03)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Documents ({totalDocs})
              </h2>
              {totalDocs > 0 && (
                <button
                  onClick={handleCheckAllDocuments}
                  className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-all duration-200 shadow-sm border ${
                    allDocsChecked
                      ? isDarkMode
                        ? "bg-green-700/80 text-white border-green-700"
                        : "bg-green-100 text-green-700 border-green-300"
                      : isDarkMode
                      ? "bg-blue-700/80 text-white border-blue-700 hover:bg-blue-800"
                      : "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                  }`}
                  title={
                    allDocsChecked
                      ? "Uncheck all documents"
                      : "Mark all as checked"
                  }
                  disabled={isChecked}
                >
                  <CheckSquare className="w-4 h-4" />
                  {allDocsChecked ? "Uncheck All" : "Check All Documents"}
                </button>
              )}
            </div>
            <div className="mb-2">
              <span
                className={`block mb-1 text-xs font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Document Check Progress
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                >
                  {checkedCount} of {totalDocs} checked
                </span>
                <div className="flex-1 h-2 rounded bg-gray-200 dark:bg-gray-700 mx-2 overflow-hidden">
                  <div
                    className="h-2 rounded bg-blue-500 dark:bg-blue-400 transition-all duration-500"
                    style={{
                      width: `${(checkedCount / (totalDocs || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            {totalDocs === 0 ? (
              <p
                className={`text-center py-8 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No documents uploaded
              </p>
            ) : (
              <div className="space-y-3">
                {applicationDetails.documents.map((doc) => {
                  const fileType = getFileType(doc.file_path);
                  return (
                    <div
                      key={doc.document_id}
                      className={`relative flex items-center justify-between p-4 rounded-lg border transition-all duration-200 group hover:shadow-lg hover:scale-[1.01] ${
                        isDarkMode
                          ? "bg-gray-700/50 border-gray-600/30"
                          : "bg-gray-50/80 border-gray-200/50"
                      }`}
                    >
                      {/* Glassmorphic Tooltip Preview */}
                      {hoveredDocId === doc.document_id && (
                        <div
                          className={`absolute left-0 bottom-full mb-2 z-50 min-w-[180px] max-w-xs p-3 rounded-xl shadow-2xl border transition-all duration-150 animate-fade-in flex flex-col items-center
                            ${
                              isDarkMode
                                ? "bg-gray-900/95 border-gray-700/80"
                                : "bg-white/95 border-gray-200/90"
                            }`}
                          style={{
                            pointerEvents: "none",
                            opacity: 0.98,
                            backdropFilter: "blur(18px)",
                            WebkitBackdropFilter: "blur(18px)",
                            boxShadow: isDarkMode
                              ? "0 8px 32px 0 rgba(31, 38, 135, 0.35)"
                              : "0 8px 32px 0 rgba(60, 60, 120, 0.18)",
                          }}
                        >
                          <div className="flex flex-col items-center justify-center">
                            {fileType === "image" ? (
                              <>
                                <FileImage className="w-8 h-8 text-blue-400 mb-0.5" />
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-300">
                                  Image File
                                </span>
                              </>
                            ) : fileType === "pdf" ? (
                              <>
                                <FileText className="w-8 h-8 text-red-500 mb-0.5" />
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-300">
                                  PDF File
                                </span>
                              </>
                            ) : (
                              <>
                                <File className="w-8 h-8 text-blue-400 mb-0.5" />
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-300">
                                  {doc.document_type}
                                </span>
                              </>
                            )}
                            <span
                              className={`text-xs text-center ${
                                isDarkMode ? "text-gray-200" : "text-gray-700"
                              }`}
                            >
                              {doc.file_path?.split("/").pop()}
                            </span>
                          </div>
                          {/* Arrow pointing down to the text */}
                          <div className="absolute left-6 -bottom-2 w-4 h-4 overflow-hidden">
                            <div
                              className={`w-4 h-4 rotate-45 ${
                                isDarkMode
                                  ? "bg-gray-900/95 border-l border-b border-gray-700/80"
                                  : "bg-white/95 border-l border-b border-gray-200/90"
                              }`}
                            ></div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 relative">
                        <ToggleSwitch
                          checked={!!checkedDocs[doc.document_id]}
                          onChange={() => handleCheckDocument(doc.document_id)}
                          disabled={isChecked}
                        />
                        <div
                          className={`p-2 rounded-lg ${
                            isDarkMode ? "bg-gray-600/50" : "bg-gray-200"
                          }`}
                        >
                          <Download
                            className={`w-5 h-5 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p
                            className={`font-medium relative ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                            onMouseEnter={() =>
                              setHoveredDocId(doc.document_id)
                            }
                            onMouseLeave={() => setHoveredDocId(null)}
                            style={{
                              display: "inline-block",
                              cursor: "pointer",
                            }}
                          >
                            {doc.document_type}
                            {doc.is_mandatory && (
                              <span
                                className="ml-2 align-middle"
                                title="Required document"
                              >
                                <Info className="inline w-4 h-4 text-red-400 dark:text-red-300" />
                              </span>
                            )}
                          </p>
                          <p
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Uploaded:{" "}
                            {doc.upload_date
                              ? new Date(doc.upload_date).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            checkedDocs[doc.document_id]
                              ? isDarkMode
                                ? "bg-green-700/70 text-white"
                                : "bg-green-100 text-green-700"
                              : isDarkMode
                              ? "bg-gray-700/60 text-gray-300"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {checkedDocs[doc.document_id]
                            ? "Checked"
                            : "Unchecked"}
                        </span>
                        <a
                          href={doc.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group-hover:scale-105 group-hover:shadow ${
                            isDarkMode
                              ? "bg-blue-600/20 text-blue-300 hover:bg-blue-600/30"
                              : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                          }`}
                          title="View Document"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div
            className={`p-5 rounded-2xl shadow-xl border transition-all duration-300 md:sticky md:top-6 ${
              isDarkMode
                ? "bg-gray-900/70 border-gray-700/60 backdrop-blur-lg"
                : "bg-white/80 border-gray-200/60 backdrop-blur-lg"
            }`}
            style={{
              boxShadow: isDarkMode
                ? "0 2px 8px 0 rgba(31, 38, 135, 0.10)"
                : "0 2px 8px 0 rgba(60, 60, 120, 0.03)",
            }}
          >
            <h2
              className={`text-lg font-semibold mb-3 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Actions
            </h2>

            {/* Prevent forwarding unless all docs checked */}
            {!isChecked && !isForwarded && !isReturned && (
              <div className="text-center">
                <button
                  onClick={() => setShowMarkCheckedConfirm(true)}
                  disabled={actionLoading || !allDocsChecked || isChecked}
                  className={`flex items-center gap-2 mx-auto px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
                    actionLoading || !allDocsChecked || isChecked
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  title={
                    !allDocsChecked
                      ? "Check all documents before proceeding"
                      : isChecked
                      ? "Already marked as checked"
                      : "Mark as Checked"
                  }
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark as Checked
                </button>
                {!allDocsChecked && (
                  <p className="mt-2 text-xs text-red-500">
                    All documents must be checked before marking as checked.
                  </p>
                )}
              </div>
            )}

            {isForwarded && (
              <div
                className={`text-center py-4 ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold text-lg">
                  Successfully forwarded to ERC Technical Committee
                </p>
              </div>
            )}

            {isReturned && (
              <div
                className={`text-center py-4 ${
                  isDarkMode ? "text-red-400" : "text-red-600"
                }`}
              >
                <RotateCcw className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold text-lg">
                  Application returned to applicant for resubmission
                </p>
                {emailSent && (
                  <p className="text-sm mt-2">
                    Email notification sent to applicant.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Return Reason Modal */}
          {showReturnModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div
                className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-900/90 border-gray-700/80"
                    : "bg-white/90 border-gray-200/80"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Reason for Return
                </h3>
                <textarea
                  placeholder="Enter reason for return..."
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className={`w-full p-3 rounded-lg border resize-none mb-4 ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600/30 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                  }`}
                  rows={4}
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowReturnModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReturn}
                    disabled={actionLoading || !returnReason.trim()}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      actionLoading || !returnReason.trim()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin inline" />
                    ) : (
                      "Return"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ApplicationDetails;
