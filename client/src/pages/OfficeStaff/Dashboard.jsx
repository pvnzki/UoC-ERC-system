import React, { useEffect, useState } from "react";
import { officeStaffServices } from "../../../services/office-staff-services";
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

  // Calculate percentages
  const total = stats?.total || 1;
  const percent = (val) => Math.round(((val || 0) / total) * 100);
  // Filter activities
  const recentReturns = activities.filter(
    (a) => a.status === "RETURNED_FOR_RESUBMISSION"
  );
  const recentForwards = activities.filter(
    (a) => a.status === "PRELIMINARY_REVIEW"
  );

  return (
    <div
      className={`min-h-screen w-full px-4 py-8 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
      }`}
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <h1
          className={`text-2xl font-bold mb-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Office Staff Dashboard
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-semibold py-8">
            {error}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 mb-6">
              <Link
                to="/officestaff/applications"
                className="liquid-button px-4 py-2 font-semibold"
              >
                View All Applications
              </Link>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Object.keys(statLabels).map((key) => (
                <div
                  key={key}
                  className="liquid-card p-6 rounded-xl transition-all duration-500 ease-out transform hover:scale-[1.02] hover:shadow-xl group"
                >
                  <div
                    className={`p-3 rounded-xl transition-all duration-500 ease-out transform group-hover:scale-110 ${
                      isDarkMode
                        ? "bg-white/5 text-gray-300 group-hover:text-white"
                        : "bg-gray-100/50 text-gray-600 group-hover:text-gray-900"
                    }`}
                  >
                    {statIcons[key]}
                  </div>
                  <div>
                    <div
                      className={`text-2xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stats[key]}
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {statLabels[key]}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activities */}
            <div
              className={`mt-12 rounded-2xl shadow-xl border p-8 ${
                isDarkMode
                  ? "bg-gray-900/70 border-gray-700/60"
                  : "bg-white/80 border-gray-200/60"
              }`}
            >
              <h2
                className={`text-lg font-semibold mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Recent Activities
              </h2>
              {activities.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No recent activities.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {activities.map((act) => (
                    <li
                      key={act.application_id + act.last_updated}
                      className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <Link
                          to={`/officestaff/applications/${act.application_id}`}
                          className={`font-medium underline ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          #{act.application_id}
                        </Link>
                        <span
                          className={`ml-2 text-xs px-2 py-1 rounded-full font-semibold ${
                            act.status === "SUBMITTED"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                              : act.status === "DOCUMENT_CHECK"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                              : act.status === "RETURNED_FOR_RESUBMISSION"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                              : act.status === "PRELIMINARY_REVIEW"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                              : act.status === "APPROVED"
                              ? "bg-green-200 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                              : "bg-gray-200 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300"
                          }`}
                        >
                          {act.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {act.applicant?.user
                            ? `${act.applicant.user.first_name} ${act.applicant.user.last_name}`
                            : "Unknown Applicant"}
                        </span>
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
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
