import React, { useEffect } from "react";
import { useSession } from "../../../context/session/SessionContext";
import SessionExpiredModal from "./SessionExpiredModal";
import { setSessionExpirationHandler } from "../../../services/admin-services";
import { setAuthSessionExpirationHandler } from "../../../services/auth-services";

const SessionExpiredModalWrapper = () => {
  const {
    showSessionExpiredModal,
    handleRedirectToLogin,
    handleSessionExpired,
  } = useSession();

  // Set up the session expiration handlers for all services
  useEffect(() => {
    setSessionExpirationHandler(handleSessionExpired);
    setAuthSessionExpirationHandler(handleSessionExpired);
  }, [handleSessionExpired]);

  return (
    <SessionExpiredModal
      isOpen={showSessionExpiredModal}
      onRedirectToLogin={handleRedirectToLogin}
    />
  );
};

export default SessionExpiredModalWrapper;
