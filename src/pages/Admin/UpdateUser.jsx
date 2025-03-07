import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import API from "../../utils/API";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    role: "user",
  });

  // Fetch user details when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get(`/api/protected/admin/user/get/${id}`);
        if (response.data.data) {
          setUser({
            fname: response.data.data.fname || "",
            lname: response.data.data.lname || "",
            email: response.data.data.email || "",
            mobile: response.data.data.mobile || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [id]); // Runs only when `id` changes

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/api/protected/admin/user/update?id=${id}`, user);
      navigate("/admin/users");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Update User</h2>

      <label className="block">First Name</label>
      <input
        type="text"
        name="fname"
        value={user.fname}
        onChange={handleChange}
        className="w-full border p-2 mb-2"
      />

      <label className="block">Last Name</label>
      <input
        type="text"
        name="lname"
        value={user.lname}
        onChange={handleChange}
        className="w-full border p-2 mb-2"
      />

      <label className="block">Email</label>
      <input
        type="email"
        name="email"
        value={user.email}
        onChange={handleChange}
        className="w-full border p-2 mb-2"
      />

      <label className="block">Mobile</label>
      <input
        type="text"
        name="mobile"
        value={user.mobile}
        onChange={handleChange}
        className="w-full border p-2 mb-2"
      />

      <div className="flex space-x-2">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
        <button
          onClick={() => navigate("/admin/users")}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateUser;
