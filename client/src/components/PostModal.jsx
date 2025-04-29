import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faImage } from "@fortawesome/free-solid-svg-icons";
import api from "../utils/api";

const PostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type.startsWith("image/") || file.type.startsWith("video/"))
    ) {
      setMedia(file);
    } else {
      setError("Please upload an image or video");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      let mediaUrl = "";
      if (media) {
        const formData = new FormData();
        formData.append("media", media);
        const uploadRes = await api.post("/uploads", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        mediaUrl = uploadRes.data.url;
      }

      const postData = { content, media: mediaUrl ? [mediaUrl] : [] };
      await api.post("/posts", postData);
      setContent("");
      setMedia(null);
      onPostCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create post");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Create a Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's the vibe today?"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-pink mb-4"
            rows="4"
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image/Video
            </label>
            <div className="flex items-center">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
              >
                <FontAwesomeIcon icon={faImage} className="mr-2" />
                {media ? media.name : "Choose File"}
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-2 px-4 bg-gradient-to-r from-vibe-pink to-vibe-orange text-white rounded-lg hover:from-pink-600 hover:to-orange-600 disabled:opacity-50"
          >
            {uploading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
