import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Helper function to create axios instance with auth headers
const createAuthInstance = () => {
  const token = getAuthToken();
  console.log(
    "Creating auth instance with token:",
    token ? "Token exists" : "No token"
  );

  if (!token) {
    console.error("No authentication token found!");
    throw new Error("No authentication token found. Please log in again.");
  }

  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// User Management Services
export const adminServices = {
  // Get all users
  getUsers: async () => {
    const instance = createAuthInstance();
    const response = await instance.get("/admin/users");
    return response.data;
  },

  // Create new user
  createUser: async (userData) => {
    const instance = createAuthInstance();
    console.log("Creating user with data:", userData);

    const response = await instance.post("/admin/users", userData);
    console.log("Create user response:", response.data);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const instance = createAuthInstance();
    const response = await instance.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (userId, action) => {
    const instance = createAuthInstance();
    // Map action to validity boolean
    const validity = action === "unblock" ? true : false;
    const reason =
      action === "block" ? "User blocked by admin" : "User activated by admin";

    console.log("Sending update user status request:", {
      userId,
      validity,
      reason,
      action,
    });

    const response = await instance.patch("/admin/users/status", {
      userId: parseInt(userId), // Ensure userId is a number
      validity,
      reason,
    });

    console.log("Update user status response:", response.data);
    return response.data;
  },

  // Committee Management Services
  // Get all committees
  getCommittees: async () => {
    const instance = createAuthInstance();
    const response = await instance.get("/admin/committees");
    return response.data;
  },

  // Get committees with members
  getCommitteesWithMembers: async () => {
    const instance = createAuthInstance();
    const response = await instance.get("/admin/committees/details");
    return response.data;
  },

  // Test database connection
  testDatabase: async () => {
    const instance = createAuthInstance();
    const response = await instance.get("/admin/test/database");
    return response.data;
  },

  // Debug committee members
  debugCommitteeMembers: async () => {
    const instance = createAuthInstance();
    const response = await instance.get("/admin/debug/committee-members");
    return response.data;
  },

  // Create new committee
  createCommittee: async (committeeData) => {
    const instance = createAuthInstance();
    const response = await instance.post("/admin/committees", committeeData);
    return response.data;
  },

  // Delete committee
  deleteCommittee: async (committeeId) => {
    const instance = createAuthInstance();
    const response = await instance.delete(`/admin/committees/${committeeId}`);
    return response.data;
  },

  // Get all meetings
  getMeetings: async () => {
    const instance = createAuthInstance();
    const response = await instance.get("/admin/meetings");
    return response.data;
  },

  // Add members to committee
  addMembersToCommittee: async (committeeData) => {
    const instance = createAuthInstance();
    const response = await instance.post(
      "/admin/committees/members",
      committeeData
    );
    return response.data;
  },

  // Remove members from committee
  removeMembersFromCommittee: async (committeeData) => {
    const instance = createAuthInstance();
    const response = await instance.delete("/admin/committees/members", {
      data: committeeData,
    });
    return response.data;
  },

  // Application Review Services
  // Get applications with pagination and filtering
  getApplications: async (params = {}) => {
    const instance = createAuthInstance();
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.status) queryParams.append("status", params.status);

    const response = await instance.get(
      `/admin/applications?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get single application by ID
  getApplication: async (applicationId) => {
    const instance = createAuthInstance();
    const response = await instance.get(`/admin/applications/${applicationId}`);
    return response.data;
  },

  // Review application
  reviewApplication: async (applicationId, reviewData) => {
    const instance = createAuthInstance();
    const response = await instance.put(
      `/admin/applications/${applicationId}/review`,
      reviewData
    );
    return response.data;
  },

  // Send approval email
  sendApprovalEmail: async (applicationId, emailData) => {
    const instance = createAuthInstance();
    const response = await instance.post(
      `/admin/applications/${applicationId}/email`,
      emailData
    );
    return response.data;
  },

  // Meeting Management Services
  // Create meeting
  createMeeting: async (meetingData) => {
    const instance = createAuthInstance();
    const response = await instance.post("/admin/meetings", meetingData);
    return response.data;
  },

  // Ratify decisions
  ratifyDecisions: async (meetingId, decisionsData) => {
    const instance = createAuthInstance();
    const response = await instance.put(
      `/admin/meetings/${meetingId}/ratify`,
      decisionsData
    );
    return response.data;
  },

  // Generate meeting summary
  generateMeetingSummary: async (params = {}) => {
    const instance = createAuthInstance();
    const queryParams = new URLSearchParams();

    if (params.meetingId) queryParams.append("meetingId", params.meetingId);
    if (params.committeeId)
      queryParams.append("committeeId", params.committeeId);

    const response = await instance.get(
      `/admin/meetings/summary?${queryParams.toString()}`
    );
    return response.data;
  },

  // Generate letter
  generateLetter: async (applicationId) => {
    const instance = createAuthInstance();
    const response = await instance.get(
      `/admin/applications/${applicationId}/letter`
    );
    return response.data;
  },

  // Committee Interaction Services
  // Assign application to committee
  assignToCommittee: async (applicationId, assignmentData) => {
    const instance = createAuthInstance();
    const response = await instance.put(
      `/admin/applications/${applicationId}/assign`,
      assignmentData
    );
    return response.data;
  },

  // Review committee outcome
  reviewCommitteeOutcome: async (applicationId, outcomeData) => {
    const instance = createAuthInstance();
    const response = await instance.put(
      `/admin/applications/${applicationId}/outcome`,
      outcomeData
    );
    return response.data;
  },

  // Send committee email
  sendCommitteeEmail: async (committeeId, emailData) => {
    const instance = createAuthInstance();
    const response = await instance.post(
      `/admin/committees/${committeeId}/email`,
      emailData
    );
    return response.data;
  },

  // Send applicant email
  sendApplicantEmail: async (applicationId, emailData) => {
    const instance = createAuthInstance();
    const response = await instance.post(
      `/admin/applications/${applicationId}/email-applicant`,
      emailData
    );
    return response.data;
  },

  // Utility Services
  // Get table structure
  getTableStructure: async (tableName) => {
    const instance = createAuthInstance();
    const response = await instance.get(`/admin/table-structure/${tableName}`);
    return response.data;
  },

  // Check applications table
  checkApplicationsTable: async () => {
    const instance = createAuthInstance();
    const response = await instance.get("/admin/check-applications-table");
    return response.data;
  },

  // Check applicant table
  checkApplicantTable: async () => {
    const instance = createAuthInstance();
    const response = await instance.get("/admin/check-applicant-table");
    return response.data;
  },

  // Check models
  checkModels: async () => {
    const instance = createAuthInstance();
    const response = await instance.get("/admin/check-models");
    return response.data;
  },
};

export default adminServices;
