const db = require('../config/db');

// CREATE devoir (teacher)
exports.create = (req, res) => {

  const { title, description, course_id, due_date } = req.body;

  // 🔥 fichier du sujet
  const file = req.file
    ? `http://localhost:3000/uploads/assignments/${req.file.filename}`
    : null;

  db.query(
    "INSERT INTO assignments (title, description, course_id, due_date, file_url) VALUES (?, ?, ?, ?, ?)",
    [title, description, course_id, due_date, file],
    (err) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({ message: "Devoir créé avec fichier ✔" });

    }
  );

};

// GET devoirs d’un cours
exports.getByCourse = (req, res) => {
  const courseId = req.params.id;

  db.query(
    "SELECT * FROM assignments WHERE course_id = ?",
    [courseId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// SUBMIT devoir (student)
exports.submit = (req, res) => {
  const { assignment_id, file_url } = req.body;
  const student_id = req.user.id;

  db.query(
    "INSERT INTO submissions (assignment_id, student_id, file_url) VALUES (?, ?, ?)",
    [assignment_id, student_id, file_url],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Soumission réussie ✔" });
    }
  );
};

// GET submissions (teacher)
exports.getSubmissions = (req, res) => {
  const assignment_id = req.params.id;

  db.query(
    "SELECT s.*, u.name FROM submissions s JOIN users u ON s.student_id = u.id WHERE assignment_id = ?",
    [assignment_id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// 👨‍🎓 voir mes soumissions pour un cours
exports.getMySubmissions = (req, res) => {
  const courseId = req.params.courseId;
  const student_id = req.user.id;

  db.query(
    `SELECT s.*, a.title AS assignment_title
     FROM submissions s
     JOIN assignments a ON s.assignment_id = a.id
     WHERE s.student_id = ? AND a.course_id = ?`,
    [student_id, courseId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// GRADE
exports.grade = (req, res) => {
  const { grade, feedback } = req.body;
  const id = req.params.id;

  db.query(
    "UPDATE submissions SET grade=?, feedback=? WHERE id=?",
    [grade, feedback, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Noté ✔" });
    }
  );
};

// 📥 Toutes les soumissions non corrigées de l'enseignant
exports.getTeacherSubmissions = (req, res) => {
  const teacherId = req.userId;

  db.query(
    `SELECT
       s.id,
       s.file_url,
       s.grade,
       s.feedback,
       s.created_at,
       u.name as student_name,
       a.title as assignment_title,
       a.id as assignment_id,
       c.title as course_title,
       c.id as course_id
     FROM submissions s
     JOIN users u ON u.id = s.student_id
     JOIN assignments a ON a.id = s.assignment_id
     JOIN courses c ON c.id = a.course_id
     WHERE c.teacher_id = ?
     ORDER BY s.created_at DESC`,
    [teacherId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// ✅ Corriger une soumission
exports.gradeSubmission = (req, res) => {
  const { grade, feedback } = req.body;
  const submissionId = req.params.id;

  db.query(
    `UPDATE submissions SET grade = ?, feedback = ? WHERE id = ?`,
    [grade, feedback, submissionId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Soumission corrigée ✔' });
    }
  );
};
// SUBMIT devoir (student)
exports.submit = (req, res) => {
  const assignment_id = req.body.assignment_id;
  const student_id = req.user.id;

  // 🔥 fichier uploadé
  const file = req.file
    ? `http://localhost:3000/uploads/submissions/${req.file.filename}`
    : null;

  if (!assignment_id || !file) {
    return res.status(400).json({ message: "Fichier obligatoire" });
  }

  db.query(
    "INSERT INTO submissions (assignment_id, student_id, file_url) VALUES (?, ?, ?)",
    [assignment_id, student_id, file],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Devoir envoyé ✔" });
    }
  );
};