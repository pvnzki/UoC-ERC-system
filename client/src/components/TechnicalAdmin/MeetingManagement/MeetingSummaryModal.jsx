import React from "react";
import {
  X,
  FileText,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

const MeetingSummaryModal = ({ isOpen, onClose, summary }) => {
  if (!isOpen || !summary) return null;

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

  const getDecisionIcon = (decision) => {
    switch (decision) {
      case "APPROVED":
        return <CheckCircle size={16} className="text-green-600" />;
      case "REJECTED":
        return <XCircle size={16} className="text-red-600" />;
      case "REVISE":
        return <RefreshCw size={16} className="text-yellow-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Meeting Summary</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Meeting Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center space-x-3">
            <Users className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-500">Committee</p>
              <p className="font-semibold text-gray-800">
                {summary.committeeName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-500">Meeting Date</p>
              <p className="font-semibold text-gray-800">
                {new Date(summary.meetingDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FileText className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-500">Total Applications</p>
              <p className="font-semibold text-gray-800">
                {summary.totalApplications}
              </p>
            </div>
          </div>
        </div>

        {/* Decision Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Decision Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {summary.decisions.APPROVED || 0}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {summary.decisions.REJECTED || 0}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {summary.decisions.REVISE || 0}
              </div>
              <div className="text-sm text-gray-600">Revise</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {summary.decisions.PENDING || 0}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Applications</h3>
          {summary.applications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No applications for this meeting
            </p>
          ) : (
            <div className="space-y-3">
              {summary.applications.map((app) => (
                <div
                  key={app.applicationId}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getDecisionIcon(app.decision)}
                        <h4 className="font-semibold">
                          Application #{app.applicationId}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Applicant:</span>{" "}
                        {app.applicantName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Research Type:</span>{" "}
                        {app.researchType}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Application Type:</span>{" "}
                        {app.applicationType}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-semibold ${getDecisionColor(
                          app.decision
                        )}`}
                      >
                        {app.decision}
                      </span>
                      {app.ratified && (
                        <div className="text-xs text-green-600 mt-1">
                          ✓ Ratified
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6 pt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingSummaryModal;
