import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import Story from "../components/Story";
import ReelCard from "../components/ReelCard";
import EventCard from "../components/EventCard";
import VideoCard from "../components/VideoCard";
import CreatorCard from "../components/CreatorCard";
import HashtagCard from "../components/HashtagCard";

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [reels, setReels] = useState([]);
  const [events, setEvents] = useState([]);
  const [videos, setVideos] = useState([]);
  const [creators, setCreators] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState({
    posts: true,
    stories: true,
    reels: true,
    events: true,
    videos: true,
    creators: true,
    hashtags: true,
  });
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
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

  useEffect(() => {
    if (user && user._id) {
      const fetchData = async () => {
        try {
          const [
            postsRes,
            storiesRes,
            reelsRes,
            eventsRes,
            videosRes,
            creatorsRes,
            hashtagsRes,
          ] = await Promise.all([
            api.get("/explore/trending-posts").catch(() => ({ data: [] })),
            api.get(`/stories?userId=${user._id}`).catch(() => ({ data: [] })),
            api.get("/explore/trending-reels").catch(() => ({ data: [] })),
            api.get("/events").catch(() => ({ data: [] })),
            api.get("/videos").catch(() => ({ data: [] })),
            api
              .get("/explore/recommended-creators")
              .catch(() => ({ data: [] })),
            api.get("/explore/trending-hashtags").catch(() => ({ data: [] })),
          ]);
          setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
          setStories(Array.isArray(storiesRes.data) ? storiesRes.data : []);
          setReels(Array.isArray(reelsRes.data) ? reelsRes.data : []);
          setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
          setVideos(Array.isArray(videosRes.data) ? videosRes.data : []);
          setCreators(Array.isArray(creatorsRes.data) ? creatorsRes.data : []);
          setHashtags(Array.isArray(hashtagsRes.data) ? hashtagsRes.data : []);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Failed to load content. Please try again later.");
        } finally {
          setLoading({
            posts: false,
            stories: false,
            reels: false,
            events: false,
            videos: false,
            creators: false,
            hashtags: false,
          });
        }
      };
      fetchData();
    } else if (!authLoading) {
      setLoading({
        posts: false,
        stories: false,
        reels: false,
        events: false,
        videos: false,
        creators: false,
        hashtags: false,
      });
      setError("Please log in to view content.");
    }
  }, [user, authLoading]);

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
        case "story":
          payload = { media };
          endpoint = "/stories";
          break;
        default:
          throw new Error("Invalid content type");
      }
      await api.post(endpoint, payload);
      try {
        const res = await api.get(
          type === "post"
            ? "/explore/trending-posts"
            : type === "story"
              ? `/stories?userId=${user._id}`
              : endpoint
        );
        switch (type) {
          case "post":
            setPosts(Array.isArray(res.data) ? res.data : []);
            break;
          case "reel":
            setReels(Array.isArray(res.data) ? res.data : []);
            break;
          case "event":
            setEvents(Array.isArray(res.data) ? res.data : []);
            break;
          case "video":
            setVideos(Array.isArray(res.data) ? res.data : []);
            break;
          case "story":
            setStories(Array.isArray(res.data) ? res.data : []);
            break;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex items-center">
              <img
                src={user.avatar || "https://via.placeholder.com/150"}
                alt={user.username}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <h3 className="font-semibold">{user.username}</h3>
                <p className="text-sm text-gray-600">Vibe Creator</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-semibold mb-4">Trending Hashtags</h3>
            <div className="space-y-4">
              {loading.hashtags ? (
                <p>Loading hashtags...</p>
              ) : !Array.isArray(hashtags) || hashtags.length === 0 ? (
                <p className="text-gray-600">No trending hashtags</p>
              ) : (
                hashtags.map((hashtag) => (
                  <HashtagCard key={hashtag.name} hashtag={hashtag} />
                ))
              )}
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="lg:w-2/4">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Stories</h2>
            <div className="flex space-x-4 overflow-x-auto">
              {loading.stories ? (
                <p>Loading stories...</p>
              ) : !Array.isArray(stories) || stories.length === 0 ? (
                <p>No stories available</p>
              ) : (
                <>
                  <Story
                    story={{
                      user: {
                        _id: user._id,
                        username: user.username,
                        avatar: user.avatar,
                      },
                    }}
                    isOwnStory
                  />
                  {stories.map((story) => (
                    <Story key={story._id} story={story} />
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
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
                <option value="story">Story</option>
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
              {(newContent.type === "reel" ||
                newContent.type === "video" ||
                newContent.type === "story") && (
                <input
                  type="text"
                  placeholder="Media URL (e.g., YouTube or image URL)"
                  value={newContent.media}
                  onChange={(e) =>
                    setNewContent({ ...newContent, media: e.target.value })
                  }
                  className="mb-2 p-2 border border-gray-300 rounded-lg w-full"
                />
              )}
              {newContent.type === "video" && (
                <input
                  type="number"
                  placeholder="Duration (seconds)"
                  value={newContent.duration}
                  onChange={(e) =>
                    setNewContent({ ...newContent, duration: e.target.value })
                  }
                  className="mb-2 p-2 border border-gray-300 rounded-lg w-full"
                />
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
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-2 ${activeTab === "posts" ? "bg-vibe-pink text-white" : "bg-gray-200"} rounded-l-lg`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab("reels")}
              className={`px-4 py-2 ${activeTab === "reels" ? "bg-vibe-pink text-white" : "bg-gray-200"}`}
            >
              Reels
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-4 py-2 ${activeTab === "events" ? "bg-vibe-pink text-white" : "bg-gray-200"}`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`px-4 py-2 ${activeTab === "videos" ? "bg-vibe-pink text-white" : "bg-gray-200"} rounded-r-lg`}
            >
              Videos
            </button>
          </div>
          {loading[activeTab] ? (
            <p className="text-center">Loading...</p>
          ) : activeTab === "posts" &&
            (!Array.isArray(posts) || posts.length === 0) ? (
            <p className="text-gray-600 text-center">No posts available</p>
          ) : activeTab === "reels" &&
            (!Array.isArray(reels) || reels.length === 0) ? (
            <p className="text-gray-600 text-center">No reels available</p>
          ) : activeTab === "events" &&
            (!Array.isArray(events) || events.length === 0) ? (
            <p className="text-gray-600 text-center">No events available</p>
          ) : activeTab === "videos" &&
            (!Array.isArray(videos) || videos.length === 0) ? (
            <p className="text-gray-600 text-center">No videos available</p>
          ) : (
            <>
              {activeTab === "posts" &&
                posts.map((post) => <PostCard key={post._id} post={post} />)}
              {activeTab === "reels" &&
                reels.map((reel) => <ReelCard key={reel._id} reel={reel} />)}
              {activeTab === "events" &&
                events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              {activeTab === "videos" &&
                videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
            </>
          )}
        </div>
        {/* Right Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <h3 className="font-semibold mb-4">Top Creators</h3>
            <div className="space-y-4">
              {loading.creators ? (
                <p>Loading creators...</p>
              ) : !Array.isArray(creators) || creators.length === 0 ? (
                <p className="text-gray-600">No creators available</p>
              ) : (
                creators
                  .slice(0, 3)
                  .map((creator) => (
                    <CreatorCard key={creator._id} creator={creator} />
                  ))
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-semibold mb-4">Suggested Creators</h3>
            <div className="space-y-4">
              {loading.creators ? (
                <p>Loading suggested creators...</p>
              ) : !Array.isArray(creators) || creators.length === 0 ? (
                <p className="text-gray-600">No suggested creators</p>
              ) : (
                creators.slice(3, 6).map((creator) => (
                  <div key={creator._id} className="flex items-center">
                    <img
                      src={creator.avatar || "https://via.placeholder.com/150"}
                      alt={creator.username}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="flex-1">{creator.username}</span>
                    <button className="text-vibe-pink text-sm">Follow</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
