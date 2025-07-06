import { Routes, Route } from "react-router-dom";
import { useTheme } from "../context/theme/ThemeContext";
import Header from "../components/CTS/genaral/CTS_Header.jsx";
import Home from "../pages/CTS/CTS_Home.jsx";

const CTSCorARWSChairRoutes = () => {
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

      {/* Main Content */}
      <div
        className={`flex-1 pt-20 p-6 overflow-y-auto ${
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <Routes>
          {/* route: general */}
          <Route path="/" element={<Home />} />

          {/* add other routes below */}
        </Routes>
      </div>
    </div>
  );
};

export default CTSCorARWSChairRoutes;
