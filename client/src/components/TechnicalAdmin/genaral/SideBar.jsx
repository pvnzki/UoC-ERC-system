// Update components/TechnicalAdmin/genaral/SideBar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { isDarkMode } = useTheme();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle transition state to prevent layout shifts
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [isCollapsed]);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home size={20} />,
      description: "Overview and analytics",
      path: "/Technical-Admin",
    },
    {
      id: "applications",
      label: "Applications",
      icon: <FileText size={20} />,
      description: "Manage applications",
      path: "/Technical-Admin/applications",
    },
    {
      id: "committees",
      label: "Committee Management",
      icon: <Users2 size={20} />,
      description: "Committee settings",
      path: "/Technical-Admin/committees",
    },
    {
      id: "users",
      label: "User Management",
      icon: <UserCheck size={20} />,
      description: "User administration",
      path: "/Technical-Admin/users",
    },
    {
      id: "meetings",
      label: "Meeting Management",
      icon: <Clock size={20} />,
      description: "Schedule and manage meetings",
      path: "/Technical-Admin/meetings",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <TrendingUp size={20} />,
      description: "Reports and insights",
      path: "/Technical-Admin/analytics",
    },
  ];

  const bottomMenuItems = [
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
      description: "System configuration",
    },
    {
      id: "help",
      label: "Help",
      icon: <HelpCircle size={20} />,
      description: "Support and documentation",
    },
    {
      id: "logout",
      label: "Logout",
      icon: <LogOut size={20} />,
      description: "Sign out of your account",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logout clicked");
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to check if a menu item is active
  const isActive = (path) => {
    if (path === "/Technical-Admin") {
      return location.pathname === "/Technical-Admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-21" : "w-64"
      } h-full transition-all duration-700 ease-out shadow-2xl border-r relative overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-gray-700"
          : "bg-gradient-to-b from-white via-gray-50 to-white border-gray-200"
      }`}
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {/* Header Section with enhanced styling */}
      <div
        className={`p-2 border-b transition-all duration-500 ease-out ${
          isDarkMode ? "border-gray-700/50" : "border-gray-200/50"
        }`}
      >
        <button
          onClick={handleToggleCollapse}
          className={`p-1.5 rounded-xl transition-all duration-500 ease-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400/40 transform ${
            isDarkMode
              ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg hover:shadow-xl"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg hover:shadow-xl"
          }`}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <div
            className={`transition-all duration-500 ease-out transform ${
              isCollapsed ? "rotate-180" : "rotate-0"
            }`}
          >
            <ChevronLeft size={16} />
          </div>
        </button>
      </div>

      {/* Navigation Menu with enhanced animations */}
      <nav className="flex-1 pt-2 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
        <div className={`mb-2 ${!isCollapsed ? "mb-4" : ""}`}>
          <h3
            className={`text-xs font-semibold uppercase tracking-wider mb-2 transition-all duration-500 ease-out ${
              isCollapsed ? "opacity-0 scale-95" : "opacity-100 scale-100"
            } ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Main Navigation
          </h3>
        </div>

        <ul className={`space-y-1 ${!isCollapsed ? "space-y-2" : ""}`}>
          {menuItems.map((item, index) => (
            <li key={item.id} className="relative">
              <button
                onClick={() => handleNavigation(item.path)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center rounded-xl transition-all duration-300 ease-out relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-400/40 transform hover:scale-[1.03] hover:shadow-lg ${
                  isActive(item.path)
                    ? isDarkMode
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-800/90 hover:text-white hover:shadow-lg"
                    : "text-gray-700 hover:bg-gray-100/90 hover:text-gray-900 hover:shadow-lg"
                } ${isCollapsed ? "px-3 py-2" : "px-3 py-3"}`}
                title={isCollapsed ? item.description : undefined}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Active indicator with enhanced animation */}
                {isActive(item.path) && (
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-500 ease-out ${
                      isDarkMode
                        ? "bg-blue-400 shadow-lg"
                        : "bg-blue-300 shadow-lg"
                    }`}
                    style={{
                      boxShadow: isDarkMode
                        ? "0 0 10px rgba(96, 165, 250, 0.5)"
                        : "0 0 10px rgba(59, 130, 246, 0.3)",
                    }}
                  />
                )}

                {/* Icon with enhanced styling */}
                <span
                  className={`inline-flex items-center justify-center transition-all duration-300 ease-out transform relative ${
                    isActive(item.path)
                      ? "text-white scale-110"
                      : "scale-100 group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                  {/* Icon glow effect on hover or active */}
                  <span
                    className={`absolute inset-0 rounded-lg opacity-0 transition-all duration-300 ease-out ${
                      isActive(item.path) || hoveredItem === item.id
                        ? "opacity-20"
                        : "opacity-0"
                    } ${
                      isActive(item.path)
                        ? "bg-white"
                        : isDarkMode
                        ? "bg-blue-400"
                        : "bg-blue-300"
                    }`}
                    style={{
                      filter: "blur(8px)",
                      transform: "scale(1.5)",
                    }}
                  />
                  {/* Icon pulse animation only on hover or active */}
                  <span
                    className={`absolute inset-0 rounded-lg transition-all duration-500 ease-out ${
                      isActive(item.path) || hoveredItem === item.id
                        ? "opacity-10 animate-pulse"
                        : "opacity-0"
                    } ${
                      isActive(item.path)
                        ? "bg-white"
                        : isDarkMode
                        ? "bg-blue-400"
                        : "bg-blue-300"
                    }`}
                    style={{
                      transform: "scale(1.2)",
                    }}
                  />
                </span>

                {/* Text with smooth fade animation */}
                <span
                  className={`font-medium text-sm transition-all duration-300 ease-out transform ${
                    isCollapsed
                      ? "opacity-0 scale-95 -translate-x-2 ml-2"
                      : "opacity-100 scale-100 translate-x-0 ml-3"
                  }`}
                >
                  {item.label}
                </span>

                {/* Enhanced hover highlight effect */}
                <span
                  className={`absolute left-0 top-0 w-full h-full opacity-0 group-hover:opacity-15 transition-all duration-300 ease-out ${
                    isDarkMode ? "bg-blue-400" : "bg-blue-300"
                  }`}
                />
              </button>

              {/* Enhanced tooltip for collapsed state */}
              {isCollapsed && hoveredItem === item.id && (
                <div
                  className={`absolute left-full ml-3 px-5 py-4 rounded-2xl shadow-2xl z-50 whitespace-nowrap transition-all duration-400 ease-out transform backdrop-blur-2xl ${
                    isActive(item.path)
                      ? isDarkMode
                        ? "bg-gradient-to-br from-blue-900/20 via-blue-800/25 to-blue-700/20 text-white border border-blue-500/30 shadow-blue-500/40"
                        : "bg-gradient-to-br from-blue-50/90 via-blue-100/85 to-blue-200/80 text-blue-900 border border-blue-300/40 shadow-blue-500/30"
                      : isDarkMode
                      ? "bg-gradient-to-br from-gray-900/20 via-gray-800/25 to-gray-700/20 text-white border border-gray-600/30 shadow-gray-900/60"
                      : "bg-gradient-to-br from-white/90 via-gray-50/85 to-gray-100/80 text-gray-900 border border-gray-200/40 shadow-gray-900/30"
                  }`}
                  style={{
                    animation: "slideInRight 0.4s ease-out",
                    boxShadow: isActive(item.path)
                      ? isDarkMode
                        ? "0 25px 50px -12px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                        : "0 25px 50px -12px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)"
                      : isDarkMode
                      ? "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                      : "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  }}
                >
                  {/* Glassmorphic background overlay */}
                  <div
                    className={`absolute inset-0 rounded-2xl ${
                      isActive(item.path)
                        ? isDarkMode
                          ? "bg-gradient-to-br from-blue-600/10 to-blue-400/5"
                          : "bg-gradient-to-br from-blue-400/10 to-blue-300/5"
                        : isDarkMode
                        ? "bg-gradient-to-br from-gray-600/10 to-gray-400/5"
                        : "bg-gradient-to-br from-gray-400/10 to-gray-300/5"
                    }`}
                  />

                  {/* Tooltip header with icon */}
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <span
                      className={`p-2 rounded-xl transition-all duration-300 ${
                        isActive(item.path)
                          ? isDarkMode
                            ? "bg-gradient-to-br from-blue-600/40 to-blue-500/30 text-blue-200 shadow-lg shadow-blue-500/30 backdrop-blur-sm"
                            : "bg-gradient-to-br from-blue-600/30 to-blue-500/20 text-blue-700 shadow-lg shadow-blue-500/20 backdrop-blur-sm"
                          : isDarkMode
                          ? "bg-gradient-to-br from-gray-700/40 to-gray-600/30 text-gray-200 shadow-lg shadow-gray-500/20 backdrop-blur-sm"
                          : "bg-gradient-to-br from-gray-200/60 to-gray-100/50 text-gray-600 shadow-lg shadow-gray-400/20 backdrop-blur-sm"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div
                      className={`font-bold text-sm tracking-wide ${
                        isActive(item.path)
                          ? isDarkMode
                            ? "text-blue-100"
                            : "text-blue-800"
                          : isDarkMode
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {item.label}
                    </div>
                  </div>

                  {/* Tooltip description */}
                  <div
                    className={`text-xs leading-relaxed relative z-10 ${
                      isActive(item.path)
                        ? isDarkMode
                          ? "text-blue-200"
                          : "text-blue-700"
                        : isDarkMode
                        ? "text-gray-300"
                        : "text-gray-600"
                    }`}
                  >
                    {item.description}
                  </div>

                  {/* Status indicator for active items */}
                  {isActive(item.path) && (
                    <div
                      className={`mt-3 flex items-center gap-2 text-xs relative z-10 ${
                        isDarkMode ? "text-blue-300" : "text-blue-600"
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isDarkMode ? "bg-blue-400" : "bg-blue-600"
                        } ${
                          hoveredItem === item.id ? "animate-pulse" : ""
                        } shadow-lg shadow-blue-500/50`}
                      ></div>
                      <span className="font-semibold tracking-wide">
                        Active
                      </span>
                    </div>
                  )}

                  {/* Tooltip arrow with enhanced glassmorphic styling */}
                  <div
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-4 h-4 rotate-45 ${
                      isActive(item.path)
                        ? isDarkMode
                          ? "bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-l border-b border-blue-500/30"
                          : "bg-gradient-to-br from-blue-50/90 to-blue-100/80 border-l border-b border-blue-300/40"
                        : isDarkMode
                        ? "bg-gradient-to-br from-gray-900/20 to-gray-800/20 border-l border-b border-gray-600/30"
                        : "bg-gradient-to-br from-white/90 to-gray-50/80 border-l border-b border-gray-200/40"
                    }`}
                    style={{
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      boxShadow: isActive(item.path)
                        ? isDarkMode
                          ? "-3px 3px 6px rgba(59, 130, 246, 0.3)"
                          : "-3px 3px 6px rgba(59, 130, 246, 0.2)"
                        : isDarkMode
                        ? "-3px 3px 6px rgba(0, 0, 0, 0.2)"
                        : "-3px 3px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Menu with enhanced styling */}
      <div
        className={`p-2 border-t transition-all duration-500 ease-out ${
          isDarkMode ? "border-gray-700/50" : "border-gray-200/50"
        }`}
      >
        <div className={`mb-2 ${!isCollapsed ? "mb-4" : ""}`}>
          <h3
            className={`text-xs font-semibold uppercase tracking-wider mb-2 transition-all duration-500 ease-out ${
              isCollapsed ? "opacity-0 scale-95" : "opacity-100 scale-100"
            } ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            System
          </h3>
        </div>

        <ul className={`space-y-1 ${!isCollapsed ? "space-y-2" : ""}`}>
          {bottomMenuItems.map((item, index) => (
            <li key={item.id} className="relative">
              <button
                onClick={item.id === "logout" ? handleLogout : () => {}}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center rounded-xl transition-all duration-500 ease-out relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-400/40 transform hover:scale-[1.02] ${
                  item.id === "logout"
                    ? isDarkMode
                      ? "text-red-400 hover:bg-red-900/20 hover:text-red-300 hover:shadow-md"
                      : "text-red-600 hover:bg-red-50/80 hover:text-red-700 hover:shadow-md"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-800/80 hover:text-white hover:shadow-md"
                    : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:shadow-md"
                } ${isCollapsed ? "px-3 py-2" : "px-3 py-3"}`}
                title={isCollapsed ? item.description : undefined}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <span className="inline-flex items-center justify-center transition-all duration-500 ease-out transform group-hover:scale-110 group-hover:rotate-3">
                  {item.icon}
                </span>

                <span
                  className={`font-medium text-sm transition-all duration-500 ease-out transform ${
                    isCollapsed
                      ? "opacity-0 scale-95 -translate-x-2 ml-2"
                      : "opacity-100 scale-100 translate-x-0 ml-3"
                  }`}
                >
                  {item.label}
                </span>

                {/* Enhanced hover highlight effect */}
                <span
                  className={`absolute left-0 top-0 w-full h-full opacity-0 group-hover:opacity-10 transition-all duration-500 ease-out ${
                    item.id === "logout"
                      ? isDarkMode
                        ? "bg-red-400"
                        : "bg-red-300"
                      : isDarkMode
                      ? "bg-blue-400"
                      : "bg-blue-300"
                  }`}
                />
              </button>

              {/* Enhanced tooltip for collapsed state */}
              {isCollapsed && hoveredItem === item.id && (
                <div
                  className={`absolute left-full ml-3 px-4 py-3 rounded-xl shadow-2xl z-50 whitespace-nowrap transition-all duration-300 ease-out transform backdrop-blur-xl ${
                    item.id === "logout"
                      ? isDarkMode
                        ? "bg-gradient-to-br from-red-900/95 to-red-800/95 text-white border border-red-600/50 shadow-red-500/30"
                        : "bg-gradient-to-br from-red-50/95 to-red-100/95 text-red-900 border border-red-300/50 shadow-red-500/20"
                      : isDarkMode
                      ? "bg-gradient-to-br from-gray-900/95 to-gray-800/95 text-white border border-gray-600/50 shadow-gray-900/50"
                      : "bg-gradient-to-br from-white/95 to-gray-50/95 text-gray-900 border border-gray-200/50 shadow-gray-900/20"
                  }`}
                  style={{
                    animation: "slideInRight 0.3s ease-out",
                    boxShadow:
                      item.id === "logout"
                        ? isDarkMode
                          ? "0 20px 25px -5px rgba(239, 68, 68, 0.3), 0 10px 10px -5px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                          : "0 20px 25px -5px rgba(239, 68, 68, 0.2), 0 10px 10px -5px rgba(239, 68, 68, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
                        : isDarkMode
                        ? "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                        : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                  }}
                >
                  {/* Tooltip header with icon */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`p-1.5 rounded-lg transition-all duration-300 ${
                        item.id === "logout"
                          ? isDarkMode
                            ? "bg-red-600/30 text-red-300 shadow-lg shadow-red-500/20"
                            : "bg-red-600/20 text-red-700 shadow-lg shadow-red-500/10"
                          : isDarkMode
                          ? "bg-gray-700/50 text-gray-300"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div
                      className={`font-bold text-sm ${
                        item.id === "logout"
                          ? isDarkMode
                            ? "text-red-100"
                            : "text-red-800"
                          : isDarkMode
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {item.label}
                    </div>
                  </div>

                  {/* Tooltip description */}
                  <div
                    className={`text-xs leading-relaxed ${
                      item.id === "logout"
                        ? isDarkMode
                          ? "text-red-200"
                          : "text-red-700"
                        : isDarkMode
                        ? "text-gray-300"
                        : "text-gray-600"
                    }`}
                  >
                    {item.description}
                  </div>

                  {/* Special styling for logout */}
                  {item.id === "logout" && (
                    <div
                      className={`mt-2 flex items-center gap-1 text-xs ${
                        isDarkMode ? "text-red-300" : "text-red-600"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isDarkMode ? "bg-red-400" : "bg-red-600"
                        } ${
                          hoveredItem === item.id ? "animate-pulse" : ""
                        } shadow-lg shadow-red-500/50`}
                      ></div>
                      <span className="font-medium">Sign out</span>
                    </div>
                  )}

                  {/* Tooltip arrow with enhanced styling */}
                  <div
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-3 h-3 rotate-45 ${
                      item.id === "logout"
                        ? isDarkMode
                          ? "bg-red-900 border-l border-b border-red-600/50"
                          : "bg-red-50 border-l border-b border-red-300/50"
                        : isDarkMode
                        ? "bg-gray-900 border-l border-b border-gray-600/50"
                        : "bg-white border-l border-b border-gray-200/50"
                    }`}
                    style={{
                      boxShadow:
                        item.id === "logout"
                          ? isDarkMode
                            ? "-2px 2px 4px rgba(239, 68, 68, 0.2)"
                            : "-2px 2px 4px rgba(239, 68, 68, 0.1)"
                          : isDarkMode
                          ? "-2px 2px 4px rgba(0, 0, 0, 0.1)"
                          : "-2px 2px 4px rgba(0, 0, 0, 0.05)",
                    }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes glassmorphicGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        @keyframes glassmorphicGlowRed {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }

        @keyframes tooltipGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        @keyframes tooltipGlowRed {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }

        @keyframes iconGlow {
          0% {
            opacity: 0;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }

        @keyframes buttonPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        .group:hover .icon-glow {
          animation: iconGlow 1s ease-out;
        }

        .group:hover {
          animation: buttonPulse 1s ease-out;
        }

        .tooltip-active {
          animation: glassmorphicGlow 2s ease-out infinite;
        }

        .tooltip-logout {
          animation: glassmorphicGlowRed 2s ease-out infinite;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 2px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
