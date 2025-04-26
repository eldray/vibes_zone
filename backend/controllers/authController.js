const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

exports.signup = (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    function (err) {
      if (err)
        return res.status(400).json({ error: "Username already exists" });
      const token = jwt.sign(
        { id: this.lastID, username },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.json({ token, user: { id: this.lastID, username } });
    }
  );
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err || !user) return res.status(400).json({ error: "User not found" });
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token, user: { id: user.id, username } });
  });
};
