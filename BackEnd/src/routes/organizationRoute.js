const express = require('express');
const router = express.Router();
const organController = require('../app/controller/organController');
const authMiddle = require('../app/midleware/authMiddleware');
 
router.get('/all', organController.getAllOrganizations);
router.get('/my', authMiddle, organController.getMyOrganizations);
router.get('/joined', authMiddle, organController.getJoinedOrganizations);
router.get('/organizations/:id', organController.getOrganization);
 
router.post('/create_organizations', authMiddle, organController.createOrganization);
router.post('/organizations/join', authMiddle, organController.joinOrganization);
router.post('/organizations/approve', authMiddle, organController.approveMember);
router.post('/organizations/reject', authMiddle, organController.rejectMember);



module.exports = router;