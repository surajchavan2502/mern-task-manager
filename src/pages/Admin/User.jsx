import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import API from "../../utils/API";
import { FaEdit, FaTrash, FaPlus, FaFilter } from "react-icons/fa";

const User = () => {
  const [users, setUsers] = useState([]);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get("/api/protected/admin/user/");
      console.log("API Response:", response.data);

      if (Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        console.error("Expected an array but got:", response.data.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  const deleteUser = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await API.delete(
        `/api/protected/admin/user/delete/${id}`
      );
      console.log("User deleted:", response.data);

      // Refresh user list after deletion
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">User Management</h1>
        <button
          onClick={() => navigate("/admin/create-user")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <FaPlus />
          <span>Create User</span>
        </button>
      </div>

      {/* Filter Section */}

      {/* User Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-3">
                    {user.fname} {user.lname}
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.mobile}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3 flex justify-center space-x-3">
                    <button
                      onClick={() => navigate(`/admin/update-user/${user._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => deleteUser(user._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 p-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
