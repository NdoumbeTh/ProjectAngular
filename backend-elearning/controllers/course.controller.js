const db = require('../config/db');


// =========================
// CREATE COURSE
// =========================

exports.createCourse = (req, res) => {

  const { title, description } = req.body;

  // 🔥 récupérer depuis le token
  const teacher_id = req.userId;

  db.query(
    `
    INSERT INTO courses
    (title, description, teacher_id)
    VALUES (?, ?, ?)
    `,
    [title, description, teacher_id],
    (err, result) => {

      if(err){
        return res.status(500).json(err);
      }

      res.json({
        message: "Cours créé ✔"
      });

    }
  );

};


// =========================
// GET ALL
// =========================

exports.getCourses = (req, res) => {
  db.query(
    `SELECT 
       c.id,
       c.title,
       c.description,
       c.created_at,
       u.name as teacher
     FROM courses c
     LEFT JOIN users u ON u.id = c.teacher_id
     ORDER BY c.created_at DESC`,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};


// =========================
// GET ONE
// =========================

exports.getCourseById = (req, res) => {

  const id = req.params.id;

  db.query(
    `
    SELECT * FROM courses
    WHERE id = ?
    `,
    [id],
    (err, results) => {

      if(err){
        return res.status(500).json(err);
      }

      if(results.length === 0){
        return res.status(404).json({
          message: "Cours non trouvé"
        });
      }

      res.json(results[0]);

    }
  );

};


// =========================
// DELETE
// =========================

exports.deleteCourse = (req, res) => {

  const id = req.params.id;

  db.query(
    `
    DELETE FROM courses
    WHERE id = ?
    `,
    [id],
    (err) => {

      if(err){
        return res.status(500).json(err);
      }

      res.json({
        message: "Cours supprimé ✔"
      });

    }
  );

};