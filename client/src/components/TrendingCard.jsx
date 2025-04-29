const TrendingCard = ({ post }) => {
  if (!post || !post.user) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">Invalid post data</div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center mb-2">
        <img
          src={post.user.avatar || "https://via.placeholder.com/150"}
          alt={post.user.username || "Unknown"}
          className="w-8 h-8 rounded-full mr-2"
        />
        <span className="font-semibold">{post.user.username || "Unknown"}</span>
      </div>
      <p className="text-gray-800">{post.content}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {post.hashtags &&
          post.hashtags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
      </div>
      <p className="text-sm text-gray-600 mt-2">
        {post.views || 0} views • Rank #{post.trendingRank}
      </p>
    </div>
  );
};

export default TrendingCard;
