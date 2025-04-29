import React, { useEffect, useState } from "react";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        window.location.href = "/auth";
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/events", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setEvents(data.data);
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load events");
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold gradient-text mb-4">Vibe Events</h1>
      <p className="text-gray-600 mb-6">
        Discover upcoming events hosted by VibeZone creators and communities.
        Join the fun or create your own event!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {events.length === 0 ? (
          <p className="text-gray-500">No events available.</p>
        ) : (
          events.map((event, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={`http://localhost:5000${event.image}`}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {event.title}
                </h3>
                <p className="text-gray-600">
                  {event.date} | {event.location}
                </p>
                <p className="text-gray-600">By {event.user.username}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
