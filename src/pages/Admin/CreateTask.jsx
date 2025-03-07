import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import API from "../../utils/API";

const CreateTask = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState({
    userId: "",
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
  });
  const [users, setUsers] = useState([]);

  // Fetch users for the dropdown
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const fetchUsers = async () => {
      try {
        const response = await API.get("/api/protected/admin/task/users");
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.post("/api/protected/admin/task/create", task);
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Create New Task
        </h2>

        <div className="mt-4 space-y-4">
          {/* User Dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Assign to User
            </label>
            <select
              name="userId"
              value={task.userId}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="" disabled>
                Select a user
              </option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fname} {user.lname} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="4"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={task.status}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Create Task
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
