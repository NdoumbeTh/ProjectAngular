const express = require('express');
const router = express.Router();

const chapterController = require('../controllers/chapter.controller');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');

// 🔥 middleware role
const teacherOnly = (req, res, next) => {
  if (req.role !== 'teacher') {
    return res.status(403).json({ message: "Accès refusé" });
  }
  next();
};

// ✅ CREATE avec upload
router.post('/', auth, teacherOnly, upload.single('video'), chapterController.create);

// GET
router.get('/course/:id', auth, chapterController.getByCourse);

// DELETE
router.delete('/:id', auth, teacherOnly, chapterController.delete);

module.exports = router;