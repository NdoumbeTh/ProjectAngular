const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const ctrl = require('../controllers/progress.controller');

router.post('/mark', auth, ctrl.markCompleted);
router.get('/course/:courseId', auth, ctrl.getProgress);
router.get('/all', auth, ctrl.getAllProgress);

module.exports = router;