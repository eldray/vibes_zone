import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faShare } from "@fortawesome/free-solid-svg-icons";

const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 transition-all hover:shadow-lg">
      <div className="p-4 flex items-center">
        <img
          src={post.user.avatar}
          alt={post.user.username}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="font-medium">{post.user.username}</h3>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="px-4 pb-4">
        <p className="text-gray-700">{post.content}</p>
        {post.media.length > 0 && (
          <img
            src={post.media[0]}
            alt="Post media"
            className="w-full h-64 object-cover rounded-lg mt-2"
          />
        )}
      </div>
      <div className="px-4 pb-4 flex justify-between text-sm text-gray-500">
        <button className="flex items-center hover:text-vibe-pink">
          <FontAwesomeIcon icon={faHeart} className="mr-1" />
          {post.likes.length}
        </button>
        <button className="flex items-center hover:text-vibe-pink">
          <FontAwesomeIcon icon={faComment} className="mr-1" />
          {post.comments.length}
        </button>
        <button className="flex items-center hover:text-vibe-pink">
          <FontAwesomeIcon icon={faShare} className="mr-1" />
          Share
        </button>
      </div>
    </div>
  );
};

export default PostCard;
