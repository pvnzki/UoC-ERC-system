import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const SessionContext = createContext({});

export const SessionContextProvider = ({ children }) => {
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSessionExpired = useCallback(() => {
    console.log("Session expired - showing modal");
    // Prevent multiple modals from showing
    if (!showSessionExpiredModal) {
      setShowSessionExpiredModal(true);
    }
  }, [showSessionExpiredModal]);

  const handleRedirectToLogin = useCallback(() => {
    console.log("Redirecting to login page");
    setShowSessionExpiredModal(false);
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const checkForSessionExpiration = useCallback(
    (error) => {
      // Check for various session expiration indicators
      const isSessionExpired =
        error?.response?.status === 401 ||
        error?.response?.status === 403 ||
        error?.response?.data?.error?.toLowerCase().includes("token") ||
        error?.response?.data?.error?.toLowerCase().includes("expired") ||
        error?.response?.data?.error?.toLowerCase().includes("unauthorized") ||
        error?.response?.data?.message?.toLowerCase().includes("token") ||
        error?.response?.data?.message?.toLowerCase().includes("expired") ||
        error?.response?.data?.message
          ?.toLowerCase()
          .includes("unauthorized") ||
        error?.message
          ?.toLowerCase()
          .includes("no authentication token found") ||
        error?.message?.toLowerCase().includes("token validation failed") ||
        error?.message?.toLowerCase().includes("unauthorized");

      if (isSessionExpired) {
        handleSessionExpired();
        return true;
      }
      return false;
    },
    [handleSessionExpired]
  );

  return (
    <SessionContext.Provider
      value={{
        showSessionExpiredModal,
        handleSessionExpired,
        handleRedirectToLogin,
        checkForSessionExpiration,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
