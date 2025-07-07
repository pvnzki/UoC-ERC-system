import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Bell,
  Palette,
  Shield,
  Save,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Info,
  Moon,
  Sun,
  Monitor,
  Volume2,
  VolumeX,
  Mail,
  Smartphone,
  Globe,
  Database,
  RefreshCw,
  Download,
  Upload,
  Trash2,
} from "lucide-react";
import { useTheme } from "../../../context/theme/ThemeContext";
import { useAuth } from "../../../../context/auth/AuthContext";
import ChangePasswordModal from "../genaral/ChangePasswordModal";
import adminServices from "../../../../services/admin-services";
import { toast } from "react-toastify";

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Add loading state for 2FA toggle
  const [twoFALoading, setTwoFALoading] = useState(false);

  // Sync 2FA state from user object
  useEffect(() => {
    if (user && typeof user.is_2fa_enabled === "boolean") {
      setSecuritySettings((prev) => ({
        ...prev,
        twoFactorAuth: user.is_2fa_enabled,
      }));
    }
  }, [user]);

  // Handler for toggling 2FA
  const handleToggle2FA = async (enabled) => {
    setTwoFALoading(true);
    try {
      if (enabled) {
        await adminServices.enable2FA();
        toast.success("Two-factor authentication enabled.");
      } else {
        await adminServices.disable2FA();
        toast.success("Two-factor authentication disabled.");
      }
      setSecuritySettings((prev) => ({ ...prev, twoFactorAuth: enabled }));
      // Update user context
      if (user && setUser) {
        setUser({ ...user, is_2fa_enabled: enabled });
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error ||
          err.message ||
          "Failed to update 2FA setting."
      );
    } finally {
      setTwoFALoading(false);
    }
  };

  // Form states
  const [accountForm, setAccountForm] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
    passwordExpiry: 90,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    applicationUpdates: true,
    meetingReminders: true,
    systemAlerts: true,
    marketingEmails: false,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: isDarkMode ? "dark" : "light",
    fontSize: "medium",
    compactMode: false,
    animations: true,
    highContrast: false,
  });

  const [systemSettings, setSystemSettings] = useState({
    autoSave: true,
    dataRetention: 365,
    backupFrequency: "daily",
    language: "en",
    timezone: "UTC",
  });

  const tabs = [
    {
      id: "account",
      label: "Account",
      icon: <User size={18} />,
      description: "Profile and personal information",
    },
    {
      id: "security",
      label: "Security",
      icon: <Shield size={18} />,
      description: "Password and security settings",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={18} />,
      description: "Email and push notifications",
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: <Palette size={18} />,
      description: "Theme and display preferences",
    },
    {
      id: "system",
      label: "System",
      icon: <Database size={18} />,
      description: "System and data settings",
    },
  ];

  const handleAccountSave = () => {
    // Handle account settings save
    console.log("Saving account settings:", accountForm);
  };

  const handleSecuritySave = () => {
    // Handle security settings save
    console.log("Saving security settings:", securitySettings);
  };

  const handleNotificationSave = () => {
    // Handle notification settings save
    console.log("Saving notification settings:", notificationSettings);
  };

  const handleAppearanceSave = () => {
    // Handle appearance settings save
    console.log("Saving appearance settings:", appearanceSettings);
  };

  const handleSystemSave = () => {
    // Handle system settings save
    console.log("Saving system settings:", systemSettings);
  };

  const handleThemeChange = (theme) => {
    setAppearanceSettings((prev) => ({ ...prev, theme }));
    if (theme === "dark" && !isDarkMode) {
      toggleTheme();
    } else if (theme === "light" && isDarkMode) {
      toggleTheme();
    }
  };

  const handleDataExport = () => {
    // Handle data export
    console.log("Exporting data...");
  };

  const handleDataImport = () => {
    // Handle data import
    console.log("Importing data...");
  };

  const handleClearData = () => {
    // Handle clear data
    console.log("Clearing data...");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Settings
          </h1>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Manage your account preferences and system settings
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="liquid-card p-4 rounded-xl">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 text-left ${
                      activeTab === tab.id
                        ? isDarkMode
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                        : isDarkMode
                        ? "text-gray-300 hover:bg-white/5 hover:text-white"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="flex-shrink-0">{tab.icon}</span>
                    <div>
                      <div className="font-medium">{tab.label}</div>
                      <div
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {tab.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="liquid-card p-6 rounded-xl">
              {/* Account Settings */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2
                      className={`text-2xl font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Account Settings
                    </h2>
                    <button
                      onClick={handleAccountSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>Save Changes</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        value={accountForm.firstName}
                        onChange={(e) =>
                          setAccountForm((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={accountForm.lastName}
                        onChange={(e) =>
                          setAccountForm((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={accountForm.email}
                        onChange={(e) =>
                          setAccountForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={accountForm.phone}
                        onChange={(e) =>
                          setAccountForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        }`}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Department
                      </label>
                      <input
                        type="text"
                        value={accountForm.department}
                        onChange={(e) =>
                          setAccountForm((prev) => ({
                            ...prev,
                            department: e.target.value,
                          }))
                        }
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2
                      className={`text-2xl font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Security Settings
                    </h2>
                    <button
                      onClick={handleSecuritySave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>Save Changes</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Change Password Section */}
                    <div className="liquid-card p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3
                          className={`text-lg font-medium ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          Password Management
                        </h3>
                        <button
                          onClick={() => setShowChangePasswordModal(true)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Change Password
                        </button>
                      </div>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Last changed:{" "}
                        {user?.password_changed_at
                          ? new Date(
                              user.password_changed_at
                            ).toLocaleDateString()
                          : "Never"}
                      </p>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="liquid-card p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3
                            className={`text-lg font-medium ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            Two-Factor Authentication
                          </h3>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.twoFactorAuth}
                            onChange={(e) => handleToggle2FA(e.target.checked)}
                            className="sr-only peer"
                            disabled={twoFALoading}
                          />
                          <div
                            className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                              isDarkMode
                                ? "bg-gray-600 peer-checked:bg-blue-600"
                                : "bg-gray-200 peer-checked:bg-blue-600"
                            }`}
                          ></div>
                        </label>
                      </div>
                    </div>

                    {/* Session Timeout */}
                    <div className="liquid-card p-4 rounded-lg">
                      <h3
                        className={`text-lg font-medium mb-3 ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Session Timeout
                      </h3>
                      <div className="flex items-center space-x-4">
                        <select
                          value={securitySettings.sessionTimeout}
                          onChange={(e) =>
                            setSecuritySettings((prev) => ({
                              ...prev,
                              sessionTimeout: parseInt(e.target.value),
                            }))
                          }
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          }`}
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={120}>2 hours</option>
                          <option value={480}>8 hours</option>
                        </select>
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Auto-logout after inactivity
                        </span>
                      </div>
                    </div>

                    {/* Login Notifications */}
                    <div className="liquid-card p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3
                            className={`text-lg font-medium ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            Login Notifications
                          </h3>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Get notified of new login attempts
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.loginNotifications}
                            onChange={(e) =>
                              setSecuritySettings((prev) => ({
                                ...prev,
                                loginNotifications: e.target.checked,
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div
                            className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                              isDarkMode
                                ? "bg-gray-600 peer-checked:bg-blue-600"
                                : "bg-gray-200 peer-checked:bg-blue-600"
                            }`}
                          ></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2
                      className={`text-2xl font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Notification Settings
                    </h2>
                    <button
                      onClick={handleNotificationSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>Save Changes</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(
                      ([key, value]) => (
                        <div key={key} className="liquid-card p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  key.includes("email")
                                    ? "bg-blue-100 text-blue-600"
                                    : key.includes("push")
                                    ? "bg-green-100 text-green-600"
                                    : key.includes("application")
                                    ? "bg-purple-100 text-purple-600"
                                    : key.includes("meeting")
                                    ? "bg-orange-100 text-orange-600"
                                    : key.includes("system")
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {key.includes("email") ? (
                                  <Mail size={16} />
                                ) : key.includes("push") ? (
                                  <Smartphone size={16} />
                                ) : key.includes("application") ? (
                                  <Upload size={16} />
                                ) : key.includes("meeting") ? (
                                  <Bell size={16} />
                                ) : key.includes("system") ? (
                                  <AlertTriangle size={16} />
                                ) : (
                                  <Globe size={16} />
                                )}
                              </div>
                              <div>
                                <h3
                                  className={`font-medium ${
                                    isDarkMode ? "text-white" : "text-gray-800"
                                  }`}
                                >
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </h3>
                                <p
                                  className={`text-sm ${
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {key.includes("email")
                                    ? "Receive notifications via email"
                                    : key.includes("push")
                                    ? "Receive push notifications"
                                    : key.includes("application")
                                    ? "Get notified about application updates"
                                    : key.includes("meeting")
                                    ? "Receive meeting reminders"
                                    : key.includes("system")
                                    ? "Get system alerts and updates"
                                    : "Receive marketing and promotional emails"}
                                </p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) =>
                                  setNotificationSettings((prev) => ({
                                    ...prev,
                                    [key]: e.target.checked,
                                  }))
                                }
                                className="sr-only peer"
                              />
                              <div
                                className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                                  isDarkMode
                                    ? "bg-gray-600 peer-checked:bg-blue-600"
                                    : "bg-gray-200 peer-checked:bg-blue-600"
                                }`}
                              ></div>
                            </label>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2
                      className={`text-2xl font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Appearance Settings
                    </h2>
                    <button
                      onClick={handleAppearanceSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>Save Changes</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Theme Selection */}
                    <div className="liquid-card p-4 rounded-lg">
                      <h3
                        className={`text-lg font-medium mb-4 ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Theme
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          {
                            id: "light",
                            label: "Light",
                            icon: <Sun size={20} />,
                          },
                          {
                            id: "dark",
                            label: "Dark",
                            icon: <Moon size={20} />,
                          },
                          {
                            id: "auto",
                            label: "Auto",
                            icon: <Monitor size={20} />,
                          },
                        ].map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => handleThemeChange(theme.id)}
                            className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center space-y-2 ${
                              appearanceSettings.theme === theme.id
                                ? isDarkMode
                                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                                  : "border-blue-500 bg-blue-50 text-blue-700"
                                : isDarkMode
                                ? "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            {theme.icon}
                            <span className="font-medium">{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Size */}
                    <div className="liquid-card p-4 rounded-lg">
                      <h3
                        className={`text-lg font-medium mb-3 ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Font Size
                      </h3>
                      <div className="flex items-center space-x-4">
                        <select
                          value={appearanceSettings.fontSize}
                          onChange={(e) =>
                            setAppearanceSettings((prev) => ({
                              ...prev,
                              fontSize: e.target.value,
                            }))
                          }
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          }`}
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                    </div>

                    {/* Other Appearance Options */}
                    <div className="space-y-4">
                      {[
                        {
                          key: "compactMode",
                          label: "Compact Mode",
                          description: "Reduce spacing for more content",
                        },
                        {
                          key: "animations",
                          label: "Animations",
                          description:
                            "Enable smooth transitions and animations",
                        },
                        {
                          key: "highContrast",
                          label: "High Contrast",
                          description:
                            "Increase contrast for better visibility",
                        },
                      ].map((option) => (
                        <div
                          key={option.key}
                          className="liquid-card p-4 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3
                                className={`font-medium ${
                                  isDarkMode ? "text-white" : "text-gray-800"
                                }`}
                              >
                                {option.label}
                              </h3>
                              <p
                                className={`text-sm ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                {option.description}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={appearanceSettings[option.key]}
                                onChange={(e) =>
                                  setAppearanceSettings((prev) => ({
                                    ...prev,
                                    [option.key]: e.target.checked,
                                  }))
                                }
                                className="sr-only peer"
                              />
                              <div
                                className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                                  isDarkMode
                                    ? "bg-gray-600 peer-checked:bg-blue-600"
                                    : "bg-gray-200 peer-checked:bg-blue-600"
                                }`}
                              ></div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === "system" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2
                      className={`text-2xl font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      System Settings
                    </h2>
                    <button
                      onClick={handleSystemSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>Save Changes</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Data Management */}
                    <div className="liquid-card p-4 rounded-lg">
                      <h3
                        className={`text-lg font-medium mb-4 ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Data Management
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          onClick={handleDataExport}
                          className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors flex flex-col items-center space-y-2"
                        >
                          <Download size={20} className="text-blue-600" />
                          <span className="font-medium">Export Data</span>
                          <span className="text-sm text-gray-600">
                            Download your data
                          </span>
                        </button>
                        <button
                          onClick={handleDataImport}
                          className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors flex flex-col items-center space-y-2"
                        >
                          <Upload size={20} className="text-green-600" />
                          <span className="font-medium">Import Data</span>
                          <span className="text-sm text-gray-600">
                            Upload your data
                          </span>
                        </button>
                        <button
                          onClick={handleClearData}
                          className="p-4 rounded-lg border-2 border-gray-200 hover:border-red-500 transition-colors flex flex-col items-center space-y-2"
                        >
                          <Trash2 size={20} className="text-red-600" />
                          <span className="font-medium">Clear Data</span>
                          <span className="text-sm text-gray-600">
                            Delete all data
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Auto Save */}
                    <div className="liquid-card p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3
                            className={`text-lg font-medium ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            Auto Save
                          </h3>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Automatically save your work
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={systemSettings.autoSave}
                            onChange={(e) =>
                              setSystemSettings((prev) => ({
                                ...prev,
                                autoSave: e.target.checked,
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div
                            className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                              isDarkMode
                                ? "bg-gray-600 peer-checked:bg-blue-600"
                                : "bg-gray-200 peer-checked:bg-blue-600"
                            }`}
                          ></div>
                        </label>
                      </div>
                    </div>

                    {/* Data Retention */}
                    <div className="liquid-card p-4 rounded-lg">
                      <h3
                        className={`text-lg font-medium mb-3 ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Data Retention
                      </h3>
                      <div className="flex items-center space-x-4">
                        <select
                          value={systemSettings.dataRetention}
                          onChange={(e) =>
                            setSystemSettings((prev) => ({
                              ...prev,
                              dataRetention: parseInt(e.target.value),
                            }))
                          }
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          }`}
                        >
                          <option value={30}>30 days</option>
                          <option value={90}>90 days</option>
                          <option value={180}>6 months</option>
                          <option value={365}>1 year</option>
                          <option value={730}>2 years</option>
                        </select>
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Keep data for
                        </span>
                      </div>
                    </div>

                    {/* Language and Timezone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="liquid-card p-4 rounded-lg">
                        <h3
                          className={`text-lg font-medium mb-3 ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          Language
                        </h3>
                        <select
                          value={systemSettings.language}
                          onChange={(e) =>
                            setSystemSettings((prev) => ({
                              ...prev,
                              language: e.target.value,
                            }))
                          }
                          className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          }`}
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="ar">Arabic</option>
                        </select>
                      </div>

                      <div className="liquid-card p-4 rounded-lg">
                        <h3
                          className={`text-lg font-medium mb-3 ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          Timezone
                        </h3>
                        <select
                          value={systemSettings.timezone}
                          onChange={(e) =>
                            setSystemSettings((prev) => ({
                              ...prev,
                              timezone: e.target.value,
                            }))
                          }
                          className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          }`}
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">Eastern Time</option>
                          <option value="CST">Central Time</option>
                          <option value="MST">Mountain Time</option>
                          <option value="PST">Pacific Time</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}
    </div>
  );
};

export default Settings;
