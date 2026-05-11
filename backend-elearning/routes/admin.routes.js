const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');

// 🔐 PROTECTION ADMIN
router.use(auth);

// accessible admin seulement
router.use((req, res, next) => {
  if(req.role !== 'admin'){
    return res.status(403).json({message: "Accès refusé"});
  }
  next();
});

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);
router.get('/enrollments-stats', adminController.getEnrollmentStats);
router.get('/enrollments-by-course', adminController.getEnrollmentsByCourse);

module.exports = router;