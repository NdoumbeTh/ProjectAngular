const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/admin/create-user', authMiddleware, (req, res, next) => {

  // 🔥 vérifier role admin
  if(req.role !== 'admin'){
    return res.status(403).json({message: "Accès refusé"});
  }

  next();

}, authController.registerByAdmin);
module.exports = router;