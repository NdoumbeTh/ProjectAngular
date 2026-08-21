const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  let token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token requis" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY", (err, decoded) => {

    if (err) {
      return res.status(401).json({ message: "Token invalide" });
    }

    req.user = decoded;
    req.userId = decoded.id;
    req.role = decoded.role;

    next();

  });

};