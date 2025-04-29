const Story = ({ story, isOwnStory, openStoryModal }) => {
  const { user } = story;
  const username = isOwnStory ? "Your Story" : `@${user.username}`;
  const avatar = user.avatar || "https://via.placeholder.com/150";

  const handleClick = () => {
    console.log(`Viewing story for ${username}`);
    // Future: Navigate to story viewer
  };

  return (
    <div className="flex flex-col items-center space-y-1 flex-shrink-0">
      <div
        className="bg-gradient-to-r from-pink-400 via-pink-500 to-orange-400 p-[2px] rounded-full cursor-pointer"
        style={{
          backgroundImage: "linear-gradient(45deg, #FF9A8B, #FF6B95, #FF8E53)",
        }}
        onClick={handleClick}
      >
        <div className="border-2 border-white rounded-full">
          <img
            src={avatar}
            alt={`${username}'s story`}
            className="w-16 h-16 rounded-full object-cover"
          />
          {isOwnStory && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white z-10" />
          )}
        </div>
      </div>
      <span className="text-xs text-gray-900 text-center">{username}</span>
      {!isOwnStory && story.media && (
        <button
          onClick={() => openStoryModal(story.media)}
          className="text-pink-500 text-xs hover:text-pink-600"
        >
          View Story
        </button>
      )}
    </div>
  );
};

export default Story;
