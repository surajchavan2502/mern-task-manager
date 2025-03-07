import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import API from "../../utils/API";
import { FaTrash } from "react-icons/fa";

const AdminComments = () => {
  const { id: taskId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!taskId) {
      console.warn("No taskId provided to AdminComments");
      return;
    }
    fetchComments();
  }, [taskId]);

  const fetchComments = async () => {
    try {
      const response = await API.get(
        `/api/protected/admin/task/comments/${taskId}`
      );
      setComments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(`/api/protected/admin/task/comment`, {
        taskId,
        comment: newComment,
      });

      if (response.data && response.data.data) {
        setComments((prevComments) => [...prevComments, response.data.data]);
        setNewComment("");
        fetchComments();
      } else {
        console.error("Unexpected API Response:", response.data);
      }
    } catch (error) {
      console.error("Error posting comment:", error.message || error);
    }

    setLoading(false);
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-semibold mb-3">Task Comments</h2>
      <div className="mb-3">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c._id}
              className="p-2 bg-white shadow rounded-lg mb-2 flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-semibold">
                  {c.userId?.fname} {c.userId?.lname} ({c.role})
                </p>
                <p className="text-sm">{c.comment}</p>
                <p className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
      <div className="flex gap-2">
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
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AdminComments;
