import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/theme/ThemeContext";
import eye from "../../../assets/OfficeStaff/Eye.png";
import defaultProfile from "../../../assets/default-profile.png";
import { Users, Clock, RotateCcw, Send } from "lucide-react";

const tabIcons = {
  All: <Users className="w-4 h-4" />,
  Pending: <Clock className="w-4 h-4" />,
  Returned: <RotateCcw className="w-4 h-4" />,
  Forwarded: <Send className="w-4 h-4" />,
};

const ApplicationsTable = ({ data }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return isDarkMode
          ? "bg-yellow-900/30 text-yellow-300 border border-yellow-700/50"
          : "bg-yellow-50 text-yellow-800 border border-yellow-200";
      case "Forwarded":
        return isDarkMode
          ? "bg-green-900/30 text-green-300 border border-green-700/50"
          : "bg-green-50 text-green-800 border border-green-200";
      case "Returned":
        return isDarkMode
          ? "bg-red-900/30 text-red-300 border border-red-700/50"
          : "bg-red-50 text-red-800 border border-red-200";
      case "Checked":
        return isDarkMode
          ? "bg-blue-900/30 text-blue-300 border border-blue-700/50"
          : "bg-blue-50 text-blue-800 border border-blue-200";
      default:
        return isDarkMode
          ? "bg-gray-700/50 text-gray-300 border border-gray-600/50"
          : "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const handleViewClick = (id, status) => {
    navigate(`/officestaff/applications/${id}`);
  };

  // Filter data based on active filter
  const getFilteredData = () => {
    if (activeFilter === "All") return data;
    const filterMap = {
      Pending: ["Pending", "Submitted"],
      Returned: ["Returned"],
      Forwarded: [
        "Forwarded",
        "Checked",
        "ERC Review",
        "CTSC Review",
        "ARWC Review",
      ],
    };
    return data.filter((item) =>
      filterMap[activeFilter]?.includes(item.status)
    );
  };

  const filteredData = getFilteredData();

  const filterTabs = [
    { id: "All", label: "All Applications", count: data.length },
    {
      id: "Pending",
      label: "Pending",
      count: data.filter((item) =>
        ["Pending", "Submitted"].includes(item.status)
      ).length,
    },
    {
      id: "Returned",
      label: "Returned",
      count: data.filter((item) => item.status === "Returned").length,
    },
    {
      id: "Forwarded",
      label: "Forwarded",
      count: data.filter((item) =>
        [
          "Forwarded",
          "Checked",
          "ERC Review",
          "CTSC Review",
          "ARWC Review",
        ].includes(item.status)
      ).length,
    },
  ];

  return (
    <div
      className={`min-h-screen w-full px-4 py-6 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
      }`}
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        className={`w-full max-w-full mx-auto overflow-hidden rounded-2xl shadow-2xl border ${
          isDarkMode
            ? "bg-gray-900/90 border-gray-700/60"
            : "bg-white/90 border-gray-200/60"
        }`}
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Header */}
        <div
          className={`px-8 py-4 border-b ${
            isDarkMode ? "border-gray-700/50" : "border-gray-200/50"
          }`}
        >
          <h1
            className={`text-xl font-semibold mb-1 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Applications Management
          </h1>
          <p
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Review and manage all applications assigned to you
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="px-8 py-4">
          <div
            className={`flex space-x-2 p-1.5 rounded-lg ${
              isDarkMode
                ? "bg-gray-800/70 border border-gray-700/40"
                : "bg-gray-100/90 border border-gray-200/60"
            }`}
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                  activeFilter === tab.id
                    ? isDarkMode
                      ? "bg-blue-600/20 text-blue-200 border border-blue-500/30 shadow-lg"
                      : "bg-blue-50 text-blue-700 border border-blue-200 shadow-lg"
                    : isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700/30"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200/50"
                }`}
              >
                {tabIcons[tab.id]}
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 text-xs rounded-full font-semibold ${
                    activeFilter === tab.id
                      ? isDarkMode
                        ? "bg-blue-500/30 text-blue-200"
                        : "bg-blue-100 text-blue-700"
                      : isDarkMode
                      ? "bg-gray-700/50 text-gray-300"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table Container */}
        <div className="px-8 pb-6">
          {/* Table Header */}
          <div
            className={`grid grid-cols-12 gap-x-3 p-3 rounded-lg mb-3 font-semibold text-sm ${
              isDarkMode
                ? "bg-gray-800/80 text-gray-200 border border-gray-700/40"
                : "bg-gray-100/90 text-gray-700 border border-gray-200/60"
            }`}
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <div className="col-span-3 flex items-center">Applicant</div>
            <div className="col-span-2 flex items-center">Applicant ID</div>
            <div className="col-span-2 flex items-center">Application ID</div>
            <div className="col-span-2 flex items-center">Date / Time</div>
            <div className="col-span-1 flex items-center">Category</div>
            <div className="col-span-1 flex items-center">Status</div>
            <div className="col-span-1 flex items-center">View Details</div>
          </div>

          {/* Table Body */}
          {filteredData.length === 0 ? (
            <div
              className={`text-center py-12 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700/30 border border-gray-600/30"
                  : "bg-gray-50/80 border border-gray-200/50"
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  isDarkMode
                    ? "bg-gray-600/50 text-gray-400"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p
                className={`text-base font-medium mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                No {activeFilter.toLowerCase()} applications found
              </p>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Applications will appear here once they are assigned to you
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredData.map((row, index) => (
                <div
                  key={index}
                  onClick={() => handleViewClick(row.id, row.status)}
                  className={`grid grid-cols-12 gap-x-3 p-3 items-center rounded-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                    isDarkMode
                      ? "bg-gray-900/60 border border-gray-700/40 hover:bg-gray-800/80 hover:border-gray-600/50"
                      : "bg-white/90 border border-gray-200/60 hover:bg-gray-100/90 hover:border-gray-300/60"
                  }`}
                  style={{
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    className={`col-span-3 flex items-center font-medium text-sm ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={defaultProfile}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                      />
                      <span>{row.name}</span>
                    </div>
                  </div>
                  <div
                    className={`col-span-2 flex items-center font-mono text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {row.applicantId}
                  </div>
                  <div
                    className={`col-span-2 flex items-center font-mono text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {row.id}
                  </div>
                  <div
                    className={`col-span-2 flex items-center text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {row.date}
                  </div>
                  <div
                    className={`col-span-1 flex items-center text-xs ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {row.category}
                  </div>
                  <div className="col-span-1 flex items-center">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusStyles(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <div
                      className={`p-1.5 rounded-md transition-all duration-300 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <img src={eye} className="w-4 h-4" alt="View" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsTable;
