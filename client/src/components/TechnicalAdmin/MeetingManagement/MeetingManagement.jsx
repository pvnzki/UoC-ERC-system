import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  Calendar, 
  CalendarPlus, 
  X, 
  AlertTriangle,
  FileText
} from "lucide-react";
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
    <div className="space-y-4">
      {/* Compact Header */}
      <div className={`p-4 rounded-lg backdrop-blur-xl border ${
        isDarkMode 
          ? "bg-gray-800/50 border-gray-700/50 text-white" 
          : "bg-white/70 border-gray-200/50 text-gray-900"
      } shadow-lg`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Meetings
            </h1>
          </div>
          
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              isDarkMode
                ? "bg-orange-600/80 hover:bg-orange-500/80 text-white"
                : "bg-orange-600 hover:bg-orange-700 text-white"
            } shadow-lg hover:shadow-xl`}
          >
            {showCreateForm ? (
              <>
                <X size={16} />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <CalendarPlus size={16} />
                <span>Add Meeting</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Create Meeting Form */}
      {showCreateForm && (
        <div className={`p-4 rounded-lg backdrop-blur-xl border ${
          isDarkMode 
            ? "bg-gray-800/50 border-gray-700/50 text-white" 
            : "bg-white/70 border-gray-200/50 text-gray-900"
        } shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Create New Meeting</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white"
                  : "bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-gray-900"
              }`}
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleCreateMeeting(newMeeting);
          }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
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
                  required
                  className={`w-full p-2 rounded-lg border transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                      : "bg-gray-50/50 border-gray-300/50 text-gray-900 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                  }`}
                >
                  <option value="">Select Committee</option>
                  {committees.map((committee) => (
                    <option key={committee.committee_id} value={committee.committee_id}>
                      {committee.committee_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Meeting Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newMeeting.meeting_date}
                  onChange={(e) =>
                    setNewMeeting({
                      ...newMeeting,
                      meeting_date: e.target.value,
                    })
                  }
                  required
                  className={`w-full p-2 rounded-lg border transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                      : "bg-gray-50/50 border-gray-300/50 text-gray-900 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Agenda
              </label>
              <textarea
                value={newMeeting.agenda}
                onChange={(e) =>
                  setNewMeeting({
                    ...newMeeting,
                    agenda: e.target.value,
                  })
                }
                rows={3}
                className={`w-full p-2 rounded-lg border transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700/50 border-gray-600/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                    : "bg-gray-50/50 border-gray-300/50 text-gray-900 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                }`}
                placeholder="Enter meeting agenda..."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
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
                className={`w-full p-2 border rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700/50 border-gray-600/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                    : "bg-gray-50/50 border-gray-300/50 text-gray-900 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                }`}
                size="3"
              >
                {Array.isArray(applications) &&
                  applications.map((app) => (
                    <option key={app.application_id} value={app.application_id}>
                      #{app.application_id} - {app.research_type} ({app.status})
                    </option>
                  ))}
              </select>
              <p className={`text-xs mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Hold Ctrl (or Cmd on Mac) to select multiple applications
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white"
                    : "bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-gray-900"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? "bg-orange-600/80 hover:bg-orange-500/80 text-white disabled:opacity-50"
                    : "bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
                } shadow-lg hover:shadow-xl`}
              >
                {loading ? "Creating..." : "Create Meeting"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className={`p-3 rounded-lg backdrop-blur-xl border ${
          isDarkMode
            ? "bg-red-900/20 border-red-700/30 text-red-200"
            : "bg-red-50/80 border-red-200/50 text-red-700"
        } shadow-lg`}>
          <div className="flex items-center space-x-2">
            <AlertTriangle size={16} />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Meetings List */}
      {loading && !showCreateForm ? (
        <div className={`flex justify-center items-center h-32 rounded-lg backdrop-blur-xl border ${
          isDarkMode 
            ? "bg-gray-800/50 border-gray-700/50" 
            : "bg-white/70 border-gray-200/50"
        } shadow-lg`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <p className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              Loading...
            </p>
          </div>
        </div>
      ) : (
        <div className={`p-4 rounded-lg backdrop-blur-xl border ${
          isDarkMode 
            ? "bg-gray-800/50 border-gray-700/50 text-white" 
            : "bg-white/70 border-gray-200/50 text-gray-900"
        } shadow-lg`}>
          <h2 className="text-lg font-semibold mb-4">Recent Meetings</h2>
          
          {meetings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={32} className={`mx-auto mb-3 ${
                isDarkMode ? "text-gray-600" : "text-gray-400"
              }`} />
              <p className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                No meetings scheduled yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {meetings.slice(0, 5).map((meeting) => (
                <div
                  key={meeting.meeting_id}
                  className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                    isDarkMode
                      ? "bg-gray-700/30 border-gray-600/50 hover:border-gray-500/50"
                      : "bg-gray-50/50 border-gray-200/50 hover:border-gray-300/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isDarkMode ? "bg-gray-600/50" : "bg-gray-100/50"
                      }`}>
                        <Calendar size={16} />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {meeting.committee?.committee_name || "Unknown Committee"}
                        </h3>
                        <p className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {new Date(meeting.meeting_date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        meeting.status === 'SCHEDULED' 
                          ? isDarkMode 
                            ? "bg-yellow-900/30 text-yellow-200" 
                            : "bg-yellow-100 text-yellow-800"
                          : meeting.status === 'COMPLETED'
                          ? isDarkMode
                            ? "bg-green-900/30 text-green-200"
                            : "bg-green-100 text-green-800"
                          : isDarkMode
                            ? "bg-gray-700/50 text-gray-300"
                            : "bg-gray-100 text-gray-800"
                      }`}>
                        {meeting.status}
                      </span>
                      <button
                        onClick={() => setSelectedMeeting(meeting)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isDarkMode
                            ? "bg-gray-600/50 hover:bg-gray-500/50 text-gray-300 hover:text-white"
                            : "bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <FileText size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {selectedMeeting && (
        <MeetingDetailsModal
          isOpen={!!selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
          meeting={selectedMeeting}
          onUpdate={fetchMeetings}
          onRatifyDecisions={handleRatifyDecisions}
          onGenerateSummary={handleGenerateSummary}
          onGenerateLetter={handleGenerateLetter}
        />
      )}

      {showSummaryModal && selectedSummary && (
        <MeetingSummaryModal
          isOpen={showSummaryModal}
          onClose={() => {
            setShowSummaryModal(false);
            setSelectedSummary(null);
          }}
          summary={selectedSummary}
        />
      )}

      {showLetterModal && selectedLetter && (
        <LetterModal
          isOpen={showLetterModal}
          onClose={() => {
            setShowLetterModal(false);
            setSelectedLetter(null);
            setSelectedApplicationId(null);
          }}
          letter={selectedLetter}
          applicationId={selectedApplicationId}
        />
      )}
    </div>
  );
};

export default MeetingManagement;
