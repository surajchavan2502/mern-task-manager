import { Router } from "express";
import taskModel from "../../../models/TaskModel.js";
import {
  errorResponse,
  successResponse,
} from "../../../utils/serverResponse.js";
import CommentModel from "../../../models/CommentModel.js";
import TaskModel from "../../../models/TaskModel.js";
import userModel from "../../../models/Usermodel.js";

const AdminTaskRouter = Router();

// Routes
AdminTaskRouter.get("/", getAllTasksController);
AdminTaskRouter.get("/gettasks/:id", getTaskByIdController);
AdminTaskRouter.post("/create", createTaskController);
AdminTaskRouter.put("/update/:id", updateTaskController);
AdminTaskRouter.delete("/delete/:id", deleteTaskAdminController);

AdminTaskRouter.post("/comment", commentAdminController);
AdminTaskRouter.get("/comments/:taskId", getTaskCommentsAdminController);
AdminTaskRouter.get("/users", adminDisplayUserListController);
AdminTaskRouter.get("/getAdminStats", getAdminStatsController);
export default AdminTaskRouter;

// Controller to get all tasks
async function getAllTasksController(req, res) {
  try {
    const tasks = await taskModel.find().populate("userId", "fname lname");
    successResponse(res, "All tasks found", tasks);
  } catch (error) {
    errorResponse(res, 500, "Internal server error");
  }
}

// Controller to create a new task
async function createTaskController(req, res) {
  try {
    const { title, description, status, dueDate, userId } = req.body;
    if (!title || !description || !dueDate || !userId) {
      return errorResponse(res, 400, "All fileds are required");
    }

    const newTask = await taskModel.create({
      title,
      description,
      dueDate,
      userId,
      currentDate: new Date(),
      status: status || "pending",
    });
    successResponse(res, "Task created successfully", newTask);
  } catch (error) {
    errorResponse(res, 500, "Internal server error");
  }
}
async function updateTaskController(req, res) {
  try {
    const id = req.params.id?.trim();
    const updateData = req.body;

    console.log("Received Task ID:", id);
    console.log("Update Data:", updateData);

    if (!id) {
      return errorResponse(res, 400, "Task ID is not provided");
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedTask) {
      return errorResponse(res, 404, "Task not found");
    }

    successResponse(res, "Task updated successfully", updatedTask);
  } catch (error) {
    console.log("updateTaskController Error:", error);
    errorResponse(res, 500, "Internal server error");
  }
}

// Controller to delete a task
async function deleteTaskAdminController(req, res) {
  try {
    const { id } = req.params;

    const deletedTask = await TaskModel.findByIdAndDelete(id);
    if (!deletedTask) {
      return errorResponse(res, 404, "Task not found");
    }

    return successResponse(res, "Task deleted successfully", deletedTask);
  } catch (error) {
    console.error("Error in deleteTaskAdminController:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

// Admin adds a comment
async function commentAdminController(req, res) {
  try {
    console.log("🔍 Request Body:", req.body);
    console.log("🔍 Extracted userId from res.locals:", res.locals.userId);

    const { taskId, comment } = req.body;
    const { userId, role } = res.locals;

    if (!taskId || !comment) {
      return errorResponse(res, 400, "Task ID and comment are required");
    }

    if (!userId) {
      return errorResponse(res, 400, "User ID is required");
    }

    const newComment = new CommentModel({
      taskId,
      userId,
      role,
      comment,
    });

    await newComment.save();

    return successResponse(res, "Comment added successfully", newComment);
  } catch (error) {
    console.error("_commentadminController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

// Fetch comments for a specific task
async function getTaskCommentsAdminController(req, res) {
  try {
    const { taskId } = req.params;
    console.log("Task ID Revevied", taskId);
    if (!taskId) {
      return errorResponse(res, 400, "Task Id is required");
    }

    const comments = await CommentModel.find({ taskId }).populate({
      path: "userId",
      model: "users",
      select: "fname lname role",
    });

    return successResponse(
      res,
      "Task comments retrieved successfully",
      comments
    );
  } catch (error) {
    console.error("_getTaskCommentsAdminController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

async function adminDisplayUserListController(req, res) {
  try {
    const users = await userModel.find({}, "_id fname lname email");

    return successResponse(res, "Users retrieved successfully", users);
  } catch (error) {
    console.error("_adminDisplayUserListController_ Error:", error);

    // Ensure the error response is JSON
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message, // Include error message for debugging
    });
  }
}

async function getTaskByIdController(req, res) {
  try {
    const { id } = req.params;
    console.log("taskid", id);

    if (!id) {
      return errorResponse(res, 400, "Task ID is required");
    }

    const task = await taskModel.findById(id).populate("userId", "fname lname");
    if (!task) {
      return errorResponse(res, 404, "Task not found");
    }
    console.log("task", task);

    successResponse(res, "Task retrieved successfully", task);
  } catch (error) {
    console.error("getTaskByIdController Error:", error);
    errorResponse(res, 500, "Internal server error");
  }
}

async function getAdminStatsController(req, res) {
  try {
    // Fetching statistics from the database
    const [totalUsers, totalTasks, completedTasks, pendingTasks, delayedTasks] =
      await Promise.all([
        userModel.countDocuments(),
        taskModel.countDocuments(),
        taskModel.countDocuments({ status: "completed" }),
        taskModel.countDocuments({ status: "pending" }),
        taskModel.countDocuments({ status: "in progress" }),
      ]);

    // Sending successful response with statistics
    return successResponse(res, "Admin stats retrieved successfully", {
      totalUsers,
      totalTasks,
      completedTasks,
      pendingTasks,
      delayedTasks,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

// Get comments for a specific task
AdminTaskRouter.get("/:taskId", async (req, res) => {
  try {
    const comments = await CommentModel.find({
      taskId: req.params.taskId,
    }).populate("userId", "fname lname");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching comments" });
  }
});

// Add a new comment to a task
AdminTaskRouter.post("/:taskId", async (req, res) => {
  try {
    const { userId, role, comment } = req.body;
    const newComment = new CommentModel({
      taskId: req.params.taskId,
      userId,
      role,
      comment,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Error adding comment" });
  }
});
