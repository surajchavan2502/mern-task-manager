import { Router } from "express";
import userModel from "../../../models/Usermodel.js";
import {
  errorResponse,
  successResponse,
} from "../../../utils/serverResponse.js";
import { hashPassword } from "../../../utils/encryptPassword.js";

const AdminUserRouter = Router();

AdminUserRouter.get("/", getAllUsersController);
AdminUserRouter.post("/create", createUsersController);
AdminUserRouter.put("/update", updateUsersController);
AdminUserRouter.delete("/delete/:id", deleteUserController);
AdminUserRouter.get("/get/:id", getUserByIdController);

export default AdminUserRouter;

//function for get all
async function getAllUsersController(req, res) {
  try {
    const user = await userModel.find();

    successResponse(res, "all users found", user);
  } catch (error) {
    errorResponse(res, 500, "internal server error");
  }
}

//function for update
async function updateUsersController(req, res) {
  try {
    const id = req.query.id?.trim();
    const updateData = req.body;

    if (!id) {
      return errorResponse(res, 400, "id is not provided");
    }

    const updatedataUser = await userModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    successResponse(res, "success", updatedataUser);
  } catch (error) {
    console.log("updateUsersController", error);
    errorResponse(res, 500, "internal server error");
  }
}

//function for delete
async function deleteUserController(req, res) {
  try {
    const { id } = req.params;

    if (!id || id.trim() === "") {
      return errorResponse(res, 400, "User ID is required");
    }

    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return errorResponse(res, 404, "User not found");
    }

    successResponse(res, "User deleted successfully", deletedUser);
  } catch (error) {
    console.error("__deleteUserController__", error);
    errorResponse(res, 500, "Internal server error");
  }
}

async function createUsersController(req, res) {
  try {
    const { fname, lname, email, password, age, mobile, role } = req.body;
    console.log("Create user:", req.body);

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 200, "Email already in use.");
    }

    // Hash the password correctly using await
    const hashedPassword = await hashPassword(password);

    // Create the user
    const newUser = await userModel.create({
      fname,
      lname,
      email,
      age,
      mobile,
      role,
      password: hashedPassword,
    });

    return successResponse(res, "User created successfully", newUser);
  } catch (error) {
    console.error("Error in createUsersController:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

async function getUserByIdController(req, res) {
  try {
    const user = await userModel.findById(req.params.id).select("fname lname");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log("_getUserByIdController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}
