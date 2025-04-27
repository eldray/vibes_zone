const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = (req, res) => {
  const { username, password, email, displayName } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  User.create(username, password, email, displayName, (err, user) => {
    if (err) return res.status(400).json({ error: "Username already exists" });
    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token, user });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  User.findByUsername(username, (err, user) => {
    if (err || !user) return res.status(400).json({ error: "User not found" });
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Invalid password" });
    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({
      token,
      user: {
        id: user.id,
        username,
        email: user.email,
        displayName: user.displayName,
      },
    });
  });
};

exports.socialCallback = (req, res) => {
  const user = req.user;
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
  res.redirect(`/?page=home&token=${token}`);
};
