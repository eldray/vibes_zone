import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as faIcons from "@fortawesome/free-solid-svg-icons";

const CommunityCard = ({ community }) => {
  if (!community || !community.name) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 w-full">
        Invalid community data
      </div>
    );
  }

  // Map icon names to Font Awesome icons
  const getIcon = (iconName) => {
    const cleanIconName = iconName.replace(/^fas fa-/, "");
    const camelCaseIcon = `fa${cleanIconName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("")}`;
    return faIcons[camelCaseIcon] || faIcons.faUsers; // Fallback to faUsers
  };

  // Gradient and color based on community name
  const getGradient = (name) => {
    const gradients = [
      { gradient: "from-purple-100 to-pink-100", text: "text-purple-500" },
      { gradient: "from-blue-100 to-cyan-100", text: "text-blue-500" },
      { gradient: "from-yellow-100 to-orange-100", text: "text-orange-500" },
      { gradient: "from-green-100 to-teal-100", text: "text-green-500" },
    ];
    const index = name.length % gradients.length;
    return gradients[index];
  };

  const { gradient, text } = getGradient(community.name);

  const handleJoin = () => {
    console.log(`Joining community: ${community.name}`);
    // Future: POST to /api/communities/:id/join
  };

  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl p-4 transition-all duration-300 hover:shadow-glow-pink w-full`}
    >
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md mr-3">
          <FontAwesomeIcon
            icon={getIcon(community.icon)}
            className={`text-xl ${text}`}
          />
        </div>
        <h3 className="font-bold text-base">{community.name}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-3">{community.description}</p>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">
          {(community.memberCount / 1000).toFixed(1)}K members
        </span>
        <button
          onClick={handleJoin}
          className={`font-medium ${text}`}
          aria-label={`Join ${community.name}`}
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default CommunityCard;
