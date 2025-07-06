// src/pages/TechnicalAdmin/Dashboard.jsx
import React, { useState } from "react";
import { useTheme } from "../../context/theme/ThemeContext";
import Header from "../../components/TechnicalAdmin/genaral/Header";
import Sidebar from "../../components/TechnicalAdmin/genaral/SideBar";
import DashboardOverview from "../../components/TechnicalAdmin/Dashboard/DashboardOverview";
import CommitteeManagement from "../../components/TechnicalAdmin/CommitteeManagement/CommitteeManagement";
import UserManagement from "../../components/TechnicalAdmin/UserManagement/UserManagement";
import ApplicationReview from "../../components/TechnicalAdmin/ApplicationReview/ApplicationReview";
import MeetingManagement from "../../components/TechnicalAdmin/MeetingManagement/MeetingManagement";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDarkMode } = useTheme();

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardOverview setCurrentView={setCurrentView} />;
      case "committees":
        return <CommitteeManagement />;
      case "users":
        return <UserManagement />;
      case "meetings":
        return <MeetingManagement />;
      case "applications":
        return <ApplicationReview />;
      default:
        return <DashboardOverview setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="sticky top-0 left-0 w-full z-50">
        <Header />
      </div>

      <div className="flex pt-20">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />

        <div
          className={`flex-1 transition-all duration-300 p-6 ${
            currentView === "dashboard"
              ? isDarkMode
                ? "bg-gray-900"
                : "bg-gray-50"
              : isDarkMode
              ? "bg-gray-800"
              : "bg-gray-100"
          }`}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
