import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../context/theme/ThemeContext";
import Home from "../pages/OfficeStaff/Office_Home.jsx";
import Office_Header from "../components/OfficeStaff/genaral/Office_Header.jsx";
import Sidebar from "../components/OfficeStaff/genaral/SideBar.jsx";
import ApplicationDetails from "../components/OfficeStaff/genaral/ApplicationDetails.jsx";
import ApprovedApplications from "../pages/OfficeStaff/ApprovedApplications.jsx";
import ReturendApplications from "../pages/OfficeStaff/ReturnApplication.jsx";
import Eval from "../pages/OfficeStaff/Evaluated.jsx";
import Applications from "../pages/OfficeStaff/Applications.jsx";

const OfficeStaffRoutes = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 left-0 w-full z-50">
        <Office_Header />
      </div>

      {/* Sidebar & Main Content */}
      <div className="flex flex-1 pt-20">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content */}
        <div
          className={`flex-grow transition-all duration-300 p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <Routes>
            <Route path="/officestaff" element={<Home />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="applications/:id" element={<ApplicationDetails />} />
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

export default OfficeStaffRoutes;
