import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { adminServices } from "../../../../services/admin-services";

const MeetingManagement = () => {
  const [meetings, setMeetings] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const [newMeeting, setNewMeeting] = useState({
    committee_id: "",
    meeting_date: "",
    meeting_time: "",
    location: "",
    agenda: "",
    attendees: [],
  });

  const fetchCommittees = async () => {
    try {
      const committeesData = await adminServices.getCommittees();
      setCommittees(committeesData);
    } catch (err) {
      console.error("Failed to load committees:", err);
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
    fetchMeetings();
  }, []);

  const handleCreateMeeting = async (meetingData) => {
    try {
      setLoading(true);
      await adminServices.createMeeting(meetingData);
      fetchMeetings();
      setShowCreateForm(false);
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
      // Handle the summary data (download or display)
      toast.success("Meeting summary generated successfully");
      return summary;
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
      // Handle the letter data (download or display)
      toast.success("Letter generated successfully");
      return letter;
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
        <h1 className="text-2xl font-bold text-gray-800">Meeting Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showCreateForm ? "Cancel" : "Create Meeting"}
        </button>
      </div>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Meeting</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateMeeting(newMeeting);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Committee</option>
                  {committees.map((committee) => (
                    <option
                      key={committee.committee_id}
                      value={committee.committee_id}
                    >
                      {committee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Time
                </label>
                <input
                  type="time"
                  value={newMeeting.meeting_time}
                  onChange={(e) =>
                    setNewMeeting({
                      ...newMeeting,
                      meeting_time: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={newMeeting.location}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, location: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Meeting location"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agenda
              </label>
              <textarea
                value={newMeeting.agenda}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, agenda: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Meeting agenda"
                required
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Committee Meetings</h2>
          {meetings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No meetings scheduled
            </p>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting.meeting_id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {meeting.committee_name}
                      </h3>
                      <p className="text-gray-600">
                        {new Date(meeting.meeting_date).toLocaleDateString()} at{" "}
                        {meeting.meeting_time}
                      </p>
                      <p className="text-gray-600">{meeting.location}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleGenerateSummary(meeting.meeting_id)
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Generate Summary
                      </button>
                      <button
                        onClick={() => setSelectedMeeting(meeting)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
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
    </div>
  );
};

export default MeetingManagement;
