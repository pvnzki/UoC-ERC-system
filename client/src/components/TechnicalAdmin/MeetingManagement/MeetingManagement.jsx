import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { adminServices } from "../../../../services/admin-services";
import MeetingDetailsModal from "./MeetingDetailsModal";
import MeetingSummaryModal from "./MeetingSummaryModal";
import LetterModal from "./LetterModal";
import { useTheme } from "../../../context/theme/ThemeContext";

const MeetingManagement = () => {
  const { isDarkMode } = useTheme();
  const [meetings, setMeetings] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const [newMeeting, setNewMeeting] = useState({
    committee_id: "",
    meeting_date: "",
    agenda: "",
    applicationIds: [],
  });

  const fetchCommittees = async () => {
    try {
      const committeesData = await adminServices.getCommittees();
      setCommittees(committeesData);
    } catch (err) {
      console.error("Failed to load committees:", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await adminServices.getApplications();
      console.log("Applications response:", response);

      // The backend returns { total, totalPages, currentPage, applications }
      // We need to extract the applications array
      const applicationsArray = response.applications || [];
      console.log("Applications array:", applicationsArray);

      setApplications(applicationsArray);
    } catch (err) {
      console.error("Failed to load applications:", err);
      setApplications([]); // Set empty array on error
    }
  };

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const meetingsData = await adminServices.getMeetings();
      setMeetings(meetingsData);
      setError(null);
    } catch (err) {
      setError("Failed to load meetings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittees();
    fetchApplications();
    fetchMeetings();
  }, []);

  const resetForm = () => {
    setNewMeeting({
      committee_id: "",
      meeting_date: "",
      agenda: "",
      applicationIds: [],
    });
  };

  const handleCreateMeeting = async (meetingData) => {
    try {
      setLoading(true);
      await adminServices.createMeeting(meetingData);
      fetchMeetings();
      setShowCreateForm(false);
      resetForm();
      toast.success("Meeting created successfully");
    } catch (err) {
      setError("Failed to create meeting");
      console.error(err);
      toast.error("Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleRatifyDecisions = async (meetingId, decisionsData) => {
    try {
      setLoading(true);
      await adminServices.ratifyDecisions(meetingId, decisionsData);
      toast.success("Decisions ratified successfully");
    } catch (err) {
      setError("Failed to ratify decisions");
      console.error(err);
      toast.error("Failed to ratify decisions");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async (meetingId) => {
    try {
      setLoading(true);
      const summary = await adminServices.generateMeetingSummary({ meetingId });
      if (summary && summary.length > 0) {
        const meetingSummary = summary.find((s) => s.meetingId === meetingId);
        if (meetingSummary) {
          setSelectedSummary(meetingSummary);
          setShowSummaryModal(true);
        }
      }
      toast.success("Meeting summary generated successfully");
    } catch (err) {
      setError("Failed to generate meeting summary");
      console.error(err);
      toast.error("Failed to generate meeting summary");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLetter = async (applicationId) => {
    try {
      setLoading(true);
      const letter = await adminServices.generateLetter(applicationId);
      setSelectedLetter(letter);
      setSelectedApplicationId(applicationId);
      setShowLetterModal(true);
      toast.success("Letter generated successfully");
    } catch (err) {
      setError("Failed to generate letter");
      console.error(err);
      toast.error("Failed to generate letter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Meeting Management
        </h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={`px-4 py-2 rounded-lg transition ${
            isDarkMode
              ? "bg-blue-700 text-white hover:bg-blue-800"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {showCreateForm ? "Cancel" : "Create Meeting"}
        </button>
      </div>

      {error && (
        <div
          className={`border-l-4 p-4 mb-6 rounded ${
            isDarkMode
              ? "bg-red-900/30 border-red-700 text-red-200"
              : "bg-red-100 border-red-500 text-red-700"
          }`}
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {showCreateForm && (
        <div
          className={`p-6 rounded-lg shadow-md mb-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Create New Meeting
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateMeeting(newMeeting);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Committee
                </label>
                <select
                  value={newMeeting.committee_id}
                  onChange={(e) =>
                    setNewMeeting({
                      ...newMeeting,
                      committee_id: e.target.value,
                    })
                  }
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                >
                  <option value="">Select Committee</option>
                  {committees.map((committee) => (
                    <option
                      key={committee.committee_id}
                      value={committee.committee_id}
                    >
                      {committee.committee_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Meeting Date
                </label>
                <input
                  type="date"
                  value={newMeeting.meeting_date}
                  onChange={(e) =>
                    setNewMeeting({
                      ...newMeeting,
                      meeting_date: e.target.value,
                    })
                  }
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Agenda
              </label>
              <textarea
                value={newMeeting.agenda}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, agenda: e.target.value })
                }
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                rows="4"
                placeholder="Meeting agenda"
                required
              />
            </div>

            <div className="mt-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Applications to Review (Optional)
              </label>
              <select
                multiple
                value={newMeeting.applicationIds}
                onChange={(e) => {
                  const selectedOptions = Array.from(
                    e.target.selectedOptions,
                    (option) => parseInt(option.value)
                  );
                  setNewMeeting({
                    ...newMeeting,
                    applicationIds: selectedOptions,
                  });
                }}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                size="4"
              >
                {Array.isArray(applications) &&
                  applications.map((app) => (
                    <option key={app.application_id} value={app.application_id}>
                      #{app.application_id} - {app.research_type} ({app.status})
                    </option>
                  ))}
              </select>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Hold Ctrl (or Cmd on Mac) to select multiple applications
              </p>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className={`px-4 py-2 rounded-md transition ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md transition ${
                  isDarkMode
                    ? "bg-blue-700 text-white hover:bg-blue-800"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Meeting"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !showCreateForm ? (
        <div className="flex justify-center items-center h-64">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
              isDarkMode ? "border-blue-400" : "border-blue-500"
            }`}
          ></div>
        </div>
      ) : (
        <div
          className={`rounded-lg shadow-md p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Committee Meetings
          </h2>
          {meetings.length === 0 ? (
            <p
              className={`text-center py-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No meetings scheduled
            </p>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting.meeting_id}
                  className={`border rounded-lg p-4 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className={`font-semibold text-lg ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {meeting.committee_name}
                      </h3>
                      <p
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {new Date(meeting.meeting_date).toLocaleDateString()}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Status:{" "}
                        <span
                          className={`font-medium ${
                            meeting.status === "COMPLETED"
                              ? isDarkMode
                                ? "text-green-400"
                                : "text-green-600"
                              : meeting.status === "IN_PROGRESS"
                              ? isDarkMode
                                ? "text-yellow-300"
                                : "text-yellow-600"
                              : isDarkMode
                              ? "text-blue-400"
                              : "text-blue-600"
                          }`}
                        >
                          {meeting.status}
                        </span>
                      </p>
                      {meeting.agenda && (
                        <p
                          className={`text-sm mt-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Agenda: {meeting.agenda.substring(0, 100)}
                          {meeting.agenda.length > 100 ? "..." : ""}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleGenerateSummary(meeting.meeting_id)
                        }
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          isDarkMode
                            ? "bg-green-700 text-white hover:bg-green-600"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        Generate Summary
                      </button>
                      <button
                        onClick={() => setSelectedMeeting(meeting)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          isDarkMode
                            ? "bg-blue-700 text-white hover:bg-blue-600"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Meeting Details Modal */}
      <MeetingDetailsModal
        isOpen={!!selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
        meeting={selectedMeeting}
        onUpdate={fetchMeetings}
      />

      {/* Meeting Summary Modal */}
      <MeetingSummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        summary={selectedSummary}
      />

      {/* Letter Modal */}
      <LetterModal
        isOpen={showLetterModal}
        onClose={() => setShowLetterModal(false)}
        letter={selectedLetter}
        applicationId={selectedApplicationId}
      />
    </div>
  );
};

export default MeetingManagement;
