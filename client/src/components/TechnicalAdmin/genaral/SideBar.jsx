// Update components/TechnicalAdmin/genaral/SideBar.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  UserPlus,
  X,
} from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { isDarkMode } = useTheme();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // Handle transition state to prevent layout shifts
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [isCollapsed]);

  // Portal Tooltip Component
  const PortalTooltip = ({ item, isVisible, position }) => {
    if (!isVisible || !item) return null;

    return createPortal(
      <div
        className={`fixed backdrop-blur-2xl rounded-xl shadow-lg z-[9999] border transition-all duration-300 ease-out ${
          isDarkMode
            ? "bg-white/3 border-white/6 text-white/85"
            : "bg-white/25 border-white/20 text-gray-800"
        }`}
        style={{
          left: position.x,
          top: position.y,
          transform: "translateY(-50%)",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          boxShadow: isDarkMode
            ? "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.04)"
            : "0 8px 32px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.4)",
        }}
      >
        {/* Ultra-subtle glassmorphic overlay */}
        <div
          className={`absolute inset-0 rounded-xl ${
            isDarkMode
              ? "bg-gradient-to-br from-white/2 to-transparent"
              : "bg-gradient-to-br from-white/10 to-transparent"
          }`}
        />

        {/* Compact tooltip content */}
        <div className="relative z-10 px-3 py-2">
          {/* Compact header with small icon */}
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg ${
                isDarkMode
                  ? "bg-white/4 text-white/75"
                  : "bg-white/20 text-gray-600"
              }`}
            >
              {React.cloneElement(item.icon, { size: 14 })}
            </div>
            <div
              className={`font-medium text-sm ${
                isDarkMode ? "text-white/85" : "text-gray-800"
              }`}
            >
              {item.label}
            </div>
          </div>

          {/* Compact description */}
          <div
            className={`text-xs mt-1 ${
              isDarkMode ? "text-white/65" : "text-gray-600"
            }`}
          >
            {item.description}
          </div>

          {/* Compact logout indicator */}
          {item.id === "logout" && (
            <div
              className={`mt-1 flex items-center gap-1.5 text-xs ${
                isDarkMode ? "text-red-300" : "text-red-500"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isDarkMode ? "bg-red-400/40" : "bg-red-500/40"
                }`}
                style={{
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              />
              <span className="font-medium">Sign out</span>
            </div>
          )}
        </div>

        {/* Ultra-transparent liquid glass arrow */}
        <div
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 ${
            isDarkMode
              ? "bg-white/3 border-l border-b border-white/6"
              : "bg-white/25 border-l border-b border-white/20"
          }`}
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        />
      </div>,
      document.body
    );
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BarChart3 size={20} />,
      description: "Overview and analytics",
      path: "/Technical-Admin",
    },
    {
      id: "applications",
      label: "Applications",
      icon: <FileText size={20} />,
      description: "Review and manage applications",
      path: "/Technical-Admin/applications",
    },
    {
      id: "committees",
      label: "Committees",
      icon: <Users size={20} />,
      description: "Manage committees and members",
      path: "/Technical-Admin/committees",
    },
    {
      id: "users",
      label: "Users",
      icon: <UserPlus size={20} />,
      description: "Manage system users",
      path: "/Technical-Admin/users",
    },
    {
      id: "meetings",
      label: "Meetings",
      icon: <Clock size={20} />,
      description: "Schedule and manage meetings",
      path: "/Technical-Admin/meetings",
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

  const handleBottomMenuClick = (itemId) => {
    if (itemId === "settings") {
      navigate("/Technical-Admin/settings");
    } else if (itemId === "logout") {
      setShowLogoutConfirmation(true); // Only show confirmation, don't logout directly
    }
  };

  const handleLogoutConfirm = () => {
    // Add logout logic here
    console.log("Logout clicked");
    setShowLogoutConfirmation(false);
    navigate("/login");
  };
  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMouseEnter = (item, event) => {
    console.log("Mouse enter:", item.id);
    setHoveredItem(item.id);
    if (isCollapsed) {
      const rect = event.currentTarget.getBoundingClientRect();
      console.log("Button rect:", rect);
      setTooltipPosition({
        x: rect.right + 10,
        y: rect.top + rect.height / 2,
      });
      console.log("Tooltip position:", {
        x: rect.right + 10,
        y: rect.top + rect.height / 2,
      });
    }
  };

  const handleMouseLeave = () => {
    console.log("Mouse leave");
    setHoveredItem(null);
  };

  // Function to check if a menu item is active
  const isActive = (path) => {
    if (path === "/Technical-Admin") {
      return location.pathname === "/Technical-Admin";
    }
    if (path === "/settings") {
      return location.pathname === "/Technical-Admin/settings";
    }
    return location.pathname.startsWith(path);
  };

  // Debug hover state
  console.log("Current hovered item:", hoveredItem);
  console.log("Is collapsed:", isCollapsed);

  return (
    <div
      className={`${
        isCollapsed ? "w-21" : "w-64"
      } sticky top-20 h-[calc(100vh-5rem)] transition-all duration-700 ease-out shadow-2xl border-r relative overflow-visible flex flex-col ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-gray-700"
          : "bg-gradient-to-b from-white via-gray-50 to-white border-gray-200"
      }`}
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {/* Subtle Bookmark-style Expand/Collapse Button */}
      <button
        onClick={handleToggleCollapse}
        className={`absolute -right-1 top-1/2 transform -translate-y-1/2 z-40 p-1.5 rounded-l-md transition-all duration-300 ease-out hover:scale-105 focus:outline-none focus:ring-1 focus:ring-blue-400/30 ${
          isDarkMode
            ? "bg-gray-800/80 hover:bg-gray-700/90 text-gray-400 hover:text-gray-200 border border-gray-700/50 hover:border-gray-600/50"
            : "bg-gray-100/80 hover:bg-gray-200/90 text-gray-500 hover:text-gray-700 border border-gray-300/50 hover:border-gray-400/50"
        }`}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div
          className={`transition-all duration-300 ease-out transform ${
            isCollapsed ? "rotate-180" : "rotate-0"
          }`}
        >
          <ChevronLeft size={12} />
        </div>
      </button>

      {/* Navigation Menu with enhanced animations */}
      <nav className="flex-1 pt-6 px-3 overflow-y-auto overflow-x-visible scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
        <div className={`mb-4 ${!isCollapsed ? "mb-6" : ""}`}>
          <h3
            className={`text-xs font-semibold uppercase tracking-wider mb-3 transition-all duration-500 ease-out ${
              isCollapsed ? "opacity-0 scale-95" : "opacity-100 scale-100"
            } ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Main Navigation
          </h3>
        </div>

        <ul className={`space-y-3 ${!isCollapsed ? "space-y-2" : ""}`}>
          {menuItems.map((item, index) => (
            <li key={item.id} className="relative">
              <button
                onClick={() => handleNavigation(item.path)}
                onMouseEnter={(e) => handleMouseEnter(item, e)}
                onMouseLeave={handleMouseLeave}
                className={`w-full flex items-center rounded-xl transition-all duration-300 ease-out relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-400/40 transform hover:scale-[1.03] hover:shadow-lg ${
                  isActive(item.path)
                    ? isDarkMode
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-800/90 hover:text-white hover:shadow-lg"
                    : "text-gray-900 hover:bg-blue-50/90 hover:text-blue-900 hover:shadow-lg"
                } ${isCollapsed ? "px-4 py-3" : "px-3 py-3"}`}
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
                        : "bg-blue-500 shadow-lg"
                    }`}
                    style={{
                      boxShadow: isDarkMode
                        ? "0 0 10px rgba(96, 165, 250, 0.5)"
                        : "0 0 10px rgba(59, 130, 246, 0.4)",
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
                        : "bg-blue-400"
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
                        : "bg-blue-400"
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
                    isDarkMode ? "bg-blue-400" : "bg-blue-400"
                  }`}
                />
              </button>

              {/* Ultra-transparent glassmorphic fallback tooltip */}
              {isCollapsed && hoveredItem === item.id && (
                <div
                  className={`absolute backdrop-blur-2xl rounded-xl shadow-lg z-[9999] border transition-all duration-300 ease-out ${
                    isDarkMode
                      ? "bg-white/3 border-white/6 text-white/85"
                      : "bg-white/25 border-white/20 text-gray-800"
                  }`}
                  style={{
                    left: "100%",
                    top: "50%",
                    transform: "translateY(-50%)",
                    marginLeft: "8px",
                    whiteSpace: "nowrap",
                    backdropFilter: "blur(20px) saturate(150%)",
                    WebkitBackdropFilter: "blur(20px) saturate(150%)",
                    boxShadow: isDarkMode
                      ? "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.04)"
                      : "0 8px 32px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.4)",
                  }}
                >
                  {/* Ultra-subtle glassmorphic overlay */}
                  <div
                    className={`absolute inset-0 rounded-xl ${
                      isDarkMode
                        ? "bg-gradient-to-br from-white/2 to-transparent"
                        : "bg-gradient-to-br from-white/10 to-transparent"
                    }`}
                  />

                  {/* Compact tooltip content */}
                  <div className="relative z-10 px-3 py-2">
                    {/* Compact header with small icon */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isDarkMode
                            ? "bg-white/4 text-white/75"
                            : "bg-white/20 text-gray-600"
                        }`}
                      >
                        {React.cloneElement(item.icon, { size: 14 })}
                      </div>
                      <div
                        className={`font-medium text-sm ${
                          isDarkMode ? "text-white/85" : "text-gray-800"
                        }`}
                      >
                        {item.label}
                      </div>
                    </div>

                    {/* Compact description */}
                    <div
                      className={`text-xs mt-1 ${
                        isDarkMode ? "text-white/65" : "text-gray-600"
                      }`}
                    >
                      {item.description}
                    </div>

                    {/* Compact logout indicator */}
                    {item.id === "logout" && (
                      <div
                        className={`mt-1 flex items-center gap-1.5 text-xs ${
                          isDarkMode ? "text-red-300" : "text-red-500"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            isDarkMode ? "bg-red-400/40" : "bg-red-500/40"
                          }`}
                          style={{
                            animation:
                              "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                          }}
                        />
                        <span className="font-medium">Sign out</span>
                      </div>
                    )}
                  </div>

                  {/* Ultra-transparent liquid glass arrow */}
                  <div
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 ${
                      isDarkMode
                        ? "bg-white/3 border-l border-b border-white/6"
                        : "bg-white/25 border-l border-b border-white/20"
                    }`}
                    style={{
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                    }}
                  />
                </div>
              )}

              {/* Portal Tooltip for bottom items */}
              {isCollapsed && hoveredItem === item.id && (
                <PortalTooltip
                  item={item}
                  isVisible={true}
                  position={tooltipPosition}
                />
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Menu with enhanced styling */}
      <div
        className={`p-2 border-t transition-all duration-500 ease-out flex-shrink-0 ${
          isDarkMode ? "border-gray-700/50" : "border-gray-200/50"
        }`}
      >
        <div className={`mb-4 ${!isCollapsed ? "mb-6" : ""}`}>
          <h3
            className={`text-xs font-semibold uppercase tracking-wider mb-3 transition-all duration-500 ease-out ${
              isCollapsed ? "opacity-0 scale-95" : "opacity-100 scale-100"
            } ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            System
          </h3>
        </div>

        <ul className={`space-y-3 ${!isCollapsed ? "space-y-2" : ""}`}>
          {bottomMenuItems.map((item, index) => (
            <li key={item.id} className="relative">
              <button
                onClick={() => handleBottomMenuClick(item.id)}
                onMouseEnter={(e) => handleMouseEnter(item, e)}
                onMouseLeave={handleMouseLeave}
                className={`w-full flex items-center rounded-xl transition-all duration-500 ease-out relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-400/40 transform hover:scale-[1.02] ${
                  item.id === "logout"
                    ? isDarkMode
                      ? "text-red-400 hover:bg-red-900/20 hover:text-red-300 hover:shadow-md"
                      : "text-red-600 hover:bg-red-50/80 hover:text-red-700 hover:shadow-md"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-800/80 hover:text-white hover:shadow-md"
                    : "text-gray-800 hover:bg-gray-100/80 hover:text-gray-900 hover:shadow-md"
                } ${isCollapsed ? "px-4 py-3" : "px-3 py-3"}`}
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
                        : "bg-red-400"
                      : isDarkMode
                      ? "bg-blue-400"
                      : "bg-blue-400"
                  }`}
                />
              </button>

              {/* Ultra-transparent glassmorphic fallback tooltip for bottom items */}
              {isCollapsed && hoveredItem === item.id && (
                <div
                  className={`absolute backdrop-blur-2xl rounded-xl shadow-lg z-[9999] border transition-all duration-300 ease-out ${
                    isDarkMode
                      ? "bg-white/3 border-white/6 text-white/85"
                      : "bg-white/25 border-white/20 text-gray-800"
                  }`}
                  style={{
                    left: "100%",
                    top: "50%",
                    transform: "translateY(-50%)",
                    marginLeft: "8px",
                    whiteSpace: "nowrap",
                    backdropFilter: "blur(20px) saturate(150%)",
                    WebkitBackdropFilter: "blur(20px) saturate(150%)",
                    boxShadow: isDarkMode
                      ? "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.04)"
                      : "0 8px 32px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.4)",
                  }}
                >
                  {/* Ultra-subtle glassmorphic overlay */}
                  <div
                    className={`absolute inset-0 rounded-xl ${
                      isDarkMode
                        ? "bg-gradient-to-br from-white/2 to-transparent"
                        : "bg-gradient-to-br from-white/10 to-transparent"
                    }`}
                  />

                  {/* Compact tooltip content */}
                  <div className="relative z-10 px-3 py-2">
                    {/* Compact header with small icon */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isDarkMode
                            ? "bg-white/4 text-white/75"
                            : "bg-white/20 text-gray-600"
                        }`}
                      >
                        {React.cloneElement(item.icon, { size: 14 })}
                      </div>
                      <div
                        className={`font-medium text-sm ${
                          isDarkMode ? "text-white/85" : "text-gray-800"
                        }`}
                      >
                        {item.label}
                      </div>
                    </div>

                    {/* Compact description */}
                    <div
                      className={`text-xs mt-1 ${
                        isDarkMode ? "text-white/65" : "text-gray-600"
                      }`}
                    >
                      {item.description}
                    </div>

                    {/* Compact logout indicator */}
                    {item.id === "logout" && (
                      <div
                        className={`mt-1 flex items-center gap-1.5 text-xs ${
                          isDarkMode ? "text-red-300" : "text-red-500"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            isDarkMode ? "bg-red-400/40" : "bg-red-500/40"
                          }`}
                          style={{
                            animation:
                              "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                          }}
                        />
                        <span className="font-medium">Sign out</span>
                      </div>
                    )}
                  </div>

                  {/* Ultra-transparent liquid glass arrow */}
                  <div
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 ${
                      isDarkMode
                        ? "bg-white/3 border-l border-b border-white/6"
                        : "bg-white/25 border-l border-b border-white/20"
                    }`}
                    style={{
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                    }}
                  />
                </div>
              )}

              {/* Portal Tooltip for bottom items */}
              {isCollapsed && hoveredItem === item.id && (
                <PortalTooltip
                  item={item}
                  isVisible={true}
                  position={tooltipPosition}
                />
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

        /* Ensure tooltips are visible outside sidebar */
        li {
          overflow: visible !important;
        }

        /* Force tooltips to be above other elements */
        [class*="absolute left-full"] {
          z-index: 9999 !important;
          pointer-events: auto !important;
        }

        /* Ensure tooltips don't get clipped */
        nav,
        div[class*="p-2 border-t"] {
          overflow: visible !important;
        }
      `}</style>
      {showLogoutConfirmation &&
        createPortal(
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div
              className="max-w-md w-full mx-4 rounded-xl"
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, rgba(31, 41, 55, 0.7), rgba(55, 65, 81, 0.7))"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(249, 250, 251, 0.7))",
                backdropFilter: "blur(25px)",
                WebkitBackdropFilter: "blur(25px)",
                border: isDarkMode
                  ? "1px solid rgba(75, 85, 99, 0.2)"
                  : "1px solid rgba(229, 231, 235, 0.3)",
                boxShadow: isDarkMode
                  ? "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)"
                  : "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Confirm Logout
                </h3>
                <button
                  onClick={handleLogoutCancel}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
                  }`}
                >
                  <X size={18} />
                </button>
              </div>
              <div
                className={`p-4 text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Are you sure you want to logout? You will be redirected to the
                login page.
              </div>
              <div className="flex justify-end gap-3 p-4 pt-0">
                <button
                  onClick={handleLogoutCancel}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-gray-200 hover:bg-gray-700/50"
                      : "text-gray-600 hover:text-gray-700 hover:bg-gray-100/50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  <LogOut size={16} />
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Sidebar;

{
  /* Custom CSS for subtle bookmark-style button */
}
<style jsx>{`
  /* Subtle bookmark button styling */
  button[title*="sidebar"] {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  /* Minimal hover effects */
  button[title*="sidebar"]:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  /* Dark mode specific styling */
  .dark button[title*="sidebar"] {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .dark button[title*="sidebar"]:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  /* Remove prominent animations */
  button[title*="sidebar"]::before {
    display: none;
  }
`}</style>;
