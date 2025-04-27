const Post = require("../models/Post");

exports.getPosts = (req, res) => {
  const { sort = "trending", category } = req.query;
  Post.findAll({ sort, category }, (err, posts) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(posts);
  });
};

exports.createPost = (req, res) => {
  const { content, imageUrl } = req.body;
  if (!content && !imageUrl)
    return res.status(400).json({ error: "Content or imageUrl is required" });
  Post.create(req.user.id, content, imageUrl, (err, post) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(post);
  });
};

exports.getPostById = (req, res) => {
  const { id } = req.params;
  Post.findById(id, (err, post) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  });
};

exports.updatePost = (req, res) => {
  const { id } = req.params;
  const { content, imageUrl } = req.body;
  if (!content && !imageUrl)
    return res.status(400).json({ error: "Content or imageUrl is required" });
  Post.update(id, req.user.id, content, imageUrl, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.changes === 0)
      return res.status(404).json({ error: "Post not found or unauthorized" });
    res.json({ message: "Post updated" });
  });
};

exports.deletePost = (req, res) => {
  const { id } = req.params;
  Post.delete(id, req.user.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.changes === 0)
      return res.status(404).json({ error: "Post not found or unauthorized" });
    res.json({ message: "Post deleted" });
  });
};
