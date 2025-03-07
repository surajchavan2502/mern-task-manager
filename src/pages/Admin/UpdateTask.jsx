import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import API from "../../utils/API";

const UpdateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await API.get(
          `/api/protected/admin/task/gettasks/${id}`
        );

        setTask(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching task", error);
      }
    };

    if (id) fetchTask();
  }, [id]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      console.log("Sending Update Request:", task);
      await API.put(`/api/protected/admin/task/update/${id}`, task);
      navigate(-1);
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  return (
    <div className="flex items-center justify-center max-h-screen mt-30 bg-gray-50">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Update Task
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            placeholder="Task Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            placeholder="Task Description"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>

          <input
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex justify-between mt-6">
            <button
              onClick={handleUpdate}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              Update Task
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-all duration-200 ml-3"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTask;
