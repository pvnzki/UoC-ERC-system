import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  RefreshCw,
  Activity,
  PieChart,
  LineChart,
  Target,
  Award,
  Zap,
  Loader2,
} from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";
import { adminServices } from "../../../../services/admin-services";
import BeatLoader from "../../common/BeatLoader";

const Analytics = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const [analyticsData, setAnalyticsData] = useState({
    applicationTrends: [],
    committeePerformance: [],
    userGrowth: [],
    processingTimes: [],
    categoryDistribution: [],
    monthlyStats: [],
  });

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch basic stats and analytics data in parallel
      const [statsResponse, analyticsResponse] = await Promise.all([
        adminServices.getDashboardStats(),
        adminServices.getAnalyticsData(timeRange),
      ]);

      setStats(statsResponse);
      setAnalyticsData(analyticsResponse);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics data. Please try again.");

      // Fallback to mock data if API fails
      const mockData = generateMockAnalyticsData();
      setAnalyticsData(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock analytics data (replace with real API calls)
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
    fetchAnalyticsData();
  }, [timeRange]);

  const StatCard = ({ title, value, change, icon, color, subtitle }) => (
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
    <div className={`liquid-card p-6 rounded-xl transition-all duration-500 ease-out transform hover:scale-[1.01] hover:shadow-xl ${className}`}>
      <h3 className={`text-lg font-semibold mb-4 transition-all duration-300 ${
        isDarkMode ? "text-white" : "text-gray-900"
      }`}>
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
          <BeatLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Loading analytics data...
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
            onClick={fetchAnalyticsData}
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
            onClick={fetchAnalyticsData}
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

      {/* Key Metrics */}
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
              {analyticsData.applicationTrends.map((month, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center space-y-2"
                >
                  <div className="flex flex-col space-y-1 w-full">
                    <div
                      className="bg-blue-500 rounded-t"
                      style={{ height: `${(month.submitted / 50) * 200}px` }}
                    ></div>
                    <div
                      className="bg-green-500"
                      style={{ height: `${(month.approved / 50) * 200}px` }}
                    ></div>
                    <div
                      className="bg-red-500 rounded-b"
                      style={{ height: `${(month.rejected / 50) * 200}px` }}
                    ></div>
                  </div>
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {month.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Committee Performance */}
        <ChartCard title="Committee Performance">
          <div className="space-y-4">
            {analyticsData.committeePerformance.map((committee, index) => (
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
                    {committee.name}
                  </h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      committee.approvalRate >= 80
                        ? "bg-green-100 text-green-800"
                        : committee.approvalRate >= 70
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {committee.approvalRate}%
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Applications: {committee.applications}
                    </span>
                    <span
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Avg Time: {committee.avgTime} days
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(committee.applications / 50) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Category Distribution */}
        <ChartCard title="Research Categories">
          <div className="space-y-4">
            {analyticsData.categoryDistribution.map((category, index) => (
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
                    {category.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: `hsl(${index * 90}, 70%, 50%)`,
                      }}
                    ></div>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
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
                {stats.averageProcessingTime}
              </span>
            </div>
            <MiniChart
              data={analyticsData.processingTimes.map((pt) =>
                parseFloat(pt.averageDays)
              )}
              color="#3B82F6"
              height={120}
            />
            <div className="space-y-2">
              {analyticsData.processingTimes.slice(-3).map((pt, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                  >
                    {pt.month}
                  </span>
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    {pt.averageDays} days
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
                {analyticsData.userGrowth[analyticsData.userGrowth.length - 1]
                  ?.newUsers || 0}
              </span>
            </div>
            <MiniChart
              data={analyticsData.userGrowth.map((ug) => ug.newUsers)}
              color="#10B981"
              height={120}
            />
            <div className="space-y-2">
              {analyticsData.userGrowth.slice(-3).map((ug, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                  >
                    {ug.month}
                  </span>
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    +{ug.newUsers} users
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Quick Insights */}
        <ChartCard title="Quick Insights">
          <div className="space-y-4">
            <div className={`p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
              isDarkMode
                ? "bg-white/5 border border-white/10 hover:bg-white/8"
                : "bg-gray-50/80 border border-gray-200/60 hover:bg-gray-100/80"
            }`}>
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

            <div className={`p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
              isDarkMode
                ? "bg-white/5 border border-white/10 hover:bg-white/8"
                : "bg-gray-50/80 border border-gray-200/60 hover:bg-gray-100/80"
            }`}>
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

            <div className={`p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
              isDarkMode
                ? "bg-white/5 border border-white/10 hover:bg-white/8"
                : "bg-gray-50/80 border border-gray-200/60 hover:bg-gray-100/80"
            }`}>
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
};

export default Analytics;
 