import { model, Schema } from "mongoose";

const userSchma = new Schema({
  fname: String,
  lname: String,
  email: String,
  age: String,
  mobile: String,
  password: String,
  role: String,
  profileimage: String,
});

const userModel = model("users", userSchma);
export default userModel;
