exports.getEvents = async (req, res) => {
  try {
    // Mock data (replace with real database query)
    const events = [
      {
        id: 1,
        title: "VibeZone Meetup",
        image: "/uploads/event1.jpg",
        date: "2025-05-01",
        location: "Online",
        user: { username: "vibe_host" },
      },
      {
        id: 2,
        title: "Creator Workshop",
        image: "/uploads/event2.jpg",
        date: "2025-06-01",
        location: "NYC",
        user: { username: "workshop_vibe" },
      },
    ];
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
