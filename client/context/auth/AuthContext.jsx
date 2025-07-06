import { createContext, useContext, useEffect, useState } from "react";
import {
  userLogin,
  validateUser,
  userRegister,
} from "../../services/auth-services.js";

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Function to check token validity
  const checkToken = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      // No token found, user is not authenticated
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const validToken = await validateUser(token);
      if (validToken.success) {
        // Extract user data from the response (similar to login function)
        const userData = validToken.user;

        // Store all relevant data returned from the backend
        const user = {
          user_id: userData.user_id || userData.id,
          role: userData.role,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          // Store role-specific IDs based on user type
          ...(userData.applicant_id && {
            applicant_id: userData.applicant_id,
            applicant_category: userData.applicant_category,
          }),
          ...(userData.member_id && {
            member_id: userData.member_id,
            committee_id: userData.committee_id,
            is_active: userData.is_active,
          }),
        };

        setUser(user);
        setIsAuthenticated(true);
      } else {
        // Token validation failed
        logout();
      }
    } catch (error) {
      console.error("Token validation error:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  // Set up periodic token validation (every 5 minutes)
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        console.log("Performing periodic token validation...");
        checkToken();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const login = async (username, password) => {
    const isValid = await userLogin(username, password);
    if (isValid.success) {
      setIsAuthenticated(true);

      // Extract user data from the response
      const responseData = isValid.user;
      const userData = responseData.data || responseData; // Handle different response structures

      // Store all relevant data returned from the backend
      const user = {
        user_id: userData.user_id || userData.id,
        role: userData.role,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        // Store role-specific IDs based on user type
        ...(userData.applicant_id && {
          applicant_id: userData.applicant_id,
          applicant_category: userData.applicant_category,
        }),
        ...(userData.member_id && {
          member_id: userData.member_id,
          committee_id: userData.committee_id,
          is_active: userData.is_active,
        }),
      };

      setUser(user);

      return user;
    }

    return null;
  };

  const register = async (userData) => {
    const isValid = await userRegister(userData);
    if (isValid.success) {
      setIsAuthenticated(true);
      setUser(isValid.user);
      return isValid.user;
    }

    return null;
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null); // Clear user data on logout
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
