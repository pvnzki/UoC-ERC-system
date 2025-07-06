import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Global session expiration handler
let sessionExpirationHandler = null;

// Function to set the session expiration handler
export const setAuthSessionExpirationHandler = (handler) => {
  sessionExpirationHandler = handler;
};

// Create axios instance with interceptors
const createAuthAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
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
        console.log("Session expired detected in auth API call");
        sessionExpirationHandler(error);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const userLogin = async (email, password) => {
  try {
    const instance = createAuthAxiosInstance();
    const response = await instance.post("/auth/login", {
      email,
      password,
    });

    if (response.status === 200) {
      localStorage.setItem("authToken", response.data.auth);
      localStorage.setItem("applicantId", response.data.data.applicant_id);
      return {
        success: true,
        user: response.data,
      };
    } else {
      return { success: false, error: response.statusText };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Login failed",
    };
  }
};

export const validateUser = async (token) => {
  try {
    const instance = createAuthAxiosInstance();
    const response = await instance.get("/auth/validate", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      return { success: true, user: response.data.user };
    } else {
      return { success: false, error: response.statusText };
    }
  } catch (error) {
    console.log("Token validation error: ", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Token validation failed",
    };
  }
};

export const userRegister = async (userData) => {
  try {
    const instance = createAuthAxiosInstance();
    const response = await instance.post("/auth/register", userData);
    if (response.status === 200 || response.status === 201) {
      return { success: true, user: response.data };
    } else {
      return { success: false, error: response.statusText };
    }
  } catch (error) {
    console.log("Register user error: ", error);

    // Return an error response instead of undefined
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || "Registration failed",
    };
  }
};

export const logout = () => {
  // Clear all auth-related storage
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUserId");
  localStorage.removeItem("applicantId");
  
  // Trigger storage events for other tabs
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'authToken',
    newValue: null
  }));
  
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'currentUserId',
    newValue: null
  }));
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        error: "No authentication token found"
      };
    }

    const instance = createAuthAxiosInstance();
    const response = await instance.put("/auth/change-password", {
      currentPassword,
      newPassword
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200) {
      return {
        success: true,
        message: response.data.message
      };
    } else {
      return { success: false, error: response.statusText };
    }
  } catch (error) {
    console.log("Change password error: ", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Failed to change password"
    };
  }
};
