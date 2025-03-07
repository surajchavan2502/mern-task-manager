import React, { useEffect, useState } from "react";
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import API from "../../utils/API";

const UserHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await API.get("/api/protected/user/getUserStats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        User Dashboard
      </h1>

      {/* Stats Section - Matching Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4].map((index) => <SkeletonCard key={index} />)
        ) : (
          <>
            <StatCard
              title="Total Tasks"
              value={stats?.totalTasks || 0}
              icon={FaTasks}
              color="text-purple-500"
            />
            <StatCard
              title="Completed Tasks"
              value={stats?.completedTasks || 0}
              icon={FaCheckCircle}
              color="text-green-500"
            />
            <StatCard
              title="Pending Tasks"
              value={stats?.pendingTasks || 0}
              icon={FaClock}
              color="text-yellow-500"
            />
            <StatCard
              title="Delayed Tasks"
              value={stats?.delayedTasks || 0}
              icon={FaExclamationTriangle}
              color="text-red-500"
            />
          </>
        )}
      </div>
    </div>
  );
};

// ✅ Reusable Stat Card Component (Matches Admin Design)
const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex items-center gap-4 transition-transform transform hover:scale-105">
      <Icon className={`text-4xl ${color}`} />
      <div>
        <h2 className="text-md font-medium text-gray-700 dark:text-gray-300">
          {title}
        </h2>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

// ✅ Skeleton Loading Component (For Placeholder)
const SkeletonCard = () => {
  return (
    <div className="bg-gray-300 dark:bg-gray-700 rounded-lg p-6 animate-pulse h-24"></div>
  );
};

export default UserHome;
