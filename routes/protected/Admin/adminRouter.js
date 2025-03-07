import { Router } from "express";
import AdminUserRouter from "./AdminUserRouter.js";
import AdminTaskRouter from "./AdminTaskRouter.js";

const adminRouter = Router();

adminRouter.use("/user", AdminUserRouter);
adminRouter.use("/task", AdminTaskRouter);

export default adminRouter;
