const fs = require("fs").promises;
const path = require("path");
const Reel = require("../models/Reel");

exports.uploadReel = (req, res) => {
  const { description, duration } = req.body;
  if (!req.file)
    return res.status(400).json({ error: "Video file is required" });
  const videoUrl = `/uploads/${req.file.filename}`;
  Reel.create(req.user.id, videoUrl, description, duration, (err, reel) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(reel);
  });
};

exports.getReels = (req, res) => {
  Reel.findAll((err, reels) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(reels);
  });
};

exports.getReelById = (req, res) => {
  const { id } = req.params;
  Reel.findById(id, (err, reel) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!reel) return res.status(404).json({ error: "Reel not found" });
    res.json(reel);
  });
};

exports.updateReel = (req, res) => {
  const { id } = req.params;
  const { description, duration } = req.body;
  const videoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  Reel.update(
    id,
    req.user.id,
    videoUrl,
    description,
    duration,
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.changes === 0)
        return res
          .status(404)
          .json({ error: "Reel not found or unauthorized" });
      res.json({ message: "Reel updated" });
    }
  );
};

exports.deleteReel = async (req, res) => {
  const { id } = req.params;
  Reel.findById(id, async (err, reel) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!reel) return res.status(404).json({ error: "Reel not found" });
    Reel.delete(id, req.user.id, async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.changes === 0)
        return res
          .status(404)
          .json({ error: "Reel not found or unauthorized" });
      try {
        const filePath = path.join(__dirname, "..", "public", reel.videoUrl);
        await fs.unlink(filePath);
      } catch (fileErr) {
        console.error("Failed to delete file:", fileErr);
      }
      res.json({ message: "Reel deleted" });
    });
  });
};
