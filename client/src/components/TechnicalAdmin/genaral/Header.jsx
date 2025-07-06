import { Search, X, Bell, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/Applicant/logo-menu.png";
import defaultProfile from "../../../assets/default-profile.png";
import { useAuth } from "../../../../context/auth/AuthContext";
import { useTheme } from "../../../context/theme/ThemeContext";
import UserProfileModal from "./UserProfileModal";
import ThemeToggle from "../../common/ThemeToggle";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { user: userData } = useAuth();
  const { isDarkMode } = useTheme();

  const navigate = useNavigate();

  // Sample Data for applicant search (you can replace with API call later)
  const applicants = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com" },
    { id: 2, name: "Bob Smith", email: "bob@example.com" },
    { id: 3, name: "Charlie Davis", email: "charlie@example.com" },
    { id: 4, name: "Diana Williams", email: "diana@example.com" },
    { id: 5, name: "Edward Brown", email: "edward@example.com" },
  ];

  // Format user role for display
  const formatRole = (role) => {
    if (!role) return "Guest";
    return role
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Handle Search Function
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredResults([]);
    } else {
      const results = applicants.filter(
        (applicant) =>
          applicant.name.toLowerCase().includes(query.toLowerCase()) ||
          applicant.email.toLowerCase().includes(query.toLowerCase()) ||
          applicant.id.toString().includes(query)
      );
      setFilteredResults(results);
    }
  };

  // Handle Selecting an Applicant (Navigate to their Page)
  const handleSelectApplicant = (id) => {
    navigate(`/applicant/${id}`);
    setFilteredResults([]);
    setSearchQuery("");
  };

  useEffect(() => {}, []);

  return (
    <>
      {/* Header */}
      <header
        className={`bg-gradient-to-r from-[#0A1F44] to-[#0F2E64] border-b border-white/20 shadow-lg px-6 md:px-16 lg:px-32 py-4 flex items-center justify-between z-50 fixed top-0 left-0 right-0 transition-all duration-500 ease-in-out ${
          isDarkMode ? "dark" : ""
        }`}
        style={{ backdropFilter: "blur(0px)" }}
      >
        <div className="flex items-center">
          <img
            src={logo}
            alt="Faculty Logo"
            className="h-10 md:h-12 object-contain float transition-all duration-700 ease-in-out"
          />
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 justify-center relative max-w-2xl mx-8">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Applicant..."
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-full focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 placeholder-gray-300 transition-all duration-500 ease-in-out shadow-sm"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5 pointer-events-none transition-all duration-500" />
          </div>
          {filteredResults.length > 0 && (
            <div className="absolute top-full mt-2 left-0 w-full glass-card overflow-hidden z-50 animate-fade-in">
              {filteredResults.map((applicant) => (
                <div
                  key={applicant.id}
                  className="px-4 py-3 hover:bg-white/20 cursor-pointer transition-all duration-500 ease-in-out border-b border-white/10 last:border-b-0"
                  onClick={() => handleSelectApplicant(applicant.id)}
                  tabIndex={0}
                >
                  <div className="text-white font-medium">{applicant.name}</div>
                  <div className="text-gray-300 text-sm">{applicant.email}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle className="transition-all duration-500 ease-in-out" />
          {/* Notifications */}
          <button className="liquid-button p-3 rounded-full relative transition-all duration-500 ease-in-out hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-400/40">
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
              3
            </span>
          </button>
          {/* Settings */}
          <button className="liquid-button p-3 rounded-full transition-all duration-500 ease-in-out hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-400/40">
            <Settings className="w-5 h-5 text-white" />
          </button>
          {/* Mobile Search Icon */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="block md:hidden liquid-button p-3 rounded-full transition-all duration-500 ease-in-out hover:scale-105 active:scale-95"
          >
            {showSearch ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Search className="w-5 h-5 text-white" />
            )}
          </button>
          {/* Profile Section - Dynamic User Data */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 active:scale-95 transition-all duration-500 ease-in-out glass-card px-4 py-2 rounded-full shadow-md"
            onClick={() => setShowProfileModal(true)}
            tabIndex={0}
          >
            <img
              src={userData?.profile_pic || defaultProfile}
              alt="User Profile"
              className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-white/30 object-cover glow transition-all duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultProfile;
              }}
            />
            <div className="text-white hidden md:block">
              <p className="text-sm md:text-base font-semibold">
                {userData
                  ? `${userData.first_name || "User"} ${
                      userData.last_name || ""
                    }`
                  : "Guest User"}
              </p>
              <p className="text-xs md:text-sm text-gray-300">
                {formatRole(userData?.role)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="px-6 md:hidden mt-20 absolute left-0 right-0 z-40 glass py-3 animate-fade-in">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Applicant..."
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-full focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 placeholder-gray-300 transition-all duration-500 ease-in-out shadow-sm"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5 pointer-events-none transition-all duration-500" />
          </div>
          {filteredResults.length > 0 && (
            <div className="mt-2 glass-card overflow-hidden animate-fade-in">
              {filteredResults.map((applicant) => (
                <div
                  key={applicant.id}
                  className="px-4 py-3 hover:bg-white/20 cursor-pointer transition-all duration-500 ease-in-out border-b border-white/10 last:border-b-0"
                  onClick={() => handleSelectApplicant(applicant.id)}
                  tabIndex={0}
                >
                  <div className="text-white font-medium">{applicant.name}</div>
                  <div className="text-gray-300 text-sm">{applicant.email}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={userData}
      />
    </>
  );
};

export default Header;
