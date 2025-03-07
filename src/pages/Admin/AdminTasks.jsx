import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import API from "../../utils/API";
import { FaEdit, FaTrash, FaCommentDots } from "react-icons/fa";

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [userFilter, setUserFilter] = useState("All");

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Prevents browser scrollbar

    const fetchTasks = async () => {
      try {
        const response = await API.get("/api/protected/admin/task/");
        setTasks(response?.data?.data ?? []);
      } catch (error) {
        console.error("Error fetching tasks", error);
        setTasks([]);
      }
    };

    fetchTasks();

    return () => {
      document.body.style.overflow = "auto"; // Reset on unmount
    };
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;
      const matchesUser =
        userFilter === "All" ||
        (task.userId &&
          `${task.userId.fname} ${task.userId.lname}` === userFilter);
      return matchesStatus && matchesUser;
    });
  }, [statusFilter, userFilter, tasks]);

  const allowedStatuses = ["All", "pending", "in progress", "completed"];

  const uniqueUsers = [
    "All",
    ...new Set(
      tasks.map((task) =>
        task.userId ? `${task.userId.fname} ${task.userId.lname}` : "Unknown"
      )
    ),
  ];

  const handleDelete = async (taskId) => {
    try {
      await API.delete(`/api/protected/admin/task/delete/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Admin Tasks</h1>
        <Link
          to="/admin/create-task"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Create Task
        </Link>
      </div>

      {/* Filter Section */}
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="block text-sm font-medium">Sort by Status:</label>
          <select
            className="border p-2 rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {allowedStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Sort by User:</label>
          <select
            className="border p-2 rounded-md"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          >
            {uniqueUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scrollable Tasks Table */}
      <div className="bg-white shadow-md rounded-lg p-4 flex-grow">
        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">User Name</th>
                <th className="p-3 text-left">Task Title</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Due Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id} className="border-t">
                  <td className="p-3">
                    {task.userId && task.userId.fname
                      ? `${task.userId.fname} ${task.userId.lname}`
                      : "Unknown"}
                  </td>
                  <td className="p-3">{task.title}</td>
                  <td className="p-3">{task.description}</td>
                  <td className="p-3">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 capitalize">{task.status}</td>
                  <td className="p-3 flex space-x-3">
                    <Link
                      to={`/admin/comments/${task._id}`}
                      className="text-green-600"
                    >
                      <FaCommentDots />
                    </Link>
                    <Link
                      to={`/admin/update-task/${task._id}`}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTasks.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTasks;
