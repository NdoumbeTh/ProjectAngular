const express = require('express');
const router = express.Router();

const courseController = require('../controllers/course.controller');
const auth = require('../middleware/auth.middleware');

// middleware teacher only
const teacherOnly = (req, res, next) => {

  if(req.role !== 'teacher'){
    return res.status(403).json({
      message: "Accès refusé"
    });
  }

  next();
};

// CREATE COURSE
router.post(
  '/',
  auth,
  teacherOnly,
  courseController.createCourse
);

// GET ALL
router.get(
  '/',
  auth,
  courseController.getCourses
);

// GET ONE
router.get(
  '/:id',
  auth,
  courseController.getCourseById
);

// DELETE
router.delete(
  '/:id',
  auth,
  teacherOnly,
  courseController.deleteCourse
);

module.exports = router;