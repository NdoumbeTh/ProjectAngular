const express = require('express');
const router = express.Router();

const enrollmentController = require('../controllers/enrollment.controller');

const auth = require('../middleware/auth.middleware');

router.post('/', auth, enrollmentController.enroll);
router.get('/student', auth, enrollmentController.getMyCourses);
router.get('/check/:courseId', auth, enrollmentController.checkEnrollment);

module.exports = router;