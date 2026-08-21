const express = require('express');
const router = express.Router();

const controller = require('../controllers/assignment.controller');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/uploadAssignment'); 

const teacherOnly = (req, res, next) => {
  if(req.role !== 'teacher'){
    return res.status(403).json({message: "Accès refusé"});
  }
  next();
};

router.get('/teacher/all-submissions', auth, teacherOnly, controller.getTeacherSubmissions);
router.put('/submissions/:id/grade', auth, teacherOnly, controller.gradeSubmission);

// middleware teacher

// ✅ CREATE avec upload
router.post(
  '/',
  auth,
  teacherOnly,
  upload.single('file'), // ⚠️ DOIT MATCH FRONT
  controller.create
);

// GET
router.get('/course/:id', auth, controller.getByCourse);

// SUBMIT étudiant (upload fichier)
router.post(
  '/submit',
  auth,
  upload.single('file'), // ⚠️ IMPORTANT
  controller.submit
);

// submissions
router.get('/submissions/:id', auth, controller.getSubmissions);

router.put('/grade/:id', auth, teacherOnly, controller.grade);

// 👨‍🎓 récupérer MES submissions
router.get('/my/:courseId', auth, controller.getMySubmissions);

module.exports = router;