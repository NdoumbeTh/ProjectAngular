const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const auth = require('../middleware/auth.middleware');

const teacherOnly = (req, res, next) => {
  if (req.role !== 'teacher') return res.status(403).json({ message: "Accès refusé" });
  next();
};

// ⚠️ Toutes les routes FIXES avant les routes avec :id
router.post('/submit', auth, quizController.submitQuiz);
router.get('/my-results', auth, quizController.getMyResults);
router.get('/course/:id', quizController.getQuizByCourse);

// Routes avec paramètres dynamiques EN DERNIER
router.post('/', auth, teacherOnly, quizController.createQuiz);
router.get('/:id', auth, quizController.getQuizFull);
router.delete('/:id', auth, teacherOnly, quizController.deleteQuiz);

module.exports = router;