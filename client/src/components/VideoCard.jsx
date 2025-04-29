const VideoCard = ({ video }) => {
  const renderMedia = (mediaUrl) => {
    if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
      let embedUrl = mediaUrl.replace('watch?v=', 'embed/').replace('shorts/', 'embed/');
      if (embedUrl.includes('youtu.be')) {
        const videoId = embedUrl.split('/').pop();
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      return (
        <iframe
          className="w-full h-64 rounded-lg"
          src={embedUrl}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    return <video src={mediaUrl} controls className="w-full h-64 rounded-lg" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center mb-2">
        <img src={video.user?.avatar} alt={video.user?.username} className="w-8 h-8 rounded-full mr-2" />
        <span className="font-semibold">{video.user?.username}</span>
      </div>
      <h3 className="font-semibold text-lg">{video.title}</h3>
      {renderMedia(video.media)}
      <p className="mt-2">{video.description}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {video.hashtags.map((tag) => (
          <span key={tag} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-600 mt-2">
        {video.views} views • {video.duration / 60} min
      </p>
    </div>
  );
};

export default VideoCard;