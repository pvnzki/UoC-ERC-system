import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import ApplicantRoutes from "./routes/ApplicantRoutes";
import CTSCorARWSChairRoutes from "./routes/CTSCorARWSChairRoutes";
import ERCmainRoutes from "./routes/ERCmainRoutes";
import ERCTechnicalCommitteeRoutes from "./routes/ERCTechnicalCommitteeRoutes";
import OfficeStaffRoutes from "./routes/OfficeStaffRoutes";
import { AuthContextProvider } from "../context/auth/AuthContext";
import { SessionContextProvider } from "../context/session/SessionContext";
import { ThemeProvider, useTheme } from "./context/theme/ThemeContext";
import SessionExpiredModalWrapper from "./components/common/SessionExpiredModalWrapper";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminDashboard from "./pages/TechnicalAdmin/Dashboard";

const AppContent = () => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Apply theme class to document body
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <Router>
      <SessionContextProvider>
        <Routes>
          {/* Applicant Routes */}
          <Route path="/*" element={<ApplicantRoutes />} />

          {/* Technical Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* CTSC/ARWS Chair Routes */}
          <Route
            path="/chair/*"
            element={
              <ProtectedRoute requiredRole="CHAIR">
                <CTSCorARWSChairRoutes />
              </ProtectedRoute>
            }
          />

          {/* ERC main committee/ CTSC/ARWS members Routes */}
          <Route
            path="/ercmain/*"
            element={
              <ProtectedRoute requiredRole="COMMITTEE_MEMBER">
                <ERCmainRoutes />
              </ProtectedRoute>
            }
          />

          {/* ERC Technical Committee Member Routes */}
          <Route
            path="/Technical-Admin/*"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ERCTechnicalCommitteeRoutes />
              </ProtectedRoute>
            }
          />

          {/* Office Staff Routes */}
          <Route
            path="/officestaff/*"
            element={
              <ProtectedRoute requiredRole="OFFICE_STAFF">
                <OfficeStaffRoutes />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Session Expired Modal */}
        <SessionExpiredModalWrapper />
      </SessionContextProvider>
    </Router>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <AppContent />
      </AuthContextProvider>
    </ThemeProvider>
  );
};

export default App;
