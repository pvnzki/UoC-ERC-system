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

const MeetingDetailsModal = ({ isOpen, onClose, meeting, onUpdate }) => {
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
        return "text-green-600";
      case "IN_PROGRESS":
        return "text-yellow-600";
      case "SCHEDULED":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getDecisionColor = (decision) => {
    switch (decision) {
      case "APPROVED":
        return "text-green-600";
      case "REJECTED":
        return "text-red-600";
      case "REVISE":
        return "text-yellow-600";
      case "PENDING":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  if (!isOpen || !meeting) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Meeting Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Meeting Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Users className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Committee</p>
                <p className="font-semibold text-gray-800">
                  {meeting.committee_name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Meeting Date</p>
                <p className="font-semibold text-gray-800">
                  {new Date(meeting.meeting_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CheckCircle className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p
                  className={`font-semibold ${getStatusColor(meeting.status)}`}
                >
                  {meeting.status}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-start space-x-3">
              <FileText className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Agenda</p>
                <p className="text-gray-800">
                  {meeting.agenda || "No agenda specified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Applications</h3>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : applications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No applications for this meeting
            </p>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.applicationId}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">
                        Application #{app.applicationId}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {app.applicantName} - {app.researchType}
                      </p>
                      <p className="text-sm text-gray-500">
                        Current Decision:{" "}
                        <span className={getDecisionColor(app.decision)}>
                          {app.decision}
                        </span>
                      </p>
                    </div>

                    <div className="ml-4">
                      <select
                        value={decisions[app.applicationId] || app.decision}
                        onChange={(e) =>
                          handleDecisionChange(
                            app.applicationId,
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="REVISE">Revise</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          {applications.length > 0 && (
            <button
              onClick={handleRatifyDecisions}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Ratifying...
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="mr-2" />
                  Ratify Decisions
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsModal;
