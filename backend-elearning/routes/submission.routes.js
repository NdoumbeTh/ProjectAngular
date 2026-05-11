const express = require('express');
const router = express.Router();

const controller = require('../controllers/submission.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, controller.submitAssignment);
router.get('/my', auth, controller.getMySubmissions);
router.put('/grade', auth, controller.gradeSubmission);

module.exports = router;