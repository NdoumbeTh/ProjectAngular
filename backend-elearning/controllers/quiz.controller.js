const db = require('../config/db');


exports.createQuiz = (req, res) => {

  const { title, course_id, questions } = req.body;

  db.query(
    "INSERT INTO quizzes (title, course_id) VALUES (?, ?)",
    [title, course_id],
    (err, result) => {

      if (err) return res.status(500).json(err);

      const quizId = result.insertId;

      questions.forEach(q => {

        db.query(
          "INSERT INTO questions (question, quiz_id) VALUES (?, ?)",
          [q.question, quizId],
          (err, resultQ) => {

            if (err) return;

            const questionId = resultQ.insertId;

            q.options.forEach(opt => {

              db.query(
                "INSERT INTO options (option_text, is_correct, question_id) VALUES (?, ?, ?)",
                [opt.text, opt.isCorrect, questionId]
              );

            });

          }
        );

      });

      res.json({ message: "Quiz créé ✔" });
    }
  );

};



exports.getQuizFull = (req, res) => {

  const quizId = req.params.id;

  db.query(
    `
    SELECT 
      q.id as question_id,
      q.question,
      o.id as option_id,
      o.option_text,
      o.is_correct
    FROM questions q
    JOIN options o ON o.question_id = q.id
    WHERE q.quiz_id = ?
    `,
    [quizId],
    (err, results) => {

      if (err) return res.status(500).json(err);

      const quiz = {};

      results.forEach(row => {

        if (!quiz[row.question_id]) {
          quiz[row.question_id] = {
            id: row.question_id,
            question: row.question,
            options: []
          };
        }

        quiz[row.question_id].options.push({
          id: row.option_id,
          text: row.option_text,
          isCorrect: row.is_correct
        });

      });

      res.json(Object.values(quiz));

    }
  );

};

exports.deleteQuiz = (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM quizzes WHERE id=?",
    [id],
    (err) => {

      if (err) return res.status(500).json(err);

      res.json({ message: "Quiz supprimé ✔" });

    }
  );

};


// soumettre réponses
exports.submitQuiz = (req, res) => {
  const { quiz_id, answers } = req.body;
  const studentId = req.userId;

  db.query(
    `SELECT q.id as question_id, o.option_text, o.is_correct
     FROM questions q
     JOIN options o ON o.question_id = q.id
     WHERE q.quiz_id = ?`,
    [quiz_id],
    (err, results) => {
      if (err) return res.status(500).json(err);

      let score = 0;
      const correct = {};
      results.forEach(r => {
        if (r.is_correct) correct[r.question_id] = r.option_text;
      });

      answers.forEach(a => {
        if (correct[a.question_id] === a.answer) score++;
      });

      const total = Object.keys(correct).length;

      // Sauvegarder le score en base
      db.query(
        `INSERT INTO quiz_results (student_id, quiz_id, score, total)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE score = ?, total = ?, created_at = NOW()`,
        [studentId, quiz_id, score, total, score, total],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ score, total });
        }
      );
    }
  );
};

exports.getMyResults = (req, res) => {
  const studentId = req.userId;

  db.query(
    `SELECT
       qr.id,
       qr.score,
       qr.total,
       qr.created_at,
       qz.title as quiz_title,
       c.title as course_title,
       c.id as course_id,
       'quiz' as type
     FROM quiz_results qr
     JOIN quizzes qz ON qz.id = qr.quiz_id
     JOIN courses c ON c.id = qz.course_id
     WHERE qr.student_id = ?
     ORDER BY qr.created_at DESC`,
    [studentId],
    (err, quizResults) => {
      if (err) return res.status(500).json(err);

      db.query(
        `SELECT
           s.id,
           s.grade,
           s.feedback,
           s.created_at,
           a.title as assignment_title,
           c.title as course_title,
           c.id as course_id,
           'assignment' as type
         FROM submissions s
         JOIN assignments a ON a.id = s.assignment_id
         JOIN courses c ON c.id = a.course_id
         WHERE s.student_id = ?
         ORDER BY s.created_at DESC`,
        [studentId],
        (err, assignmentResults) => {
          if (err) return res.status(500).json(err);

          res.json({
            quiz: quizResults,
            assignments: assignmentResults
          });
        }
      );
    }
  );
};



// =========================
// GET QUIZ BY COURSE
// =========================

exports.getQuizByCourse = (req, res) => {
  const courseId = req.params.id;

  db.query(
    'SELECT * FROM quizzes WHERE course_id = ?',
    [courseId],
    (err, quizResults) => {
      if (err) return res.status(500).json(err);
      if (quizResults.length === 0) return res.json([]);

      let completed = 0;
      const allQuizzes = [];

      quizResults.forEach((quiz, quizIndex) => {

        db.query(
          'SELECT * FROM questions WHERE quiz_id = ?',
          [quiz.id],
          (err, questionResults) => {
            if (err) return res.status(500).json(err);

            if (questionResults.length === 0) {
              allQuizzes[quizIndex] = { ...quiz, questions: [] };
              completed++;
              if (completed === quizResults.length) return res.json(allQuizzes);
              return;
            }

            let questionsCompleted = 0;
            const finalQuestions = [];

            questionResults.forEach((q, qIndex) => {

              db.query(
                'SELECT * FROM options WHERE question_id = ?',
                [q.id],
                (err, optionResults) => {
                  if (err) return res.status(500).json(err);

                  finalQuestions[qIndex] = {
                    id: q.id,
                    question: q.question,
                    options: optionResults,
                    correctAnswer: optionResults.find(o => o.is_correct == 1)?.option_text || ''
                  };

                  questionsCompleted++;

                  if (questionsCompleted === questionResults.length) {
                    allQuizzes[quizIndex] = { ...quiz, questions: finalQuestions };
                    completed++;
                    if (completed === quizResults.length) return res.json(allQuizzes);
                  }
                }
              );
            });
          }
        );
      });
    }
  );
};