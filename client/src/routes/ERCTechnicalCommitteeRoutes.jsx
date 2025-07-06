import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useTheme } from "../context/theme/ThemeContext";
import Header from "../components/TechnicalAdmin/genaral/Header";
import Sidebar from "../components/TechnicalAdmin/genaral/SideBar";
import DashboardOverview from "../components/TechnicalAdmin/Dashboard/DashboardOverview";
import ApplicationReview from "../components/TechnicalAdmin/ApplicationReview/ApplicationReview";
import ApplicationDetails from "../components/TechnicalAdmin/ApplicationReview/ApplicationDetails";
import ApprovedApplications from "../pages/TechnicalAdmin/ApprovedApplications";
import ReturendApplications from "../pages/TechnicalAdmin/ReturnApplication";
import Home from "../pages/TechnicalAdmin/Home";
import CommitteeManagement from "../components/TechnicalAdmin/CommitteeManagement/CommitteeManagement";
import UserManagement from "../components/TechnicalAdmin/UserManagement/UserManagement";
import MeetingManagement from "../components/TechnicalAdmin/MeetingManagement/MeetingManagement";

const ERCTechnicalCommitteeRoutes = () => {
  const { isDarkMode } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="sticky top-0 left-0 w-full z-50">
        <Header />
      </div>

      <div className="flex flex-1 pt-20">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content */}
        <div
          className={`flex-grow transition-all duration-700 ease-out p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <Routes>
            {/* Dashboard Overview - Main admin page */}
            <Route path="/" element={<DashboardOverview />} />

            {/* Applications */}
            <Route path="/applications" element={<ApplicationReview />} />
            <Route path="/applications/:id" element={<ApplicationDetails />} />
            <Route
              path="/approved-applications"
              element={<ApprovedApplications />}
            />
            <Route
              path="/returned-applications"
              element={<ReturendApplications />}
            />

            {/* Legacy routes for backward compatibility */}
            <Route path="/home" element={<Home />} />
            <Route path="/:id" element={<ApplicationDetails />} />

            {/* Committee Management */}
            <Route path="/committees" element={<CommitteeManagement />} />

            {/* User Management */}
            <Route path="/users" element={<UserManagement />} />

            {/* Meeting Management */}
            <Route path="/meetings" element={<MeetingManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ERCTechnicalCommitteeRoutes;
