const db = require('../config/db');

exports.enroll = (req, res) => {

const student_id = req.user.id; // ✅ maintenant OK
const { course_id } = req.body;

db.query(
"SELECT * FROM enrollments WHERE student_id=? AND course_id=?",
[student_id, course_id],
(err, results) => {

if(results.length > 0){
return res.status(400).json({message:"Déjà inscrit"});
}

db.query(
"INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)",
[student_id, course_id],
(err) => {

if(err) return res.status(500).json(err);

res.json({message:"Inscription réussie"});
});

});

};
exports.getMyCourses = (req, res) => {

const student_id = req.user.id; // ✅ depuis token

db.query(
`
SELECT courses.* 
FROM courses
JOIN enrollments ON courses.id = enrollments.course_id
WHERE enrollments.student_id = ?
`,
[student_id],
(err, results) => {

if(err) return res.status(500).json(err);

res.json(results);

});

};
exports.checkEnrollment = (req, res) => {

const student_id = req.user.id;
const course_id = req.params.courseId;

db.query(
"SELECT * FROM enrollments WHERE student_id=? AND course_id=?",
[student_id, course_id],
(err, results) => {

if(err) return res.status(500).json(err);

// ✅ true ou false
res.json({ enrolled: results.length > 0 });

});
};