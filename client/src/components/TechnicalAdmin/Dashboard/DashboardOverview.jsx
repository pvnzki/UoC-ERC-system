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
  TrendingDown,
  Download,
  RefreshCw,
  PieChart,
  LineChart,
  Target,
  Award,
  Zap,
} from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";
import { adminServices } from "../../../../services/admin-services";

const DashboardOverview = ({ setCurrentView }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");
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
  const [analyticsData, setAnalyticsData] = useState({
    applicationTrends: [],
    committeePerformance: [],
    userGrowth: [],
    processingTimes: [],
    categoryDistribution: [],
    monthlyStats: [],
  });

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

      // Fetch stats, activities, and analytics in parallel
      const [statsResponse, activitiesResponse, analyticsResponse] =
        await Promise.all([
          adminServices.getDashboardStats(),
          adminServices.getRecentActivities(5),
          adminServices.getAnalyticsData
            ? adminServices.getAnalyticsData(timeRange)
            : generateMockAnalyticsData(),
        ]);

      setStats(statsResponse);
      setRecentActivities(activitiesResponse);
      setAnalyticsData(analyticsResponse);
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

      // Generate mock analytics data
      setAnalyticsData(generateMockAnalyticsData());
    } catch (err) {
      console.error("Error fetching fallback data:", err);
      setError("Unable to load dashboard data. Please check your connection.");
    }
  };

  // Generate mock analytics data
  const generateMockAnalyticsData = () => {
    const now = new Date();
    const months = [];
    const applicationTrends = [];
    const userGrowth = [];
    const processingTimes = [];
    const monthlyStats = [];

    // Generate last 12 months data
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("en-US", { month: "short" });
      months.push(monthName);

      // Application trends
      applicationTrends.push({
        month: monthName,
        submitted: Math.floor(Math.random() * 50) + 20,
        approved: Math.floor(Math.random() * 30) + 10,
        rejected: Math.floor(Math.random() * 15) + 5,
      });

      // User growth
      userGrowth.push({
        month: monthName,
        newUsers: Math.floor(Math.random() * 20) + 5,
        activeUsers: Math.floor(Math.random() * 100) + 50,
      });

      // Processing times
      processingTimes.push({
        month: monthName,
        averageDays: (Math.random() * 5 + 2).toFixed(1),
      });

      // Monthly stats
      monthlyStats.push({
        month: monthName,
        applications: Math.floor(Math.random() * 50) + 20,
        approvals: Math.floor(Math.random() * 30) + 10,
        meetings: Math.floor(Math.random() * 10) + 2,
      });
    }

    return {
      applicationTrends,
      committeePerformance: [
        {
          name: "Research Ethics Committee",
          applications: 45,
          approvalRate: 78,
          avgTime: 3.2,
        },
        {
          name: "Clinical Trials Committee",
          applications: 32,
          approvalRate: 85,
          avgTime: 2.8,
        },
        {
          name: "Animal Research Committee",
          applications: 28,
          approvalRate: 72,
          avgTime: 4.1,
        },
        {
          name: "Data Protection Committee",
          applications: 19,
          approvalRate: 90,
          avgTime: 2.5,
        },
      ],
      userGrowth,
      processingTimes,
      categoryDistribution: [
        { category: "Clinical Research", count: 35, percentage: 35 },
        { category: "Basic Research", count: 28, percentage: 28 },
        { category: "Social Sciences", count: 22, percentage: 22 },
        { category: "Engineering", count: 15, percentage: 15 },
      ],
      monthlyStats,
    };
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

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

  const StatCard = ({ title, value, change, icon, subtitle }) => (
    <div className="liquid-card p-6 rounded-xl transition-all duration-500 ease-out transform hover:scale-[1.02] hover:shadow-xl group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-xl transition-all duration-500 ease-out transform group-hover:scale-110 ${
            isDarkMode
              ? "bg-white/5 text-gray-300 group-hover:text-white"
              : "bg-gray-100/50 text-gray-600 group-hover:text-gray-900"
          }`}
        >
          {icon}
        </div>
        <div className="text-right">
          {change && (
            <div
              className={`flex items-center text-sm transition-all duration-300 ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change > 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="ml-1">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </div>
      <div>
        <h3
          className={`text-2xl font-bold mb-1 transition-all duration-300 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </h3>
        <p
          className={`text-sm transition-all duration-300 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {title}
        </p>
        {subtitle && (
          <p
            className={`text-xs mt-1 transition-all duration-300 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <div
      className={`liquid-card p-6 rounded-xl transition-all duration-500 ease-out transform hover:scale-[1.01] hover:shadow-xl ${className}`}
    >
      <h3
        className={`text-lg font-semibold mb-4 transition-all duration-300 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h3>
      {children}
    </div>
  );

  const MiniChart = ({ data, color, height = 60 }) => (
    <div className="relative" style={{ height }}>
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${data.length * 20} ${height}`}
      >
        <path
          d={data
            .map(
              (value, index) =>
                `${index === 0 ? "M" : "L"} ${index * 20} ${
                  height - (value / Math.max(...data)) * height
                }`
            )
            .join(" ")}
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={data
            .map(
              (value, index) =>
                `${index === 0 ? "M" : "L"} ${index * 20} ${
                  height - (value / Math.max(...data)) * height
                }`
            )
            .join(" ")}
          stroke={color}
          strokeWidth="0"
          fill={color}
          fillOpacity="0.1"
        />
      </svg>
    </div>
  );

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

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          change={12.5}
          icon={<FileText className="w-6 h-6 text-blue-600" />}
          subtitle={`${stats.pendingApplications} pending review`}
        />
        <StatCard
          title="Approval Rate"
          value={`${stats.approvalRate}%`}
          change={5.2}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          subtitle="Average processing time: 3.2 days"
        />
        <StatCard
          title="Active Committees"
          value={stats.activeCommittees}
          change={-2.1}
          icon={<Users className="w-6 h-6 text-purple-600" />}
          subtitle={`${stats.totalCommittees} total committees`}
        />
        <StatCard
          title="Upcoming Meetings"
          value={stats.upcomingMeetings}
          change={8.7}
          icon={<Calendar className="w-6 h-6 text-orange-600" />}
          subtitle={`${stats.completedMeetings} completed this month`}
        />
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
              className={`liquid-card p-4 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 text-left`}
            >
              <div
                className={`inline-flex p-2 rounded-md mb-3 backdrop-blur-sm bg-gray-700/60 dark:bg-gray-600/60 text-white shadow-sm`}
              >
                {action.icon}
              </div>
              <h3
                className={`font-semibold text-sm mb-1 ${
                  isDarkMode ? "text-white" : "text-gray-900"
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

      {/* Analytics Summary and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Summary */}
        <div
          className={`liquid-card p-4 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95`}
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
              className={`flex items-center justify-between p-3 rounded-md border backdrop-blur-sm ${
                isDarkMode
                  ? "bg-gray-700/30 border-gray-600/50"
                  : "bg-gray-50/80 border-gray-200/50"
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
              <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
                {stats.averageProcessingTime}
              </span>
            </div>
            <div
              className={`flex items-center justify-between p-3 rounded-md border backdrop-blur-sm ${
                isDarkMode
                  ? "bg-gray-700/30 border-gray-600/50"
                  : "bg-gray-50/80 border-gray-200/50"
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
              <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
                {stats.approvalRate}%
              </span>
            </div>
            <div
              className={`flex items-center justify-between p-3 rounded-md border backdrop-blur-sm ${
                isDarkMode
                  ? "bg-gray-700/30 border-gray-600/50"
                  : "bg-gray-50/80 border-gray-200/50"
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
              <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
                {stats.activeCommittees}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div
          className={`liquid-card p-4 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95`}
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
                  className={`flex items-start space-x-3 p-3 rounded-md border transition-colors duration-200 backdrop-blur-sm ${
                    isDarkMode
                      ? "border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600/50"
                      : "border-gray-200/50 hover:bg-gray-50/80 hover:border-gray-300/50"
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
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1
            className={`text-2xl font-bold mb-1 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Analytics Dashboard
          </h1>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Comprehensive insights into your ERC system performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-3 py-2 rounded-md border text-sm ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={fetchDashboardData}
            className={`p-2 rounded-md transition-colors ${
              isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trends */}
        <ChartCard title="Application Trends" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Submitted
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Approved
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Rejected
                  </span>
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {(analyticsData?.applicationTrends || []).map((month, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center space-y-2"
                >
                  <div className="flex flex-col space-y-1 w-full">
                    <div
                      className="bg-blue-500 rounded-t"
                      style={{
                        height: `${((month?.submitted || 0) / 50) * 200}px`,
                      }}
                    ></div>
                    <div
                      className="bg-green-500"
                      style={{
                        height: `${((month?.approved || 0) / 50) * 200}px`,
                      }}
                    ></div>
                    <div
                      className="bg-red-500 rounded-b"
                      style={{
                        height: `${((month?.rejected || 0) / 50) * 200}px`,
                      }}
                    ></div>
                  </div>
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {month?.month || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Committee Performance */}
        <ChartCard title="Committee Performance">
          <div className="space-y-4">
            {(analyticsData?.committeePerformance || []).map(
              (committee, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4
                      className={`font-semibold text-sm ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {committee?.name || "-"}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        (committee?.approvalRate || 0) >= 80
                          ? "bg-green-100 text-green-800"
                          : (committee?.approvalRate || 0) >= 70
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {committee?.approvalRate != null
                        ? committee.approvalRate
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        Applications:{" "}
                        {committee?.applications != null
                          ? committee.applications
                          : 0}
                      </span>
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        Avg Time:{" "}
                        {committee?.avgTime != null ? committee.avgTime : 0}{" "}
                        days
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            ((committee?.applications || 0) / 50) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </ChartCard>

        {/* Category Distribution */}
        <ChartCard title="Research Categories">
          <div className="space-y-4">
            {(analyticsData?.categoryDistribution || []).map(
              (category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{
                        backgroundColor: `hsl(${index * 90}, 70%, 50%)`,
                      }}
                    ></div>
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {category?.category || "-"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${
                            category?.percentage != null
                              ? category.percentage
                              : 0
                          }%`,
                          backgroundColor: `hsl(${index * 90}, 70%, 50%)`,
                        }}
                      ></div>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {category?.percentage != null ? category.percentage : 0}%
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </ChartCard>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Processing Times */}
        <ChartCard title="Processing Times Trend">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Average days to process
              </span>
              <span className="text-lg font-bold text-blue-600">
                {stats.averageProcessingTime != null
                  ? stats.averageProcessingTime
                  : 0}
              </span>
            </div>
            <MiniChart
              data={(analyticsData?.processingTimes || []).map((pt) =>
                parseFloat(pt?.averageDays || 0)
              )}
              color="#3B82F6"
              height={120}
            />
            <div className="space-y-2">
              {(analyticsData?.processingTimes || [])
                .slice(-3)
                .map((pt, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                    >
                      {pt?.month || "-"}
                    </span>
                    <span
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      {pt?.averageDays != null ? pt.averageDays : 0} days
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </ChartCard>

        {/* User Growth */}
        <ChartCard title="User Growth">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                New users this month
              </span>
              <span className="text-lg font-bold text-green-600">
                {(analyticsData?.userGrowth || [])[
                  (analyticsData?.userGrowth || []).length - 1
                ]?.newUsers || 0}
              </span>
            </div>
            <MiniChart
              data={(analyticsData?.userGrowth || []).map(
                (ug) => ug?.newUsers || 0
              )}
              color="#10B981"
              height={120}
            />
            <div className="space-y-2">
              {(analyticsData?.userGrowth || []).slice(-3).map((ug, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                  >
                    {ug?.month || "-"}
                  </span>
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    +{ug?.newUsers || 0} users
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Quick Insights */}
        <ChartCard title="Quick Insights">
          <div className="space-y-4">
            <div
              className={`p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                isDarkMode
                  ? "bg-white/5 border border-white/10 hover:bg-white/8"
                  : "bg-gray-50/80 border border-gray-200/60 hover:bg-gray-100/80"
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Approval rate increased by 5.2%
                </span>
              </div>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Compared to last month
              </p>
            </div>

            <div
              className={`p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                isDarkMode
                  ? "bg-white/5 border border-white/10 hover:bg-white/8"
                  : "bg-gray-50/80 border border-gray-200/60 hover:bg-gray-100/80"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Processing time reduced by 0.8 days
                </span>
              </div>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Average across all committees
              </p>
            </div>

            <div
              className={`p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                isDarkMode
                  ? "bg-white/5 border border-white/10 hover:bg-white/8"
                  : "bg-gray-50/80 border border-gray-200/60 hover:bg-gray-100/80"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.activeUsers} active users
                </span>
              </div>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of
                total users
              </p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Export Section */}
      <div className="liquid-card p-6 rounded-xl transition-all duration-500 ease-out transform hover:scale-[1.01] hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3
              className={`text-lg font-semibold mb-1 transition-all duration-300 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Export Analytics
            </h3>
            <p
              className={`text-sm transition-all duration-300 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Download detailed reports and insights
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${
                isDarkMode
                  ? "bg-white/10 text-white hover:bg-white/15 border border-white/20"
                  : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 border border-gray-200/60"
              }`}
            >
              <Download size={16} />
              <span>Export PDF</span>
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${
                isDarkMode
                  ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                  : "bg-gray-50/60 text-gray-600 hover:bg-gray-100/60 border border-gray-200/40"
              }`}
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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

      {/* Tab Navigation */}
      <div
        className={`flex space-x-1 p-1.5 rounded-xl w-fit transition-all duration-300 ${
          isDarkMode
            ? "bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm"
            : "bg-gray-100/80 border border-gray-200/50 backdrop-blur-sm"
        }`}
      >
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
            activeTab === "overview"
              ? isDarkMode
                ? "bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white shadow-lg border border-blue-500/30"
                : "bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white shadow-lg border border-blue-500/30"
              : isDarkMode
              ? "text-gray-300 hover:text-white hover:bg-gray-700/50 border border-transparent hover:border-gray-600/50"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/80 border border-transparent hover:border-gray-300/50"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
            activeTab === "analytics"
              ? isDarkMode
                ? "bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white shadow-lg border border-blue-500/30"
                : "bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white shadow-lg border border-blue-500/30"
              : isDarkMode
              ? "text-gray-300 hover:text-white hover:bg-gray-700/50 border border-transparent hover:border-gray-600/50"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/80 border border-transparent hover:border-gray-300/50"
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" ? renderOverviewTab() : renderAnalyticsTab()}
    </div>
  );
};

export default DashboardOverview;

{
  /* Custom CSS for enhanced tab styling */
}
<style jsx>{`
  .tab-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 6px;
  }

  .dark .tab-container {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .tab-button {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .tab-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  .tab-button:hover::before {
    left: 100%;
  }

  .tab-button.active {
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.9),
      rgba(37, 99, 235, 0.9)
    );
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    border: 1px solid rgba(59, 130, 246, 0.3);
  }

  .tab-button.active::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(59, 130, 246, 0.8),
      rgba(37, 99, 235, 0.8)
    );
    border-radius: 1px;
  }

  .dark .tab-button.active {
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.8),
      rgba(37, 99, 235, 0.8)
    );
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    border: 1px solid rgba(59, 130, 246, 0.4);
  }

  .tab-button:not(.active) {
    background: transparent;
    border: 1px solid transparent;
  }

  .tab-button:not(.active):hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .dark .tab-button:not(.active):hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
`}</style>;
