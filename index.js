import express from "express";
import path from "path";
import { MODE, PORT } from "./ServerConfig.js";
import publicRouter from "./routes/public/publicRouter.js";
import { authmiddleware } from "./utils/JwtToken.js";
import protectedRouter from "./routes/protected/protectedRouter.js";
import dbConnect from "./db.js";
import createSuperAdmin from "./utils/Superadmin.js";
import cors from "cors";
import UploadRouter from "./routes/public/UploadRouter.js";
const app = express();
const port = PORT;
const dir = path.resolve();

app.use(express.json());
app.use("/uploads", express.static("./uploads"));
if (MODE === "prod") {
  //static path
  app.use(express.static(path.join(dir, serverConfig.frontendpath)));
} else {
  app.use(cors());
}
//api
app.use("/api/upload", UploadRouter);
app.use("/api/public", publicRouter);
app.use("/api/protected", authmiddleware, protectedRouter);

try {
  await dbConnect();
  app.listen(port, () => {
    console.log(`app listinig at http://localhost:${port}`);
    createSuperAdmin();
  });
} catch (error) {
  console.log(error);
}
