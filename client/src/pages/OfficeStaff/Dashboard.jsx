import React, { useEffect, useState } from "react";
import { officeStaffServices } from "../../../services/office-staff-services";
import BeatLoader from "../../components/common/BeatLoader";
import {
  Loader2,
  BarChart2,
  FileText,
  CheckCircle,
  RotateCcw,
  ArrowRightCircle,
  Users,
  Award,
} from "lucide-react";
import { useTheme } from "../../context/theme/ThemeContext";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
dayjs.extend(relativeTime);

const statIcons = {
  total: <Users className="w-7 h-7 text-blue-500" />,
  pending: <BarChart2 className="w-7 h-7 text-yellow-500" />,
  checked: <CheckCircle className="w-7 h-7 text-blue-400" />,
  returned: <RotateCcw className="w-7 h-7 text-red-500" />,
  forwarded: <ArrowRightCircle className="w-7 h-7 text-green-500" />,
  approved: <Award className="w-7 h-7 text-green-600" />,
};

const statLabels = {
  total: "Total Applications",
  pending: "Pending",
  checked: "Checked",
  returned: "Returned",
  forwarded: "Forwarded",
  approved: "Approved",
};

// Add fade-in animation keyframes
const fadeInAnim = {
  animation: "fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1) both",
};

export default function Dashboard() {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [statsData, activitiesData] = await Promise.all([
          officeStaffServices.getDashboardStats(),
          officeStaffServices.getRecentActivities(10),
        ]);
        setStats(statsData);
        setActivities(activitiesData);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Add fade-in keyframes to the page
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(32px) scale(0.98); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes popIn {
        0% { opacity: 0; transform: scale(0.8); }
        80% { opacity: 1; transform: scale(1.05); }
        100% { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Calculate percentages
  const total = stats?.total || 1;
  const percent = (val) => Math.round(((val || 0) / total) * 100);

  // Theme-aware chart colors
  const chartColors = isDarkMode
    ? [
        "rgba(250,204,21,0.7)", // yellow-400/70
        "rgba(96,165,250,0.7)", // blue-400/70
        "rgba(248,113,113,0.7)", // red-400/70
        "rgba(52,211,153,0.7)", // green-400/70
        "rgba(34,197,94,0.7)", // green-600/70
      ]
    : [
        "rgba(250,204,21,0.8)", // yellow-400/80
        "rgba(59,130,246,0.8)", // blue-500/80
        "rgba(239,68,68,0.8)", // red-500/80
        "rgba(16,185,129,0.8)", // green-500/80
        "rgba(22,163,74,0.8)", // green-600/80
      ];
  const chartBorderColor = isDarkMode
    ? "rgba(31,41,55,0.5)"
    : "rgba(255,255,255,0.7)"; // gray-800/50 or white/70
  const chartHoverBorderColor = isDarkMode ? "#fff" : "#22223b";

  const chartData = {
    labels: [
      statLabels.pending,
      statLabels.checked,
      statLabels.returned,
      statLabels.forwarded,
      statLabels.approved,
    ],
    datasets: [
      {
        data: [
          stats?.pending || 0,
          stats?.checked || 0,
          stats?.returned || 0,
          stats?.forwarded || 0,
          stats?.approved || 0,
        ],
        backgroundColor: chartColors,
        borderWidth: 6,
        borderColor: chartBorderColor,
        hoverBorderColor: chartHoverBorderColor,
      },
    ],
  };
  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: isDarkMode ? "#e5e7eb" : "#22223b", // gray-200 or gray-900
          font: { size: 13, weight: "bold" },
          padding: 18,
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
  };
  // Filter activities
  const recentReturns = activities.filter(
    (a) => a.status === "RETURNED_FOR_RESUBMISSION"
  );
  const recentForwards = activities.filter(
    (a) => a.status === "PRELIMINARY_REVIEW"
  );

  if (loading) {
    return <BeatLoader />;
  }

  return (
    <div
      className={`w-full min-h-screen px-2 py-1 md:px-8 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
      }`}
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="w-full">
        <h1
          className={`text-xl md:text-3xl font-bold tracking-tight mb-2 mt-8 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Office Staff Dashboard
        </h1>
        <p
          className={`text-base mb-8 mt-1 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Welcome! Here’s a summary of your office activities and application
          stats.
        </p>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <BeatLoader />
          </div>
        ) : error ? (
          <div className="text-left text-red-500 font-semibold py-6">
            {error}
          </div>
        ) : (
          <>
            {/* Chart + Stats Section */}
            <div
              className="w-full flex flex-col md:flex-row gap-4 bg-white/60 dark:bg-gray-800/60 border border-white/40 dark:border-gray-700/60 rounded-xl shadow-2xl p-4 md:p-6 mb-4 items-center md:items-stretch backdrop-blur-md"
              style={{
                background: isDarkMode ? undefined : "#fff",
                backgroundColor: isDarkMode ? undefined : "#fff",
                ...fadeInAnim,
              }}
            >
              <div className="flex-shrink-0 flex flex-col items-center justify-center md:justify-start mb-4 md:mb-0">
                <span
                  className={`text-sm font-medium mb-2 mt-1 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Application Status Overview
                </span>
                <div
                  className="w-36 h-36 md:w-48 md:h-48 rounded-2xl flex items-center justify-center border border-white/40 dark:border-gray-700/60 shadow-xl backdrop-blur-md"
                  style={{
                    background: isDarkMode ? undefined : "#fff",
                    backgroundColor: isDarkMode ? undefined : "#fff",
                    animation: "fadeInUp 0.8s 0.1s both",
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Doughnut data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <span
                  className={`text-sm font-medium mb-2 mt-1 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Key Metrics
                </span>
                <div className="grid grid-cols-2 gap-3 w-full h-full content-start">
                  {Object.keys(statLabels).map((key) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 border border-white/40 dark:border-gray-700/60 rounded px-3 py-3 shadow-sm backdrop-blur-md hover:scale-105 hover:shadow-2xl transition-transform transition-shadow duration-300"
                      style={{
                        background: isDarkMode ? undefined : "#fff",
                        backgroundColor: isDarkMode ? undefined : "#fff",
                        animation: "fadeInUp 0.8s 0.15s both",
                      }}
                    >
                      <span
                        className={`p-1.5 rounded ${
                          isDarkMode
                            ? "bg-white/10 text-neutral-200"
                            : "bg-gray-100 text-neutral-700"
                        }`}
                      >
                        {statIcons[key]}
                      </span>
                      <div className="flex flex-col">
                        <span
                          className={`text-base font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          } mb-0.5 mt-0.5`}
                        >
                          {stats[key]}
                        </span>
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          } mt-0.5`}
                        >
                          {statLabels[key]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Recent Activities Section */}
            <div
              className="w-full bg-white/60 dark:bg-gray-800/60 border border-white/40 dark:border-gray-700/60 rounded-xl shadow-2xl p-4 md:p-6 backdrop-blur-md"
              style={{
                background: isDarkMode ? undefined : "#fff",
                backgroundColor: isDarkMode ? undefined : "#fff",
                ...fadeInAnim,
              }}
            >
              <h2
                className={`text-lg font-semibold mb-2 mt-1 tracking-tight ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Recent Activities
              </h2>
              <p
                className={`text-sm mb-4 mt-0.5 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Latest actions and updates in your office workflow.
              </p>
              {activities.length === 0 ? (
                <div className="text-center text-gray-400 py-4">
                  No recent activities.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {activities.map((act) => (
                    <li
                      key={act.application_id + act.last_updated}
                      className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:bg-blue-50/30 dark:hover:bg-gray-800/40 rounded px-1 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <span
                          className={`font-medium text-sm ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          } px-1`}
                        >
                          #{act.application_id}
                        </span>
                        <span
                          className={`ml-2 text-xs px-2 py-1 rounded-full font-semibold ${
                            act.status === "SUBMITTED"
                              ? "bg-blue-100 dark:bg-blue-900/40"
                              : act.status === "DOCUMENT_CHECK"
                              ? "bg-yellow-100 dark:bg-yellow-900/40"
                              : act.status === "RETURNED_FOR_RESUBMISSION"
                              ? "bg-red-100 dark:bg-red-900/40"
                              : act.status === "PRELIMINARY_REVIEW"
                              ? "bg-green-100 dark:bg-green-900/40"
                              : act.status === "APPROVED"
                              ? "bg-green-200 dark:bg-green-900/40"
                              : "bg-gray-200 dark:bg-gray-800/40"
                          }`}
                          style={{
                            color: isDarkMode ? "#e5e7eb" : "#374151",
                            animation: "popIn 0.5s both",
                          }}
                        >
                          {act.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          } px-1`}
                        >
                          {act.applicant?.user
                            ? `${act.applicant.user.first_name} ${act.applicant.user.last_name}`
                            : "Unknown Applicant"}
                        </span>
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } px-1`}
                        >
                          {dayjs(act.last_updated).fromNow()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
