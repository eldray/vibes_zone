import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import PostCard from "../components/PostCard";
import Story from "../components/Story";
import TrendingCard from "../components/TrendingCard";
import ReelCard from "../components/ReelCard";
import EventCard from "../components/EventCard";
import VideoCard from "../components/VideoCard";
import CreatorCard from "../components/CreatorCard";
import CommunityCard from "../components/CommunityCard";

const Social = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [reels, setReels] = useState([]);
  const [events, setEvents] = useState([]);
  const [videos, setVideos] = useState([]);
  const [creators, setCreators] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedStoryMedia, setSelectedStoryMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const carouselSlides = [
    {
      title: "Your Vibe",
      gradientText: "Attracts Your Tribe",
      description:
        "Connect with people who get you. Share your passions, discover new ones, and vibe together.",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80",
      cta: "Join The Movement",
    },
    {
      title: "Create",
      gradientText: "Your Wave",
      description:
        "Express yourself freely. No filters, no fakes. Just real connections with real people.",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      cta: "Start Creating",
    },
    {
      title: "Stay",
      gradientText: "Woke",
      description:
        "Be part of the conversation that matters. From social justice to climate action - your voice counts.",
      image:
        "https://images.unsplash.com/photo-1529333164857-423262e69c4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
      cta: "Get Involved",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          postsRes,
          storiesRes,
          reelsRes,
          eventsRes,
          videosRes,
          creatorsRes,
          communitiesRes,
        ] = await Promise.all([
          api.get("/posts"),
          api.get("/stories"),
          api.get("/reels"),
          api.get("/events"),
          api.get("/videos"),
          api.get("/creators"),
          api.get("/communities"),
        ]);
        setPosts(postsRes.data);
        setTrending(
          postsRes.data
            .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
            .slice(0, 6)
        );
        setStories(storiesRes.data);
        setReels(reelsRes.data);
        setEvents(eventsRes.data);
        setVideos(videosRes.data);
        setCreators(creatorsRes.data);
        const fetchedCommunities = communitiesRes.data;
        console.log("Fetched communities:", fetchedCommunities);
        setCommunities(fetchedCommunities);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load content");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  console.log("Rendering communities:", communities.slice(0, 4));

  const mockUser = {
    username: "You",
    avatar: "https://via.placeholder.com/150",
  };

  const openStoryModal = (media) => {
    setSelectedStoryMedia(media);
    setIsModalOpen(true);
  };

  const closeStoryModal = () => {
    setSelectedStoryMedia(null);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-poppins bg-gray-50">
      {/* Stories */}
      <div className="bg-white py-4 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            <Story
              story={{ user: mockUser }}
              isOwnStory
              openStoryModal={openStoryModal}
            />
            {stories.map((story) => (
              <Story
                key={story._id}
                story={story}
                openStoryModal={openStoryModal}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden bg-gray-900 h-96">
        <div className="relative h-full">
          {carouselSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    {slide.title}{" "}
                    <span className="bg-gradient-to-r from-pink-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                      {slide.gradientText}
                    </span>
                  </h1>
                  <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-6">
                    {slide.description}
                  </p>
                  <button
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                    aria-label={`Go to ${slide.cta}`}
                  >
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide
                    ? "bg-white opacity-100"
                    : "bg-white opacity-50"
                } focus:outline-none`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>

      {/* Story Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50"
          onClick={closeStoryModal}
        >
          <div
            className="relative max-w-[80vw] max-h-[80vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedStoryMedia}
              alt="Story"
              className="w-full h-full object-contain"
            />
            <button
              className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-colors"
              onClick={closeStoryModal}
              aria-label="Close story"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Trending */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">🔥 Trending Now</h2>
          <Link
            to="/trending"
            className="text-sm font-medium text-pink-500 hover:text-pink-600"
            aria-label="See all trending posts"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            trending.map((post, index) => (
              <TrendingCard
                key={post._id}
                post={{ ...post, trendingRank: index + 1 }}
              />
            ))
          )}
        </div>
      </div>

      {/* Communities */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            🌍 Communities You Might Like
          </h2>
          <Link
            to="/communities"
            className="text-sm font-medium text-pink-500 hover:text-pink-600"
            aria-label="See all communities"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : communities.length === 0 ? (
            <p>No communities available</p>
          ) : (
            communities
              .slice(0, 4)
              .map((community) => (
                <CommunityCard key={community._id} community={community} />
              ))
          )}
        </div>
      </div>

      {/* Reels */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">📹 Short Videos</h2>
          <Link
            to="/reels"
            className="text-sm font-medium text-pink-500 hover:text-pink-600"
            aria-label="See all videos"
          >
            See all
          </Link>
        </div>
        <div className="flex overflow-x-auto pb-4 -mx-2 px-2 space-x-4">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            reels.map((reel) => <ReelCard key={reel._id} reel={reel} />)
          )}
        </div>
      </div>

      {/* Events */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            🎉 Upcoming Events
          </h2>
          <Link
            to="/events"
            className="text-sm font-medium text-pink-500 hover:text-pink-600"
            aria-label="See all events"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            events.map((event) => <EventCard key={event._id} event={event} />)
          )}
        </div>
      </div>

      {/* Videos */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">🎥 Videos</h2>
          <Link
            to="/videos"
            className="text-sm font-medium text-pink-500 hover:text-pink-600"
            aria-label="See all videos"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            videos.map((video) => <VideoCard key={video._id} video={video} />)
          )}
        </div>
      </div>

      {/* Creators */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">⭐ Top Creators</h2>
          <Link
            to="/creators"
            className="text-sm font-medium text-pink-500 hover:text-pink-600"
            aria-label="See all creators"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            creators.map((creator) => (
              <CreatorCard key={creator._id} creator={creator} />
            ))
          )}
        </div>
      </div>

      {/* For You */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">✨ For You</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              All
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              Following
            </button>
            <button className="px-3 py-1 bg-pink-500 text-white rounded-full text-sm font-medium">
              Suggested
            </button>
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Social;
