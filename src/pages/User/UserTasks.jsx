import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import API from "../../utils/API";
import { FiMessageSquare } from "react-icons/fi";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

const UserTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await API.get("/api/protected/user/get-task");
      setTasks(response.data.data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await API.put("/api/protected/user/update-task", {
        taskId,
        status: newStatus.toLowerCase(),
      });

      if (response.data.success) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId
              ? { ...task, status: newStatus.toLowerCase() }
              : task
          )
        );
      }
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span className="flex items-center gap-2 px-3 py-1 text-yellow-700 bg-yellow-100 rounded-full text-sm font-medium">
            <MdOutlinePendingActions className="text-lg" /> Pending
          </span>
        );
      case "completed":
        return (
          <span className="flex items-center gap-2 px-3 py-1 text-green-700 bg-green-100 rounded-full text-sm font-medium">
            <FaCheckCircle className="text-lg" /> Completed
          </span>
        );
      case "in progress":
        return (
          <span className="flex items-center gap-2 px-3 py-1 text-blue-700 bg-blue-100 rounded-full text-sm font-medium">
            ⏳ In Progress
          </span>
        );
      case "delayed":
        return (
          <span className="flex items-center gap-2 px-3 py-1 text-red-700 bg-red-100 rounded-full text-sm font-medium">
            ⏰ Delayed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-gray-700 bg-gray-200 rounded-full text-sm font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200 mt-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">📌 My Tasks</h2>

      {loading ? (
        <p className="text-gray-500 text-center animate-pulse">
          Loading tasks...
        </p>
      ) : tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task._id}
            className="p-5 bg-gray-50 hover:bg-gray-100 transition-all rounded-lg shadow-sm border border-gray-200 mb-4"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {task.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>

            <div className="flex items-center justify-between mt-3">
              {/* Status Dropdown */}
              {task.status.toLowerCase() === "completed" ? (
                getStatusBadge(task.status)
              ) : (
                <select
                  value={task.status.toLowerCase()}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm bg-white shadow-sm hover:shadow-md transition-all focus:ring focus:ring-blue-300"
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
              )}

              {/* View & Comment Button */}
              <Link
                to={`/user/comments/${task._id}`}
                className="text-blue-600 text-sm flex items-center gap-2 hover:text-blue-800 transition-all"
              >
                <FiMessageSquare className="text-lg" />
                View & Comment
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No tasks available.</p>
      )}
    </div>
  );
};

export default UserTasks;
