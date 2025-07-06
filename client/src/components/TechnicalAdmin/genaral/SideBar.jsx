// Update components/TechnicalAdmin/genaral/SideBar.jsx
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Briefcase,
  ClipboardList,
  Settings,
  HelpCircle,
  LogOut,
  Calendar,
  Home,
  BarChart3,
} from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  currentView,
  setCurrentView,
}) => {
  const { isDarkMode } = useTheme();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home size={22} />,
      url: "#dashboard",
    },
    {
      id: "applications",
      label: "Applications",
      icon: <ClipboardList size={22} />,
      url: "#applications",
    },
    {
      id: "committees",
      label: "Committee Management",
      icon: <Briefcase size={22} />,
      url: "#committees",
    },
    {
      id: "users",
      label: "User Management",
      icon: <Users size={22} />,
      url: "#users",
    },
    {
      id: "meetings",
      label: "Meeting Management",
      icon: <Calendar size={22} />,
      url: "#meetings",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 size={22} />,
      url: "#analytics",
    },
  ];

  const bottomMenuItems = [
    { id: "settings", label: "Settings", icon: <Settings size={22} /> },
    { id: "help", label: "Help", icon: <HelpCircle size={22} /> },
    { id: "logout", label: "Logout", icon: <LogOut size={22} /> },
  ];

  const handleNavigation = (pageId) => {
    setCurrentView(pageId);
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } h-full transition-all duration-500 ease-in-out pt-3 shadow-xl border-r ${
        isDarkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`p-2 self-end mr-2 rounded-full transition-all duration-500 ease-in-out hover:scale-110 active:scale-95 focus:ring-2 focus:ring-blue-400/40 ${
          isDarkMode 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isCollapsed ? (
          <ChevronRight size={20} />
        ) : (
          <ChevronLeft size={20} />
        )}
      </button>

      {/* Navigation Menu */}
      <nav className="flex-1 pt-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-500 ease-in-out relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-400/40 ${
                  currentView === item.id
                    ? isDarkMode
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-blue-600 text-white shadow-lg'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="inline-flex items-center justify-center">
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
                {/* Highlight effect */}
                <span className={`absolute left-0 top-0 w-full h-full opacity-0 group-active:opacity-20 transition-all duration-300 pointer-events-none ${
                  isDarkMode ? 'bg-blue-400' : 'bg-blue-300'
                }`} />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className={`pt-6 pb-6 border-t px-3 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <ul className="space-y-2">
          {bottomMenuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-500 ease-in-out relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-400/40 ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="inline-flex items-center justify-center">
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
                {/* Highlight effect */}
                <span className={`absolute left-0 top-0 w-full h-full opacity-0 group-active:opacity-20 transition-all duration-300 pointer-events-none ${
                  isDarkMode ? 'bg-blue-400' : 'bg-blue-300'
                }`} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
