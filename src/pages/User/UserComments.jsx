import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import API from "../../utils/API";

const UserComments = () => {
  const { id: taskId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(null); // Store task details

  useEffect(() => {
    if (!taskId) {
      console.error("No taskId provided");
      return;
    }
    fetchTaskDetails(); // Fetch task details
    fetchComments();
  }, [taskId]);

  // Fetch Task Details
  const fetchTaskDetails = async () => {
    try {
      const response = await API.get(`/api/protected/user/get-task`);
      if (response.data && response.data.data) {
        const taskDetails = response.data.data.find(
          (task) => task._id === taskId
        );
        if (taskDetails) setTask(taskDetails);
      } else {
        console.error("Unexpected API Response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  // Fetch Comments
  const fetchComments = async () => {
    try {
      const response = await API.get(`/api/protected/user/comments/${taskId}`);

      if (response.data && response.data.data) {
        setComments(response.data.data);
      } else {
        console.error("Unexpected API Response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Submit Comment
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(`/api/protected/user/comment/${taskId}`, {
        comment: newComment,
      });

      if (response.data && response.data.data) {
        setComments((prev) => [...prev, response.data.data]);
        setNewComment("");
        fetchComments();
      } else {
        console.error("Unexpected API Response:", response.data);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 h-200 overflow-hidden flex flex-col mt-4">
      {/* Task Details Section */}
      {task && (
        <div className="p-4 mb-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-lg font-bold">{task.title}</h2>
          <p className="text-sm text-gray-600">{task.description}</p>
          <p className="text-xs text-gray-500">Status: {task.status}</p>
        </div>
      )}

      {/* Comments Section */}
      <h2 className="text-lg font-semibold mb-3">Task Comments</h2>
      <div className="flex-1 bg-white p-3 rounded-lg shadow overflow-y-auto">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c._id}
              className={`p-2 shadow rounded-lg mb-2 ${
                c.role === "admin" ? "bg-gray-200" : "bg-gray-100"
              }`}
            >
              <p className="text-sm font-semibold">
                {c.userId?.fname} {c.userId?.lname} (
                {c.role === "admin" ? "🛠️ Admin" : "👤 User"})
              </p>
              <p className="text-sm">{c.comment}</p>
              <p className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>

      {/* Comment Input Section */}
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Type a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleCommentSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserComments;
