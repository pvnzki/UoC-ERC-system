import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
import BeatLoader from "../../common/BeatLoader";

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

  const modalContent = (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div
        className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-xl"
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
        {/* Header */}
        <div
          className={`flex justify-between items-center p-4 border-b ${
            isDarkMode ? "border-gray-700/50" : "border-gray-200/50"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "bg-blue-900/30 border border-blue-700/50"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <Calendar
                className={`w-5 h-5 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Meeting Details</h2>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {meeting.committee_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meeting Information */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Users
                  className={`w-4 h-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <div>
                  <p
                    className={`text-xs font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Committee
                  </p>
                  <p className="font-medium">{meeting.committee_name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar
                  className={`w-4 h-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <div>
                  <p
                    className={`text-xs font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Meeting Date
                  </p>
                  <p className="font-medium">
                    {new Date(meeting.meeting_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CheckCircle
                  className={`w-4 h-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <div>
                  <p
                    className={`text-xs font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Status
                  </p>
                  <p
                    className={`font-medium ${getStatusColor(meeting.status)}`}
                  >
                    {meeting.status}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start space-x-3">
                <FileText
                  className={`w-4 h-4 mt-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <div>
                  <p
                    className={`text-xs font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Agenda
                  </p>
                  <p className="text-sm">
                    {meeting.agenda || "No agenda specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div
            className={`border-t pt-4 ${
              isDarkMode ? "border-gray-700/50" : "border-gray-200/50"
            }`}
          >
            <h3
              className={`text-md font-medium mb-3 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Applications
            </h3>

            {loading ? (
              <BeatLoader />
            ) : applications.length === 0 ? (
              <p
                className={`text-center py-6 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No applications for this meeting
              </p>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.applicationId}
                    className={`p-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700/50 border border-gray-600/50"
                        : "bg-gray-50/50 border border-gray-200/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          Application #{app.applicationId}
                        </h4>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {app.applicantName} - {app.researchType}
                        </p>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {app.category}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`font-medium text-sm ${getDecisionColor(
                            app.decision
                          )}`}
                        >
                          {app.decision}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              isDarkMode
                                ? "bg-green-700/50 text-green-200 hover:bg-green-600/50"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                            onClick={() =>
                              handleDecisionChange(
                                app.applicationId,
                                "APPROVED"
                              )
                            }
                          >
                            Approve
                          </button>
                          <button
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              isDarkMode
                                ? "bg-red-700/50 text-red-200 hover:bg-red-600/50"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                            onClick={() =>
                              handleDecisionChange(
                                app.applicationId,
                                "REJECTED"
                              )
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          {applications.length > 0 && (
            <div
              className={`border-t pt-4 ${
                isDarkMode ? "border-gray-700/50" : "border-gray-200/50"
              }`}
            >
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-gray-200 hover:bg-gray-700/50"
                      : "text-gray-600 hover:text-gray-700 hover:bg-gray-100/50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRatifyDecisions}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode
                      ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600"
                      : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Ratify Decisions"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default MeetingDetailsModal;
