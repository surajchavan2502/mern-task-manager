import { Router } from "express";
import {
  errorResponse,
  successResponse,
} from "../../../utils/serverResponse.js";
import TaskModel from "../../../models/TaskModel.js";
import userModel from "../../../models/Usermodel.js";
import CommentModel from "../../../models/CommentModel.js";
import { log } from "console";

const UserRouter = Router();

//api
UserRouter.get("/get-task", getUserTaskController);
UserRouter.put("/update-task", updateUserTaskController);
UserRouter.post("/comment/:taskId", commentUserController);
UserRouter.get("/comments/:taskId", getTaskCommentsController);
UserRouter.delete("/deletecomments", deleteCommentsController);
UserRouter.put("/updatestatus", updateTaskStatusController);
UserRouter.get("/gettasks/:id", getTaskByIdController);
UserRouter.get("/getUserStats", getuserstateController);
UserRouter.get("/profile", getUserProfileController);
export default UserRouter;

//controller for the user task
async function getUserTaskController(req, res) {
  try {
    const { email, role } = res.locals;

    if (role !== "user") {
      return errorResponse(res, 403, "Access denied. You must be a user.");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "User not found.");
    }

    const tasks = await TaskModel.find({ userId: user._id });

    if (tasks.length === 0) {
      return errorResponse(res, 404, "No tasks found for this user.");
    }

    return successResponse(res, "User's tasks retrieved successfully", tasks);
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

// controller for the update user task
async function updateUserTaskController(req, res) {
  try {
    const { taskId, status } = req.body;
    const updateTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!updateTask) {
      return errorResponse(res, 400, "Task not found");
    }

    successResponse(res, "Task updated sucessfully", updateTask);
  } catch (error) {
    console.log("_updateUserTaskController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}
async function commentUserController(req, res) {
  try {
    const { comment } = req.body;
    const { taskId } = req.params;
    const { userId, role } = res.locals;

    if (!taskId || !comment) {
      return errorResponse(res, 400, "Task ID and comment are required");
    }

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return errorResponse(res, 404, "Task not found");
    }

    // Create a new comment
    const newComment = await CommentModel.create({
      taskId,
      userId,
      role,
      comment,
    });

    // Push the new comment's ID into the task's comments array
    await TaskModel.findByIdAndUpdate(taskId, {
      $push: { comments: newComment._id },
    });

    return successResponse(res, "Comment added successfully", newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

// Fetch comments for a specific task
async function getTaskCommentsController(req, res) {
  try {
    const { taskId } = req.params;

    const comments = await CommentModel.find({ taskId })
      .populate("userId", "fname lname role")
      .select("comment createdAt userId");

    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}
async function deleteCommentsController(req, res) {
  try {
    const { commentId } = req.query;

    if (!commentId) {
      return errorResponse(res, 400, "Comment ID is required");
    }

    const deletedComment = await CommentModel.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return errorResponse(res, 404, "Comment not found");
    }

    return successResponse(res, "Comment deleted successfully", deletedComment);
  } catch (error) {
    console.error("Error deleting comment:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

async function updateTaskStatusController(req, res) {
  try {
    const { taskId, status } = req.body;

    if (!taskId || !status) {
      return errorResponse(res, 400, "Task ID and status are required");
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return errorResponse(res, 404, "Task not found");
    }

    return successResponse(
      res,
      "Task status updated successfully",
      updatedTask
    );
  } catch (error) {
    console.error("_updateTaskStatusController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

async function getTaskByIdController(req, res) {
  try {
    const { id } = req.params;
    console.log("taskid", id);

    if (!id) {
      return errorResponse(res, 400, "Task ID is required");
    }

    const task = await TaskModel.findById(id).populate("userId", "fname lname");
    if (!task) {
      return errorResponse(res, 404, "Task not found");
    }

    successResponse(res, "Task retrieved successfully", task);
  } catch (error) {
    console.error("getTaskByIdController Error:", error);
    errorResponse(res, 500, "Internal server error");
  }
}

async function getuserstateController(req, res) {
  try {
    const { userId } = res.locals; // Ensure you get the logged-in user's ID

    if (!userId) {
      return errorResponse(res, 401, "Unauthorized access. Please log in.");
    }

    // Fetch statistics from the database for the logged-in user
    const totalTasks = await TaskModel.countDocuments({ userId });
    const completedTasks = await TaskModel.countDocuments({
      userId,
      status: "completed",
    });
    const pendingTasks = await TaskModel.countDocuments({
      userId,
      status: "pending",
    });
    const delayedTasks = await TaskModel.countDocuments({
      userId,
      status: "delayed",
    });

    // Respond with user-specific stats
    return successResponse(res, "User stats retrieved successfully", {
      totalTasks,
      completedTasks,
      pendingTasks,
      delayedTasks,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}
// Controller for getting the user profile
async function getUserProfileController(req, res) {
  try {
    const { userId } = res.locals;
    if (!userId)
      return errorResponse(res, 401, "Unauthorized access. Please log in.");

    const user = await userModel.findById(userId).select("-password");
    if (!user) return errorResponse(res, 404, "User not found");

    console.log("User Data:", user); // Debugging: Check if age & mobile exist

    return successResponse(res, "User profile retrieved successfully", user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}
