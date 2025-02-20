import React, { useState } from "react";
import All from "../../../assets/OfficeStaff/all.png";
import Approved from "../../../assets/OfficeStaff/approved.png";
import Help from "../../../assets/OfficeStaff/help.png";
import Logout from "../../../assets/OfficeStaff/logout.png";
import Returned from "../../../assets/OfficeStaff/returned.png";

const Sidebar = () => {
  const [currentPage, setCurrentPage] = useState("all");

  const menuItems = [
    {
      id: "all",
      label: "All Applications",
      icon: All,
    },
    {
      id: "approved",
      label: "Approved Applications",
      icon: Approved,
    },
    {
      id: "returned",
      label: "Returned Applications",
      icon: Returned,
    },
  ];

  const bottomMenuItems = [
    {
      id: "help",
      label: "Help",
      icon: Help,
    },
    {
      id: "logout",
      label: "Logout",
      icon: Logout,
    },
  ];

  const handleNavigation = (pageId) => {
    setCurrentPage(pageId);
  };

  return (
    <div className="h-screen w-64 bg-white border-r flex flex-col">
      <nav className="flex-1 pt-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm transition-colors
                  ${
                    currentPage === item.id
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-5 h-5 mr-3"
                />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t">
        <ul className="py-4">
          {bottomMenuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm transition-colors
                  ${
                    currentPage === item.id
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-5 h-5 mr-3"
                />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
