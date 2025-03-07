import React, { useEffect, useState } from "react";
import API from "../../utils/API";
import { FiCamera } from "react-icons/fi"; // Camera icon for upload

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await API.get("/api/protected/user/profile");
        setUser(response.data.data);
      } catch (err) {
        setError("Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Upload File to Server
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // ✅ Correct field name for Multer
    formData.append("userId", user._id); // ✅ Ensure user ID is sent

    try {
      const response = await API.post("/api/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setUser((prevUser) => ({
          ...prevUser,
          profileimage: response.data.filename, // ✅ Update profile image in state
        }));
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-600 text-xl">
        Loading profile...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full text-gray-800 border border-gray-200">
        {/* Profile Header */}
        <div className="flex flex-col items-center relative">
          <div className="relative">
            {user.profileimage ? (
              <img
                src={`/uploads/${user.profileimage}`}
                alt="User Avatar"
                className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-5xl font-semibold">
                {user.fname.charAt(0)}
                {user.lname.charAt(0)}
              </div>
            )}

            {/* Camera Icon for Upload */}
            <label
              htmlFor="imageUpload"
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer"
            >
              <FiCamera className="text-blue-500 text-xl" />
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>

          <h2 className="text-3xl font-bold mt-4">
            {user.fname} {user.lname}
          </h2>
          <p className="text-gray-500 capitalize">{user.role}</p>
        </div>

        {/* Profile Details */}
        <div className="mt-6 space-y-4 text-gray-700">
          <div className="flex items-center">
            <span className="mr-2 text-xl">📧</span>
            <strong>Email:</strong> <span className="ml-2">{user.email}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-xl">📞</span>
            <strong>Mobile:</strong> <span className="ml-2">{user.mobile}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-xl">🎂</span>
            <strong>Age:</strong> <span className="ml-2">{user.age}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-xl">💼</span>
            <strong>Role:</strong>{" "}
            <span className="ml-2 capitalize">{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
