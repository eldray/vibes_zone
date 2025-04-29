const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="font-semibold text-lg">{event.title}</h3>
      <p className="text-gray-600 mt-1">{event.description}</p>
      <p className="text-sm text-gray-500 mt-2">Date: {new Date(event.date).toLocaleString()}</p>
      <p className="text-sm text-gray-500">Location: {event.location}</p>
      <div className="flex items-center mt-2">
        <img src={event.organizer?.avatar} alt={event.organizer?.username} className="w-6 h-6 rounded-full mr-2" />
        <span className="text-sm">Organized by {event.organizer?.username}</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {event.hashtags.map((tag) => (
          <span key={tag} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default EventCard;