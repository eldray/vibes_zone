const CreatorCard = ({ creator }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center">
        <img src={creator.user?.avatar} alt={creator.user?.username} className="w-12 h-12 rounded-full mr-2" />
        <div className="flex-1">
          <span className="font-semibold">{creator.user?.username}</span>
          <p className="text-sm text-gray-600">{creator.bio}</p>
          <p className="text-xs text-gray-500">{creator.followerCount} followers</p>
        </div>
        <button className="text-vibe-pink text-sm">Follow</button>
      </div>
    </div>
  );
};

export default CreatorCard;