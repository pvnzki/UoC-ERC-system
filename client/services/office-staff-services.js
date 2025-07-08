import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Global session expiration handler
let sessionExpirationHandler = null;

// Function to set the session expiration handler
export const setSessionExpirationHandler = (handler) => {
  sessionExpirationHandler = handler;
};

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
    const error = new Error(
      "No authentication token found. Please log in again."
    );
    if (sessionExpirationHandler) {
      sessionExpirationHandler(error);
    }
    throw error;
  }

  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Add response interceptor to handle session expiration
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Check if it's a session expiration error
      const isSessionExpired =
        error?.response?.status === 401 ||
        error?.response?.status === 403 ||
        error?.response?.data?.error?.includes("token") ||
        error?.response?.data?.error?.includes("expired") ||
        error?.response?.data?.error?.includes("unauthorized") ||
        error?.response?.data?.message?.includes("token") ||
        error?.response?.data?.message?.includes("expired") ||
        error?.response?.data?.message?.includes("unauthorized");

      if (isSessionExpired && sessionExpirationHandler) {
        console.log("Session expired detected in API call");
        sessionExpirationHandler(error);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Office Staff Services
export const officeStaffServices = {
  // Get applications for office staff
  getApplications: async (params = {}) => {
    const instance = createAuthInstance();
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.status) queryParams.append("status", params.status);

    const response = await instance.get(
      `/office-staff/applications?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get single application by ID
  getApplication: async (applicationId) => {
    const instance = createAuthInstance();
    const response = await instance.get(
      `/office-staff/applications/${applicationId}`
    );
    return response.data;
  },

  // Forward application to committee
  forwardApplication: async (applicationId, committeeId) => {
    const instance = createAuthInstance();
    const response = await instance.put(
      `/office-staff/applications/${applicationId}/forward`,
      {
        committeeId,
      }
    );
    return response.data;
  },

  // Return application to applicant
  returnApplication: async (applicationId, reason) => {
    const instance = createAuthInstance();
    const response = await instance.put(
      `/office-staff/applications/${applicationId}/return`,
      {
        reason,
      }
    );
    return response.data;
  },

  // Mark application as checked
  markChecked: async (applicationId) => {
    const instance = createAuthInstance();
    const response = await instance.post(
      `/office-staff/applications/${applicationId}/checked`
    );
    return response.data;
  },

  // Mark outcome (forward/return)
  markOutcome: async (applicationId, outcome) => {
    const instance = createAuthInstance();
    const response = await instance.post(
      `/office-staff/applications/${applicationId}/outcome`,
      { outcome }
    );
    return response.data;
  },

  // Send return email to applicant
  sendReturnEmail: async (applicationId, reason) => {
    const instance = createAuthInstance();
    const response = await instance.post(
      `/office-staff/applications/${applicationId}/return-email`,
      { reason }
    );
    return response.data;
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    const instance = createAuthInstance();
    const response = await instance.get("/office-staff/dashboard/stats");
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    const instance = createAuthInstance();
    const response = await instance.get(
      `/office-staff/dashboard/activities?limit=${limit}`
    );
    return response.data;
  },
};

export default officeStaffServices;
