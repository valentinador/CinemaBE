const express = require("express");
const { register, login, getMe, logout } = require("../controllers/auth");
const router = express.Router();
const {protect} = require('../middleware/auth')

router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/register').post(register);
router.route('/me').get(protect, getMe);

module.exports = router;