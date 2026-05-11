const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');
const chapterRoutes = require('./routes/chapter.routes');
const quizRoutes = require('./routes/quiz.routes');
const assignmentRoutes = require('./routes/assignment.routes');
const submissionRoutes = require('./routes/submission.routes');
const adminRoutes = require('./routes/admin.routes');
const progressRoutes = require('./routes/progress.routes');


app.use('/api/progress', progressRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/quiz', quizRoutes);


app.use('/api/chapters', chapterRoutes);

app.use('/api/enrollments', enrollmentRoutes);

app.use('/api/courses', courseRoutes);

app.use('/api/auth', authRoutes);

app.listen(3000, () => {
console.log("Serveur démarré sur port 3000");
});