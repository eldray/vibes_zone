import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";

const ProfileHeader = ({ user, postCount }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={user.avatar}
          alt={user.username}
          className="w-24 h-24 rounded-full border-4 border-vibe-pink"
        />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {user.username}
            </h2>
            <button className="text-vibe-pink hover:text-pink-600">
              <FontAwesomeIcon icon={faUserEdit} className="mr-1" />
              Edit Profile
            </button>
          </div>
          <div className="flex justify-center sm:justify-start gap-6 mt-4">
            <div>
              <span className="font-semibold">{postCount}</span> Posts
            </div>
            <div>
              <span className="font-semibold">{user.followers.length}</span>{" "}
              Followers
            </div>
            <div>
              <span className="font-semibold">{user.following.length}</span>{" "}
              Following
            </div>
          </div>
          <p className="mt-2 text-gray-600">{user.bio || "No bio yet"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
