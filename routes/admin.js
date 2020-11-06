const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const userFullValidator = require('../validations/signUpValidator');
const loginValidator = require('../validations/loginValidator');

router.post(
    '/admin', 
    userFullValidator(),
    adminController.registerNewAdmin);
router.get('/admins', adminController.getAdmins);
router.get('/admin/:adminId', adminController.getAdmin);
router.put(
    '/admin/:adminid', 
    userFullValidator(),
    adminController.updateAdmin
);
router.delete('/admin/:adminId', adminController.deleteAdmin)
router.post('/login',loginValidator(), adminController.loginAdmin);
router.put(
    "/activateAdmin/:id",
    adminController.togglePanelAdminStatus
);
router.put("/confirm/:id", adminController.toggleConfirmAdmin);
router.post("/invitation", adminController.sendInvitation);
router.get("/recievedToken", adminController.getRecievedToken)
module.exports = router;