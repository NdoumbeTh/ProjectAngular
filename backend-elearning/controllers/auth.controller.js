const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {

const { name, email, password, role } = req.body;

const hashedPassword = bcrypt.hashSync(password, 8);

db.query(
"INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
[name, email, hashedPassword, role],
(err, result) => {

if(err) return res.status(500).json(err);

res.json({ message: "Utilisateur créé" });

});

};

// LOGIN 👉 TON CODE ICI
exports.login = (req, res) => {

  const { email, password } = req.body;

  if(!email || !password){
    return res.status(400).json({ message: "Champs manquants" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {

      // 🔥 IMPORTANT
      if(err){
        console.log("ERREUR SQL:", err);
        return res.status(500).json(err);
      }

      if(!results || results.length === 0){
        return res.status(404).json({message:"Utilisateur non trouvé"});
      }

      const user = results[0];

      const passwordIsValid = bcrypt.compareSync(password, user.password);

      if(!passwordIsValid){
        return res.status(401).json({message:"Mot de passe incorrect"});
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || "SECRET_KEY",
        { expiresIn: "24h" }
      );

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: token
      });

    }
  );
};
exports.registerByAdmin = (req, res) => {

  const { name, email, password, role } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);

  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role],
    (err) => {

      if(err) return res.status(500).json(err);

      res.json({ message: "Utilisateur créé par admin ✔" });

    }
  );

};