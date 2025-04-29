import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faImage,
  faUserEdit,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

const Settings = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    password: "",
    avatar: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, avatar: file }));
    } else {
      setError("Please upload an image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUploading(true);

    try {
      let avatarUrl = user.avatar;
      if (formData.avatar) {
        const formDataUpload = new FormData();
        formDataUpload.append("media", formData.avatar);
        const uploadRes = await api.post("/uploads", formDataUpload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        avatarUrl = uploadRes.data.url;
      }

      const updateData = {
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        avatar: avatarUrl,
        ...(formData.password && { password: formData.password }),
      };

      const res = await api.patch("/users/me", updateData);
      setUser(res.data);
      setSuccess("Profile updated successfully");
      setFormData((prev) => ({ ...prev, password: "", avatar: null }));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-vibe-pink to-vibe-orange">
          Account Settings
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-pink"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-pink"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-pink"
              placeholder="Tell us about yourself"
              rows="4"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <div className="flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
              >
                <FontAwesomeIcon icon={faImage} className="mr-2" />
                {formData.avatar ? formData.avatar.name : "Choose Image"}
              </label>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              New Password (optional)
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-pink"
                placeholder="Enter new password"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-2 px-4 bg-gradient-to-r from-vibe-pink to-vibe-orange text-white rounded-lg hover:from-pink-600 hover:to-orange-600 disabled:opacity-50"
          >
            {uploading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
