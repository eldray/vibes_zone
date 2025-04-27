const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: "Invalid ID" });
  next();
};

module.exports = validateId;
