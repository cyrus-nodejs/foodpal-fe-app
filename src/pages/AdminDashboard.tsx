import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/app/hook";

import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../components/Toast";
import axios from "../config/axios";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "moderator";
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  profilePicture?: string;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalRecipes: number;
  totalCommunityPosts: number;
  systemHealth: "good" | "warning" | "critical";
}

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  userEmail: string;
}

export default function AdminDashboard() {
  const {   user } = useAppSelector((state) => state.auth)
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "users" | "moderation" | "analytics" | "settings"
  >("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<
    "all" | "user" | "admin" | "moderator"
  >("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  // useEffect(() => {
  //   if (user && user.role === "admin") {
  //     fetchSystemData();
  //   }
  // }, [user]);

  // const fetchSystemData = async () => {
  //   try {
  //     setIsLoading(true);
  //     await Promise.all([
  //       fetchUsers(),
  //       fetchSystemStats(),
  //       fetchActivityLogs(),
  //     ]);
  //   } catch (error) {
  //     console.error("Error fetching system data:", error);
  //     showToast("Failed to load system data", "error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const fetchUsers = async () => {
  //   try {
  //     const response = await axios.get(API_ENDPOINTS.ADMIN.USERS);
  //     setUsers(response.data.users || []);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   }
  // };

  // const fetchSystemStats = async () => {
  //   try {
  //     const response = await axios.get(API_ENDPOINTS.ADMIN.STATS);
  //     setSystemStats(response.data);
  //   } catch (error) {
  //     console.error("Error fetching system stats:", error);
  //   }
  // };

  // const fetchActivityLogs = async () => {
  //   try {
  //     const response = await axios.get(API_ENDPOINTS.ADMIN.ACTIVITY_LOGS);
  //     setActivityLogs(response.data.logs || []);
  //   } catch (error) {
  //     console.error("Error fetching activity logs:", error);
  //   }
  // };

  // const updateUserRole = async (
  //   userId: string,
  //   newRole: "user" | "admin" | "moderator"
  // ) => {
  //   try {
  //     setIsUpdatingUser(true);
  //     await axios.put(API_ENDPOINTS.ADMIN.UPDATE_USER_ROLE(userId), {
  //       role: newRole,
  //     });

  //     setUsers((prev) =>
  //       prev.map((user) =>
  //         user.id === userId ? { ...user, role: newRole } : user
  //       )
  //     );

  //     showToast(`User role updated to ${newRole}`, "success");
  //     setShowUserModal(false);
  //   } catch (error) {
  //     console.error("Error updating user role:", error);
  //     showToast("Failed to update user role", "error");
  //   } finally {
  //     setIsUpdatingUser(false);
  //   }
  // };

  // const toggleUserStatus = async (userId: string, isActive: boolean) => {
  //   try {
  //     await axios.put(API_ENDPOINTS.ADMIN.TOGGLE_USER_STATUS(userId), {
  //       isActive: !isActive,
  //     });

  //     setUsers((prev) =>
  //       prev.map((user) =>
  //         user.id === userId ? { ...user, isActive: !isActive } : user
  //       )
  //     );

  //     showToast(`User ${!isActive ? "activated" : "deactivated"}`, "success");
  //   } catch (error) {
  //     console.error("Error toggling user status:", error);
  //     showToast("Failed to update user status", "error");
  //   }
  // };

  // const deleteUser = async (userId: string) => {
  //   if (
  //     !window.confirm(
  //       "Are you sure you want to delete this user? This action cannot be undone."
  //     )
  //   ) {
  //     return;
  //   }

  //   try {
  //     await axios.delete(API_ENDPOINTS.ADMIN.DELETE_USER(userId));
  //     setUsers((prev) => prev.filter((user) => user.id !== userId));
  //     showToast("User deleted successfully", "success");
  //     setShowUserModal(false);
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //     showToast("Failed to delete user", "error");
  //   }
  // };

  // const exportUserData = async () => {
  //   try {
  //     const response = await axios.get(API_ENDPOINTS.ADMIN.EXPORT_USERS, {
  //       responseType: "blob",
  //     });

  //     const blob = new Blob([response.data], { type: "text/csv" });
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
  //     link.click();
  //     window.URL.revokeObjectURL(url);

  //     showToast("User data exported successfully", "success");
  //   } catch (error) {
  //     console.error("Error exporting user data:", error);
  //     showToast("Failed to export user data", "error");
  //   }
  // };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Check if user has admin permissions
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto max-w-4xl px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this admin dashboard.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, monitor system performance, and oversee platform
            operations
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: "overview", name: "Overview", icon: "📊" },
                { id: "users", name: "User Management", icon: "👥" },
                { id: "moderation", name: "Content Moderation", icon: "🛡️" },
                { id: "analytics", name: "Analytics", icon: "📈" },
                { id: "settings", name: "System Settings", icon: "⚙️" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    selectedTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="space-y-6">
            {/* System Stats Cards */}
            {systemStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">👥</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Total Users
                      </h3>
                      <p className="text-2xl font-semibold text-gray-900">
                        {systemStats.totalUsers.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                        <span className="text-green-600 font-semibold">🟢</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Active Users
                      </h3>
                      <p className="text-2xl font-semibold text-gray-900">
                        {systemStats.activeUsers.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">
                          📝
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Total Recipes
                      </h3>
                      <p className="text-2xl font-semibold text-gray-900">
                        {systemStats.totalRecipes.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center ${
                          systemStats.systemHealth === "good"
                            ? "bg-green-100"
                            : systemStats.systemHealth === "warning"
                            ? "bg-yellow-100"
                            : "bg-red-100"
                        }`}
                      >
                        <span
                          className={`font-semibold ${
                            systemStats.systemHealth === "good"
                              ? "text-green-600"
                              : systemStats.systemHealth === "warning"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {systemStats.systemHealth === "good"
                            ? "✅"
                            : systemStats.systemHealth === "warning"
                            ? "⚠️"
                            : "❌"}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        System Health
                      </h3>
                      <p
                        className={`text-2xl font-semibold capitalize ${
                          systemStats.systemHealth === "good"
                            ? "text-green-600"
                            : systemStats.systemHealth === "warning"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {systemStats.systemHealth}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                {activityLogs.length > 0 ? (
                  <div className="space-y-4">
                    {activityLogs.slice(0, 10).map((log) => (
                      <div key={log.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{log.userEmail}</span>{" "}
                            {log.action}
                          </p>
                          <p className="text-sm text-gray-500">{log.details}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === "users" && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Users</option>
                    <option value="moderator">Moderators</option>
                    <option value="admin">Admins</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <Button
                  //  onClick={exportUserData}
                    variant="outline">
                    📊 Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Users ({filteredUsers.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.profilePicture ? (
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={user.profilePicture}
                                  alt={`${user.firstName} ${user.lastName}`}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                                  <span className="text-white font-medium">
                                    {user.firstName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === "admin"
                                ? "bg-red-100 text-red-800"
                                : user.role === "moderator"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : "Never"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="text-primary hover:text-primary-dark mr-4"
                          >
                            Edit
                          </button>
                          <button
                            // onClick={() =>
                            //   toggleUserStatus(user.id, user.isActive)
                            // }
                            className={`mr-4 ${
                              user.isActive
                                ? "text-red-600 hover:text-red-900"
                                : "text-green-600 hover:text-green-900"
                            }`}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* User Edit Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Edit User: {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      defaultValue={selectedUser.role}
                      // onChange={(e) =>
                      //   updateUserRole(selectedUser.id, e.target.value as any)
                      // }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={isUpdatingUser}
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <button
                      // onClick={() => deleteUser(selectedUser.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete User
                    </button>
                    <Button
                      onClick={() => setShowUserModal(false)}
                      variant="outline"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content placeholders */}
        {selectedTab === "moderation" && (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Content Moderation
            </h3>
            <p className="text-gray-600">
              Moderation tools and flagged content will be displayed here.
            </p>
          </div>
        )}

        {selectedTab === "analytics" && (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Analytics Dashboard
            </h3>
            <p className="text-gray-600">
              Detailed analytics and reports will be displayed here.
            </p>
          </div>
        )}

        {selectedTab === "settings" && (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              System Settings
            </h3>
            <p className="text-gray-600">
              System configuration options will be displayed here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
