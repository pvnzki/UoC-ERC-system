import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../context/theme/ThemeContext";
import Home from "../pages/TechnicalAdmin/Home.jsx";
import Header from "../components/TechnicalAdmin/genaral/Header.jsx";
import Sidebar from "../components/TechnicalAdmin/genaral/SideBar.jsx";
import ApplicationDetails from "../components/TechnicalAdmin/genaral/ApplicationDetails.jsx";
import ApprovedApplications from "../pages/TechnicalAdmin/ApprovedApplications.jsx";
import ReturendApplications from "../pages/TechnicalAdmin/ReturnApplication.jsx";
import Eval from "../pages/TechnicalAdmin/Evaluated.jsx";

const ERCTechnicalCommitteeRoutes = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Sidebar & Main Content */}
      <div className="flex flex-1 pt-20 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content */}
        <div
          className={`flex-grow transition-all duration-300 p-6 overflow-y-auto ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:id" element={<ApplicationDetails />} />
            <Route path="/eval/:id" element={<Eval />} />
            <Route
              path="/approved-applications"
              element={<ApprovedApplications />}
            />
            <Route
              path="/returned-applications"
              element={<ReturendApplications />}
            />
            <Route path="/evaluated" element={<Eval />} />

            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ERCTechnicalCommitteeRoutes;
