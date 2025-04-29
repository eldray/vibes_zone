import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSlidersH,
  faMusic,
  faPaintBrush,
  faUtensils,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Navigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import TrendingCard from "../components/TrendingCard";
import HashtagCard from "../components/HashtagCard";
import CreatorCard from "../components/CreatorCard";
import ReelCard from "../components/ReelCard";
import EventCard from "../components/EventCard";
import VideoCard from "../components/VideoCard";
import ErrorBoundary from "../components/ErrorBoundary";

// Add FontAwesome icons to library
library.add(faMusic, faPaintBrush, faUtensils, faGamepad);

const Explore = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [creators, setCreators] = useState([]);
  const [reels, setReels] = useState([]);
  const [events, setEvents] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newContent, setNewContent] = useState({
    type: "post",
    content: "",
    media: "",
    title: "",
    description: "",
    hashtags: "",
    duration: "",
    date: "",
    location: "",
  });

  const categories = [
    { name: "All", icon: null, color: "" },
    { name: "Music", icon: faMusic, color: "text-purple-500" },
    { name: "Art", icon: faPaintBrush, color: "text-pink-500" },
    { name: "Food", icon: faUtensils, color: "text-yellow-500" },
    { name: "Gaming", icon: faGamepad, color: "text-blue-500" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trendingRes,
          hashtagsRes,
          creatorsRes,
          reelsRes,
          eventsRes,
          videosRes,
        ] = await Promise.all([
          api.get("/explore/trending-posts").catch(() => ({ data: [] })),
          api.get("/explore/trending-hashtags").catch(() => ({ data: [] })),
          api.get("/explore/recommended-creators").catch(() => ({ data: [] })),
          api.get("/reels").catch(() => ({ data: [] })),
          api.get("/events").catch(() => ({ data: [] })),
          api.get("/videos").catch(() => ({ data: [] })),
        ]);
        setTrendingPosts(
          Array.isArray(trendingRes.data) ? trendingRes.data : []
        );
        setHashtags(Array.isArray(hashtagsRes.data) ? hashtagsRes.data : []);
        setCreators(Array.isArray(creatorsRes.data) ? creatorsRes.data : []);
        setReels(Array.isArray(reelsRes.data) ? reelsRes.data : []);
        setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
        setVideos(Array.isArray(videosRes.data) ? videosRes.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user._id) {
      setError("Please log in to post content.");
      return;
    }
    try {
      const {
        type,
        content,
        media,
        title,
        description,
        hashtags,
        duration,
        date,
        location,
      } = newContent;
      const hashtagsArray = hashtags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      let payload;
      let endpoint;
      switch (type) {
        case "post":
          payload = { userId: user._id, content, hashtags: hashtagsArray };
          endpoint = "/posts";
          break;
        case "reel":
          payload = {
            userId: user._id,
            media,
            caption: content,
            hashtags: hashtagsArray,
          };
          endpoint = "/reels";
          break;
        case "event":
          payload = {
            title,
            description,
            organizerId: user._id,
            date,
            location,
            hashtags: hashtagsArray,
          };
          endpoint = "/events";
          break;
        case "video":
          payload = {
            userId: user._id,
            title,
            media,
            description,
            hashtags: hashtagsArray,
            duration: parseInt(duration),
          };
          endpoint = "/videos";
          break;
        default:
          throw new Error("Invalid content type");
      }
      await api.post(endpoint, payload);
      try {
        if (type === "post") {
          const trendingRes = await api.get("/explore/trending-posts");
          setTrendingPosts(
            Array.isArray(trendingRes.data) ? trendingRes.data : []
          );
        } else {
          const res = await api.get(endpoint);
          switch (type) {
            case "reel":
              setReels(Array.isArray(res.data) ? res.data : []);
              break;
            case "event":
              setEvents(Array.isArray(res.data) ? res.data : []);
              break;
            case "video":
              setVideos(Array.isArray(res.data) ? res.data : []);
              break;
          }
        }
      } catch (refreshError) {
        console.error("Error refreshing data:", refreshError);
        setError("Posted successfully, but failed to refresh content");
      }
      setNewContent({
        type: "post",
        content: "",
        media: "",
        title: "",
        description: "",
        hashtags: "",
        duration: "",
        date: "",
        location: "",
      });
    } catch (error) {
      console.error("Error posting content:", error);
      setError(error.response?.data?.error || "Failed to post content");
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-vibe-pink"
              placeholder="Search vibes, hashtags, people..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button className="p-1 rounded-full text-gray-400 hover:text-vibe-pink">
                <FontAwesomeIcon icon={faSlidersH} />
              </button>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-4">
            <form onSubmit={handleContentSubmit}>
              <select
                value={newContent.type}
                onChange={(e) =>
                  setNewContent({ ...newContent, type: e.target.value })
                }
                className="mb-2 p-2 border border-gray-300 rounded-lg w-full"
              >
                <option value="post">Post</option>
                <option value="reel">Reel</option>
                <option value="event">Event</option>
                <option value="video">Video</option>
              </select>
              {newContent.type === "event" && (
                <>
                  <input
                    type="text"
                    placeholder="Event Title"
                    value={newContent.title}
                    onChange={(e) =>
                      setNewContent({ ...newContent, title: e.target.value })
                    }
                    className="mb-2 p-2 border border-gray-300 rounded-lg w-full"
                  />
                  <input
                    type="datetime-local"
                    value={newContent.date}
                    onChange={(e) =>
                      setNewContent({ ...newContent, date: e.target.value })
                    }
                    className="mb-2 p-2 border border-gray-300 rounded-lg w-full"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={newContent.location}
                    onChange={(e) =>
                      setNewContent({ ...newContent, location: e.target.value })
                    }
                    className="mb-2 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </>
              )}
              {(newContent.type === "video" || newContent.type === "event") && (
                <textarea
                  placeholder="Description"
                  value={newContent.description}
                  onChange={(e) =>
                    setNewContent({
                      ...newContent,
                      description: e.target.value,
                    })
                  }
                  className="mb-2 p-2 border border-gray-300 rounded-lg w-full"
                />
              )}
              {(newContent.type === "reel" || newContent.type === "video") && (
                <>
                  <input
                    type="text"
                    placeholder="YouTube URL"
                    value={newContent.media}
                    onChange={(e) =>
                      setNewContent({ ...newContent, media: e.target.value })
                    }
                    className="mb-2 p-2 border border-gray-300 rounded-lg w-full"
                  />
                  {newContent.type === "video" && (
                    <input
                      type="number"
                      placeholder="Duration (seconds)"
                      value={newContent.duration}
                      onChange={(e) =>
                        setNewContent({
                          ...newContent,
                          duration: e.target.value,
                        })
                      }
                      className="mb-2 p-2 border border-gray-300 rounded-lg w-full"
                    />
                  )}
                </>
              )}
              {(newContent.type === "post" || newContent.type === "reel") && (
                <textarea
                  placeholder={
                    newContent.type === "post"
                      ? "What's the vibe today?"
                      : "Reel Caption"
                  }
                  value={newContent.content}
                  onChange={(e) =>
                    setNewContent({ ...newContent, content: e.target.value })
                  }
                  className="mb-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-vibe-pink"
                />
              )}
              {(newContent.type === "post" ||
                newContent.type === "reel" ||
                newContent.type === "event" ||
                newContent.type === "video") && (
                <input
                  type="text"
                  placeholder="Hashtags (comma-separated)"
                  value={newContent.hashtags}
                  onChange={(e) =>
                    setNewContent({ ...newContent, hashtags: e.target.value })
                  }
                  className="mb-2 p-2 border border-gray-300 rounded-lg w-full"
                />
              )}
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-gradient-to-r from-vibe-pink to-vibe-orange text-white rounded-lg"
              >
                Post
              </button>
            </form>
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ✨ Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:shadow-md transition-all ${
                  category.name === "All"
                    ? "bg-gradient-to-r from-vibe-pink to-vibe-orange text-white"
                    : ""
                }`}
              >
                {category.icon && (
                  <FontAwesomeIcon
                    icon={category.icon}
                    className={`mr-1 ${category.color}`}
                  />
                )}
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🔥 Trending Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : !Array.isArray(trendingPosts) || trendingPosts.length === 0 ? (
              <p>No trending posts available</p>
            ) : (
              trendingPosts.map((post, index) => (
                <TrendingCard
                  key={post._id}
                  post={{ ...post, trendingRank: index + 1 }}
                />
              ))
            )}
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📹 Trending Reels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : !Array.isArray(reels) || reels.length === 0 ? (
              <p>No reels available</p>
            ) : (
              reels.map((reel) => <ReelCard key={reel._id} reel={reel} />)
            )}
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🎉 Upcoming Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : !Array.isArray(events) || events.length === 0 ? (
              <p>No events available</p>
            ) : (
              events.map((event) => <EventCard key={event._id} event={event} />)
            )}
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🎥 Trending Videos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : !Array.isArray(videos) || videos.length === 0 ? (
              <p>No videos available</p>
            ) : (
              videos.map((video) => <VideoCard key={video._id} video={video} />)
            )}
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            # Trending Hashtags
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : !Array.isArray(hashtags) || hashtags.length === 0 ? (
              <p>No hashtags available</p>
            ) : (
              hashtags.map((hashtag) => (
                <HashtagCard key={hashtag.name} hashtag={hashtag} />
              ))
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ⭐ Recommended Creators
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : !Array.isArray(creators) || creators.length === 0 ? (
              <p>No creators available</p>
            ) : (
              creators.map((creator) => (
                <CreatorCard key={creator._id} creator={creator} />
              ))
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Explore;
