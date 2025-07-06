// Update components/TechnicalAdmin/genaral/SideBar.jsx
import React, { useState } from "react";
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
  UserCheck,
  FileText,
  Users2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  currentView,
  setCurrentView,
}) => {
  const { isDarkMode } = useTheme();
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home size={20} />,
      description: "Overview and analytics",
      url: "#dashboard",
    },
    {
      id: "applications",
      label: "Applications",
      icon: <FileText size={20} />,
      description: "Manage applications",
      url: "#applications",
    },
    {
      id: "committees",
      label: "Committee Management",
      icon: <Users2 size={20} />,
      description: "Committee settings",
      url: "#committees",
    },
    {
      id: "users",
      label: "User Management",
      icon: <UserCheck size={20} />,
      description: "User administration",
      url: "#users",
    },
    {
      id: "meetings",
      label: "Meeting Management",
      icon: <Clock size={20} />,
      description: "Schedule and manage meetings",
      url: "#meetings",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <TrendingUp size={20} />,
      description: "Reports and insights",
      url: "#analytics",
    },
  ];

  const bottomMenuItems = [
    { 
      id: "settings", 
      label: "Settings", 
      icon: <Settings size={20} />,
      description: "System configuration"
    },
    { 
      id: "help", 
      label: "Help", 
      icon: <HelpCircle size={20} />,
      description: "Support and documentation"
    },
    { 
      id: "logout", 
      label: "Logout", 
      icon: <LogOut size={20} />,
      description: "Sign out of your account"
    },
  ];

  const handleNavigation = (pageId) => {
    setCurrentView(pageId);
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logout clicked");
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } h-full transition-all duration-500 ease-in-out shadow-xl border-r relative ${
        isDarkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400/40 ${
            isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
          }`}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 pt-4 px-3">
        <div className="mb-4">
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
            isCollapsed ? 'sr-only' : ''
          } ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Main Navigation
          </h3>
        </div>
        
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id} className="relative">
              <button
                onClick={() => handleNavigation(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-300 ease-in-out relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-400/40 ${
                  currentView === item.id
                    ? isDarkMode
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-blue-600 text-white shadow-lg'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={isCollapsed ? item.description : undefined}
              >
                {/* Active indicator */}
                {currentView === item.id && (
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full ${
                    isDarkMode ? 'bg-blue-400' : 'bg-blue-300'
                  }`} />
                )}
                
                <span className={`inline-flex items-center justify-center transition-all duration-300 ${
                  currentView === item.id ? 'text-white' : ''
                }`}>
                  {item.icon}
                </span>
                
                {!isCollapsed && (
                  <span className="ml-3 font-medium text-sm">{item.label}</span>
                )}
                
                {/* Hover highlight effect */}
                <span className={`absolute left-0 top-0 w-full h-full opacity-0 group-hover:opacity-10 transition-all duration-300 pointer-events-none ${
                  isDarkMode ? 'bg-blue-400' : 'bg-blue-300'
                }`} />
              </button>
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && hoveredItem === item.id && (
                <div className={`absolute left-full ml-2 px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap ${
                  isDarkMode 
                    ? 'bg-gray-800 text-white border border-gray-600' 
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}>
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className={`p-3 border-t ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="mb-4">
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
            isCollapsed ? 'sr-only' : ''
          } ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            System
          </h3>
        </div>
        
        <ul className="space-y-1">
          {bottomMenuItems.map((item) => (
            <li key={item.id} className="relative">
              <button
                onClick={item.id === 'logout' ? handleLogout : () => {}}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-300 ease-in-out relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-400/40 ${
                  item.id === 'logout'
                    ? isDarkMode
                      ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                      : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={isCollapsed ? item.description : undefined}
              >
                <span className="inline-flex items-center justify-center">
                  {item.icon}
                </span>
                
                {!isCollapsed && (
                  <span className="ml-3 font-medium text-sm">{item.label}</span>
                )}
                
                {/* Hover highlight effect */}
                <span className={`absolute left-0 top-0 w-full h-full opacity-0 group-hover:opacity-10 transition-all duration-300 pointer-events-none ${
                  item.id === 'logout' 
                    ? isDarkMode ? 'bg-red-400' : 'bg-red-300'
                    : isDarkMode ? 'bg-blue-400' : 'bg-blue-300'
                }`} />
              </button>
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && hoveredItem === item.id && (
                <div className={`absolute left-full ml-2 px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap ${
                  isDarkMode 
                    ? 'bg-gray-800 text-white border border-gray-600' 
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}>
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
