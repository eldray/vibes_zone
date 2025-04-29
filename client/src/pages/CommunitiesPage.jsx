import { useState, useEffect } from "react";
import api from "../utils/api";
import CommunityCard from "../components/CommunityCard";

const CommunitiesPage = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await api.get("/communities");
        setCommunities(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching communities:", error);
        setError("Failed to load communities");
        setLoading(false);
      }
    };
    fetchCommunities();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Communities</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : communities.length === 0 ? (
          <p>No communities found</p>
        ) : (
          communities.map((community) => (
            <CommunityCard key={community._id} community={community} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommunitiesPage;
