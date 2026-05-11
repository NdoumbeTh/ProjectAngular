const db = require('../config/db');

// 📊 stats inscriptions par jour
exports.getEnrollmentStats = (req, res) => {
    
  db.query(
    `
    SELECT DATE(created_at) as date, COUNT(*) as total
    FROM enrollments
    GROUP BY DATE(created_at)
    ORDER BY date ASC
    `,
    (err, results) => {

      if (err) {
        console.log("ERREUR SQL:", err);
        return res.status(500).json(err);
      }

      res.json(results);
    }
  );

};

// 📊 stats
exports.getStats = (req, res) => {

  const stats = {};

  db.query("SELECT COUNT(*) AS users FROM users", (err, users) => {
    stats.users = users[0].users;

    db.query("SELECT COUNT(*) AS courses FROM courses", (err, courses) => {
      stats.courses = courses[0].courses;

      db.query("SELECT COUNT(*) AS enrollments FROM enrollments", (err, enrollments) => {
        stats.enrollments = enrollments[0].enrollments;

        res.json(stats);
      });
    });
  });

};


// 👥 utilisateurs
exports.getUsers = (req, res) => {
  db.query("SELECT id, name, email, role FROM users", (err, results) => {
    res.json(results);
  });
};
// 📊 inscriptions par cours
exports.getEnrollmentsByCourse = (req, res) => {
  db.query(
    `SELECT c.title, COUNT(e.id) as total
     FROM courses c
     LEFT JOIN enrollments e ON e.course_id = c.id
     GROUP BY c.id, c.title
     ORDER BY total DESC
     LIMIT 6`,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// ❌ supprimer utilisateur
exports.deleteUser = (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    res.json({ message: "Utilisateur supprimé" });
  });
};