import { Route, Routes } from "react-router";
import Signin from "./pages/Signin";
import AdminLayout from "./pages/Admin/AdminLayout";
import UserLayout from "./pages/User/UserLayout";
import AdminHome from "./pages/Admin/AdminHome";
import User from "./pages/Admin/User";
import AdminTasks from "./pages/Admin/AdminTasks";
import UpdateUser from "./pages/Admin/UpdateUser";
import CreateUser from "./pages/Admin/CreateUser";
import CreateTask from "./pages/Admin/CreateTask";
import UpdateTask from "./pages/Admin/UpdateTask";
import AdminComments from "./pages/Admin/AdminComments";
import UserTasks from "./pages/User/UserTasks";
import UserComments from "./pages/User/UserComments";
import UserHome from "./pages/User/UserHome";
import UserProfile from "./pages/User/UserProfile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Signin />} />

        {/**Admin */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="users" element={<User />} />
          <Route path="create-user" element={<CreateUser />} />
          <Route path="update-user/:id" element={<UpdateUser />} />
          <Route path="tasks" element={<AdminTasks />} />
          <Route path="create-task" element={<CreateTask />} />
          <Route path="update-task/:id" element={<UpdateTask />} />
          <Route path="comments/:id" element={<AdminComments />} />
        </Route>

        <Route path="/user" element={<UserLayout />}>
          <Route path="/user" element={<UserHome />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="tasks" element={<UserTasks />} />
          <Route path="comments/:id" element={<UserComments />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
