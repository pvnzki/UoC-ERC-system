import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Eye,
  Settings,
  BarChart3,
  Activity,
  UserPlus,
  CalendarPlus,
  FileCheck,
  Loader2,
} from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";
import { adminServices } from "../../../../services/admin-services";

const DashboardOverview = ({ setCurrentView }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalCommittees: 0,
    activeCommittees: 0,
    totalUsers: 0,
    activeUsers: 0,
    upcomingMeetings: 0,
    completedMeetings: 0,
    averageProcessingTime: 0,
    approvalRate: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // First try to test the dashboard API
      try {
        await adminServices.getDashboardStats();
      } catch (testError) {
        console.log("Dashboard API test failed, using fallback data");
        // If the API fails, use fallback data immediately
        await fetchFallbackData();
        return;
      }

      // Fetch stats and activities in parallel
      const [statsResponse, activitiesResponse] = await Promise.all([
        adminServices.getDashboardStats(),
        adminServices.getRecentActivities(5),
      ]);

      setStats(statsResponse);
      setRecentActivities(activitiesResponse);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");

      // Fallback to calculated stats from individual API calls
      await fetchFallbackData();
    } finally {
      setLoading(false);
    }
  };

  // Fallback method to calculate stats from individual API calls
  const fetchFallbackData = async () => {
    try {
      const [applications, committees, users, meetings] = await Promise.all([
        adminServices.getApplications({ limit: 1000 }),
        adminServices.getCommittees(),
        adminServices.getUsers(),
        adminServices.getMeetings(),
      ]);

      // Calculate stats from the data
      const totalApplications = applications.applications?.length || 0;
      const pendingApplications =
        applications.applications?.filter((app) => app.status === "pending")
          .length || 0;
      const approvedApplications =
        applications.applications?.filter((app) => app.status === "approved")
          .length || 0;
      const rejectedApplications =
        applications.applications?.filter((app) => app.status === "rejected")
          .length || 0;

      const totalCommittees = committees.length || 0;
      const activeCommittees =
        committees.filter((committee) => committee.status === "active")
          .length || 0;

      const totalUsers = users.length || 0;
      const activeUsers =
        users.filter((user) => user.validity === true).length || 0;

      const upcomingMeetings =
        meetings.filter(
          (meeting) => new Date(meeting.meeting_date) > new Date()
        ).length || 0;
      const completedMeetings =
        meetings.filter(
          (meeting) => new Date(meeting.meeting_date) < new Date()
        ).length || 0;

      const approvalRate =
        totalApplications > 0
          ? ((approvedApplications / totalApplications) * 100).toFixed(1)
          : 0;

      setStats({
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        totalCommittees,
        activeCommittees,
        totalUsers,
        activeUsers,
        upcomingMeetings,
        completedMeetings,
        averageProcessingTime: 3.2, // This would need backend calculation
        approvalRate: parseFloat(approvalRate),
      });

      // Create recent activities from applications
      const recentApps =
        applications.applications?.slice(0, 5).map((app, index) => ({
          id: index + 1,
          type: "application",
          action: `Application ${
            app.status === "pending" ? "submitted" : app.status
          }`,
          user: `${app.applicant?.first_name || "Unknown"} ${
            app.applicant?.last_name || ""
          }`,
          time: new Date(app.created_at).toLocaleDateString(),
          status: app.status,
        })) || [];

      setRecentActivities(recentApps);
    } catch (err) {
      console.error("Error fetching fallback data:", err);
      setError("Unable to load dashboard data. Please check your connection.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: "Review Applications",
      description: "Check pending applications",
      icon: <FileCheck size={20} />,
      action: () => setCurrentView("applications"),
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Manage Committees",
      description: "Add or modify committees",
      icon: <Users size={20} />,
      action: () => setCurrentView("committees"),
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Add User",
      description: "Register new user",
      icon: <UserPlus size={20} />,
      action: () => setCurrentView("users"),
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Schedule Meeting",
      description: "Create new meeting",
      icon: <CalendarPlus size={20} />,
      action: () => setCurrentView("meetings"),
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "rejected":
        return <XCircle className="w-3 h-3 text-red-500" />;
      case "scheduled":
        return <Calendar className="w-3 h-3 text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      default:
        return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 border border-green-200 dark:border-green-700";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 border border-red-200 dark:border-red-700";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-200 dark:border-blue-700";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 border border-green-200 dark:border-green-700";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {error}
          </p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1
          className={`text-2xl font-bold mb-1 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Dashboard Overview
        </h1>
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Welcome back! Here's what's happening with your ERC system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Applications Stats */}
        <div
          className={`p-4 rounded-lg border-2 shadow-sm transition-all duration-300 hover:shadow-md ${
            isDarkMode
              ? "bg-gray-800 border-gray-600 hover:border-gray-500 shadow-gray-900/50"
              : "bg-white border-gray-300 hover:border-gray-400 shadow-gray-200/50"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`p-2 rounded-md ${
                isDarkMode ? "bg-blue-900/60" : "bg-blue-100"
              }`}
            >
              <FileText className="w-5 h-5 text-blue-700 dark:text-blue-300" />
            </div>
            <span
              className={`text-xs font-semibold ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Applications
            </span>
          </div>
          <div className="mb-2">
            <span
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {stats.totalApplications}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-green-700 dark:text-green-300 font-medium">
              {stats.approvedApplications} Approved
            </span>
            <span className="text-yellow-700 dark:text-yellow-300 font-medium">
              {stats.pendingApplications} Pending
            </span>
          </div>
        </div>

        {/* Committees Stats */}
        <div
          className={`p-4 rounded-lg border-2 shadow-sm transition-all duration-300 hover:shadow-md ${
            isDarkMode
              ? "bg-gray-800 border-gray-600 hover:border-gray-500 shadow-gray-900/50"
              : "bg-white border-gray-300 hover:border-gray-400 shadow-gray-200/50"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`p-2 rounded-md ${
                isDarkMode ? "bg-green-900/60" : "bg-green-100"
              }`}
            >
              <Users className="w-5 h-5 text-green-700 dark:text-green-300" />
            </div>
            <span
              className={`text-xs font-semibold ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Committees
            </span>
          </div>
          <div className="mb-2">
            <span
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {stats.totalCommittees}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-green-700 dark:text-green-300 font-medium">
              {stats.activeCommittees} Active
            </span>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {stats.totalCommittees - stats.activeCommittees} Inactive
            </span>
          </div>
        </div>

        {/* Users Stats */}
        <div
          className={`p-4 rounded-lg border-2 shadow-sm transition-all duration-300 hover:shadow-md ${
            isDarkMode
              ? "bg-gray-800 border-gray-600 hover:border-gray-500 shadow-gray-900/50"
              : "bg-white border-gray-300 hover:border-gray-400 shadow-gray-200/50"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`p-2 rounded-md ${
                isDarkMode ? "bg-purple-900/60" : "bg-purple-100"
              }`}
            >
              <UserPlus className="w-5 h-5 text-purple-700 dark:text-purple-300" />
            </div>
            <span
              className={`text-xs font-semibold ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Users
            </span>
          </div>
          <div className="mb-2">
            <span
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {stats.totalUsers}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-green-700 dark:text-green-300 font-medium">
              {stats.activeUsers} Active
            </span>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {stats.totalUsers - stats.activeUsers} Inactive
            </span>
          </div>
        </div>

        {/* Meetings Stats */}
        <div
          className={`p-4 rounded-lg border-2 shadow-sm transition-all duration-300 hover:shadow-md ${
            isDarkMode
              ? "bg-gray-800 border-gray-600 hover:border-gray-500 shadow-gray-900/50"
              : "bg-white border-gray-300 hover:border-gray-400 shadow-gray-200/50"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`p-2 rounded-md ${
                isDarkMode ? "bg-orange-900/60" : "bg-orange-100"
              }`}
            >
              <Calendar className="w-5 h-5 text-orange-700 dark:text-orange-300" />
            </div>
            <span
              className={`text-xs font-semibold ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Meetings
            </span>
          </div>
          <div className="mb-2">
            <span
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {stats.upcomingMeetings}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-blue-700 dark:text-blue-300 font-medium">
              {stats.upcomingMeetings} Upcoming
            </span>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {stats.completedMeetings} Completed
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2
          className={`text-lg font-semibold mb-3 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md hover:scale-105 text-left ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600 hover:border-gray-500 hover:bg-gray-700 shadow-gray-900/50"
                  : "bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50 shadow-gray-200/50"
              }`}
            >
              <div
                className={`inline-flex p-2 rounded-md mb-3 ${action.color} text-white shadow-sm`}
              >
                {action.icon}
              </div>
              <h3
                className={`font-semibold text-sm mb-1 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {action.title}
              </h3>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Analytics and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Summary */}
        <div
          className={`p-4 rounded-lg border-2 shadow-sm ${
            isDarkMode
              ? "bg-gray-800 border-gray-600 shadow-gray-900/50"
              : "bg-white border-gray-300 shadow-gray-200/50"
          }`}
        >
          <h2
            className={`text-lg font-semibold mb-3 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Analytics Summary
          </h2>
          <div className="space-y-3">
            <div
              className={`flex items-center justify-between p-3 rounded-md border ${
                isDarkMode
                  ? "bg-blue-900/30 border-blue-700"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div>
                <p
                  className={`font-semibold text-sm ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Average Processing Time
                </p>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Days to process applications
                </p>
              </div>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                {stats.averageProcessingTime}
              </span>
            </div>
            <div
              className={`flex items-center justify-between p-3 rounded-md border ${
                isDarkMode
                  ? "bg-green-900/30 border-green-700"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <div>
                <p
                  className={`font-semibold text-sm ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Approval Rate
                </p>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Percentage of approved applications
                </p>
              </div>
              <span className="text-xl font-bold text-green-700 dark:text-green-300">
                {stats.approvalRate}%
              </span>
            </div>
            <div
              className={`flex items-center justify-between p-3 rounded-md border ${
                isDarkMode
                  ? "bg-purple-900/30 border-purple-700"
                  : "bg-purple-50 border-purple-200"
              }`}
            >
              <div>
                <p
                  className={`font-semibold text-sm ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Active Committees
                </p>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Currently operational
                </p>
              </div>
              <span className="text-xl font-bold text-purple-700 dark:text-purple-300">
                {stats.activeCommittees}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div
          className={`p-4 rounded-lg border-2 shadow-sm ${
            isDarkMode
              ? "bg-gray-800 border-gray-600 shadow-gray-900/50"
              : "bg-white border-gray-300 shadow-gray-200/50"
          }`}
        >
          <h2
            className={`text-lg font-semibold mb-3 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Recent Activities
          </h2>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-start space-x-3 p-3 rounded-md border transition-colors duration-200 ${
                    isDarkMode
                      ? "border-gray-700 hover:bg-gray-700 hover:border-gray-600"
                      : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {activity.action}
                    </p>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {activity.user || activity.committee} • {activity.time}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      activity.status
                    )}`}
                  >
                    {activity.status}
                  </span>
                </div>
              ))
            ) : (
              <div
                className={`text-center py-8 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No recent activities</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCurrentView("analytics")}
            className={`mt-3 w-full p-3 text-center rounded-md border-2 border-dashed transition-colors duration-200 ${
              isDarkMode
                ? "border-gray-600 hover:border-blue-400 hover:bg-gray-700 text-gray-300 hover:text-white"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50 text-gray-600 hover:text-black"
            }`}
          >
            <BarChart3 className="w-4 h-4 mx-auto mb-1" />
            <span className="text-xs font-medium">View All Activities</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
