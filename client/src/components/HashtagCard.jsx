const HashtagCard = ({ hashtag }) => {
  if (!hashtag || !hashtag.name) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        Invalid hashtag data
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="font-semibold text-lg">#{hashtag.name}</h3>
      <p className="text-gray-600 mt-1">{hashtag.count} posts</p>
    </div>
  );
};

export default HashtagCard;
