import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { adminServices } from "../../../../services/admin-services";
import { useTheme } from "../../../context/theme/ThemeContext";

const MeetingDetailsModal = ({ isOpen, onClose, meeting, onUpdate }) => {
  const { isDarkMode } = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [decisions, setDecisions] = useState({});

  useEffect(() => {
    if (isOpen && meeting) {
      fetchMeetingApplications();
    }
  }, [isOpen, meeting]);

  const fetchMeetingApplications = async () => {
    try {
      setLoading(true);
      const summary = await adminServices.generateMeetingSummary({
        meetingId: meeting.meeting_id,
      });

      if (summary && summary.length > 0) {
        const meetingData = summary.find(
          (m) => m.meetingId === meeting.meeting_id
        );
        if (meetingData) {
          setApplications(meetingData.applications || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch meeting applications:", error);
      toast.error("Failed to load meeting applications");
    } finally {
      setLoading(false);
    }
  };

  const handleDecisionChange = (applicationId, decision) => {
    setDecisions((prev) => ({
      ...prev,
      [applicationId]: decision,
    }));
  };

  const handleRatifyDecisions = async () => {
    try {
      setLoading(true);
      const decisionsArray = Object.entries(decisions).map(
        ([applicationId, decision]) => ({
          applicationId: parseInt(applicationId),
          decision,
          comments: `Decision ratified by admin: ${decision}`,
        })
      );

      await adminServices.ratifyDecisions(meeting.meeting_id, {
        decisions: decisionsArray,
      });
      toast.success("Decisions ratified successfully");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to ratify decisions:", error);
      toast.error("Failed to ratify decisions");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return isDarkMode ? "text-green-400" : "text-green-600";
      case "IN_PROGRESS":
        return isDarkMode ? "text-yellow-300" : "text-yellow-600";
      case "SCHEDULED":
        return isDarkMode ? "text-blue-400" : "text-blue-600";
      default:
        return isDarkMode ? "text-gray-300" : "text-gray-600";
    }
  };

  const getDecisionColor = (decision) => {
    switch (decision) {
      case "APPROVED":
        return isDarkMode ? "text-green-400" : "text-green-600";
      case "REJECTED":
        return isDarkMode ? "text-red-400" : "text-red-600";
      case "REVISE":
        return isDarkMode ? "text-yellow-300" : "text-yellow-600";
      case "PENDING":
        return isDarkMode ? "text-gray-300" : "text-gray-600";
      default:
        return isDarkMode ? "text-gray-300" : "text-gray-600";
    }
  };

  if (!isOpen || !meeting) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Meeting Details</h2>
          <button
            onClick={onClose}
            className={`transition-colors rounded p-1 ${isDarkMode ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Meeting Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Users className={isDarkMode ? "text-gray-400" : "text-gray-400"} size={20} />
              <div>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Committee</p>
                <p className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{meeting.committee_name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className={isDarkMode ? "text-gray-400" : "text-gray-400"} size={20} />
              <div>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Meeting Date</p>
                <p className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{new Date(meeting.meeting_date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CheckCircle className={isDarkMode ? "text-gray-400" : "text-gray-400"} size={20} />
              <div>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Status</p>
                <p className={`font-semibold ${getStatusColor(meeting.status)}`}>{meeting.status}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-start space-x-3">
              <FileText className={isDarkMode ? "text-gray-400 mt-1" : "text-gray-400 mt-1"} size={20} />
              <div>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Agenda</p>
                <p className={isDarkMode ? "text-white" : "text-gray-800"}>{meeting.agenda || "No agenda specified"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className={`border-t pt-6 ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Applications</h3>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${isDarkMode ? "border-blue-400" : "border-blue-500"}`}></div>
            </div>
          ) : applications.length === 0 ? (
            <p className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>No applications for this meeting</p>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.applicationId}
                  className={`border rounded-lg p-4 ${isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-white"}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Application #{app.applicationId}</h4>
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{app.applicantName} - {app.researchType}</p>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{app.category}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`font-semibold ${getDecisionColor(app.decision)}`}>{app.decision}</span>
                      <button
                        className={`px-3 py-1 rounded transition-colors text-sm font-medium ${isDarkMode ? "bg-blue-700 text-white hover:bg-blue-800" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                        onClick={() => handleDecisionChange(app.applicationId, "APPROVED")}
                      >
                        Approve
                      </button>
                      <button
                        className={`px-3 py-1 rounded transition-colors text-sm font-medium ${isDarkMode ? "bg-red-700 text-white hover:bg-red-800" : "bg-red-600 text-white hover:bg-red-700"}`}
                        onClick={() => handleDecisionChange(app.applicationId, "REJECTED")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-end mt-6 border-t pt-4 ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md transition-colors ${isDarkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Close
          </button>
          <button
            onClick={handleRatifyDecisions}
            className={`ml-3 px-4 py-2 rounded-md font-semibold transition-colors ${isDarkMode ? "bg-green-700 text-white hover:bg-green-800" : "bg-green-600 text-white hover:bg-green-700"}`}
            disabled={loading}
          >
            Ratify Decisions
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsModal;
