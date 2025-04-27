exports.getLiveStreams = async (req, res) => {
  try {
    // Mock data (replace with real database query)
    const streams = [
      {
        id: 1,
        title: "Live Music Vibe",
        thumbnail: "/uploads/live1.jpg",
        user: { username: "vibe_creator" },
      },
      {
        id: 2,
        title: "Art Stream",
        thumbnail: "/uploads/live2.jpg",
        user: { username: "art_vibe" },
      },
    ];
    res.json({ success: true, data: streams });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
