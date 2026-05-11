const express = require('express');
const router = express.Router();

const controller = require('../controllers/assignment.controller');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/uploadAssignment'); 
router.get('/teacher/all-submissions', auth, teacherOnly, assignmentController.getTeacherSubmissions);
router.put('/submissions/:id/grade', auth, teacherOnly, assignmentController.gradeSubmission);

// middleware teacher
const teacherOnly = (req, res, next) => {
  if(req.role !== 'teacher'){
    return res.status(403).json({message: "Accès refusé"});
  }
  next();
};

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