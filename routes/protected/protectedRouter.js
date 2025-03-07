import { Router } from "express";
import AdminUserRouter from "./Admin/AdminUserRouter.js";
import { isSuperAdminMiddleware } from "../../utils/JwtToken.js";
import UserRouter from "./User/UserRouter.js";
import adminRouter from "./Admin/adminRouter.js";

const protectedRouter = Router();

//api

//route for admin
protectedRouter.use("/admin", isSuperAdminMiddleware, adminRouter);
protectedRouter.use("/user", UserRouter);
protectedRouter.get("/redirect", redirectController);

export default protectedRouter;

async function redirectController(req, res) {
  try {
    const role = res.locals.role;
    const path = `role${role}`;
    res.redirect(path);
  } catch (error) {
    return errorResponse(res, "not redirect");
  }
}
