import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import ProfileHeader from "../components/ProfileHeader";
import PostCard from "../components/PostCard";
import ReelCard from "../components/ReelCard";
import EventCard from "../components/EventCard";
import VideoCard from "../components/VideoCard";
import CreatorCard from "../components/CreatorCard";

const Profile = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [events, setEvents] = useState([]);
  const [videos, setVideos] = useState([]);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState({
    posts: true,
    reels: true,
    events: true,
    videos: true,
    creator: true,
  });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [postsRes, reelsRes, eventsRes, videosRes, creatorRes] =
            await Promise.all([
              api.get(`/posts?userId=${user._id}`).catch(() => ({ data: [] })),
              api.get(`/reels?userId=${user._id}`).catch(() => ({ data: [] })),
              api
                .get(`/events?organizerId=${user._id}`)
                .catch(() => ({ data: [] })),
              api.get(`/videos?userId=${user._id}`).catch(() => ({ data: [] })),
              api
                .get(`/creators?userId=${user._id}`)
                .catch(() => ({ data: [] })),
            ]);
          setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
          setReels(Array.isArray(reelsRes.data) ? reelsRes.data : []);
          setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
          setVideos(Array.isArray(videosRes.data) ? videosRes.data : []);
          setCreator(
            Array.isArray(creatorRes.data) && creatorRes.data.length > 0
              ? creatorRes.data[0]
              : null
          );
        } catch (err) {
          setError(err.response?.data?.error || "Failed to load profile data");
        } finally {
          setLoading({
            posts: false,
            reels: false,
            events: false,
            videos: false,
            creator: false,
          });
        }
      };
      fetchData();
    }
  }, [user]);

  if (authLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader
        user={user}
        postCount={posts.length}
        reelCount={reels.length}
        eventCount={events.length}
        videoCount={videos.length}
        followerCount={creator?.followerCount || 0}
      />
      <div className="mt-6">
        <div className="flex space-x-4 mb-4 border-b">
          {["posts", "reels", "events", "videos", "creator"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-vibe-pink text-vibe-pink"
                  : "text-gray-600 hover:text-vibe-pink"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {activeTab === "posts" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Posts</h2>
            {loading.posts ? (
              <p>Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-gray-600">
                No posts yet. Share your first vibe!
              </p>
            ) : (
              posts.map((post) => <PostCard key={post._id} post={post} />)
            )}
          </div>
        )}
        {activeTab === "reels" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Reels</h2>
            {loading.reels ? (
              <p>Loading reels...</p>
            ) : reels.length === 0 ? (
              <p className="text-gray-600">
                No reels yet. Create your first reel!
              </p>
            ) : (
              reels.map((reel) => <ReelCard key={reel._id} reel={reel} />)
            )}
          </div>
        )}
        {activeTab === "events" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Your Events
            </h2>
            {loading.events ? (
              <p>Loading events...</p>
            ) : events.length === 0 ? (
              <p className="text-gray-600">
                No events yet. Host your first event!
              </p>
            ) : (
              events.map((event) => <EventCard key={event._id} event={event} />)
            )}
          </div>
        )}
        {activeTab === "videos" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Your Videos
            </h2>
            {loading.videos ? (
              <p>Loading videos...</p>
            ) : videos.length === 0 ? (
              <p className="text-gray-600">
                No videos yet. Share your first video!
              </p>
            ) : (
              videos.map((video) => <VideoCard key={video._id} video={video} />)
            )}
          </div>
        )}
        {activeTab === "creator" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Your Creator Profile
            </h2>
            {loading.creator ? (
              <p>Loading creator profile...</p>
            ) : !creator ? (
              <p className="text-gray-600">
                No creator profile yet. Become a creator!
              </p>
            ) : (
              <CreatorCard creator={creator} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
