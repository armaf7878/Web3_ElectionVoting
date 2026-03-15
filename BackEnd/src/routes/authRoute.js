const express = require('express');
const router = express.Router();
const authController = require('../app/controller/authController');
const authMiddle = require('../app/midleware/authMiddleware');

router.get('/profile', authMiddle, authController.getProfile);
router.post('/verify-signature', authController.verifySignature);
router.post('/request-message', authController.requestMessage);
router.post('/getSignature', authController.getSign);

module.exports = router;