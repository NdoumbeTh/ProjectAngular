const db = require('../config/db');

// soumettre devoir
exports.submitAssignment = (req, res) => {

const student_id = req.user.id;
const { assignment_id, file_url } = req.body;

db.query(
"INSERT INTO submissions (student_id, assignment_id, file_url) VALUES (?, ?, ?)",
[student_id, assignment_id, file_url],
(err) => {

if(err) return res.status(500).json(err);

res.json({message:"Devoir soumis"});
});
};


// voir mes soumissions
// 🔥 récupérer submissions étudiant
exports.getMySubmissions = (req, res) => {

  const student_id = req.user.id;
  const courseId = req.params.courseId;

  db.query(
    `SELECT s.*, a.title 
     FROM submissions s
     JOIN assignments a ON s.assignment_id = a.id
     WHERE s.student_id = ? AND a.course_id = ?`,
    [student_id, courseId],
    (err, results) => {

      if(err) return res.status(500).json(err);

      res.json(results);
    }
  );
};


// corriger (enseignant)
exports.gradeSubmission = (req, res) => {

const { submission_id, grade, feedback } = req.body;

db.query(
"UPDATE submissions SET grade=?, feedback=? WHERE id=?",
[grade, feedback, submission_id],
(err) => {

if(err) return res.status(500).json(err);

res.json({message:"Corrigé"});
});
};