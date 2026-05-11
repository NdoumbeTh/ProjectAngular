const db = require('../config/db');

// CREATE
exports.create = (req, res) => {
console.log("BODY:", req.body);
console.log("FILE:", req.file);
  const { title, course_id } = req.body;

  if (!title || !course_id) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  // 🔥 construire URL complète
  const video = req.file 
    ? `http://localhost:3000/uploads/videos/${req.file.filename}` 
    : null;

  db.query(
    "INSERT INTO chapters (title, video_url, course_id) VALUES (?, ?, ?)",
    [title, video, course_id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({ message: "Chapitre ajouté ✔" });
    }
  );
};

// GET BY COURSE
exports.getByCourse = (req, res) => {
  const courseId = req.params.id;

  db.query(
    "SELECT * FROM chapters WHERE course_id = ?",
    [courseId],
    (err, results) => {
      if (err) return res.status(500).json(err);

      res.json(results);
    }
  );
};

// DELETE
exports.delete = (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM chapters WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Supprimé ✔" });
    }
  );
};
