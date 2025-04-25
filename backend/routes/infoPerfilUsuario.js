const express = require('express');
const router = express.Router();
const InfoPerfilUsuarioController = require('../controller/InfoPerfilUsuarioController');

router.get('/user-info/:userId', InfoPerfilUsuarioController.fetchUserInfo);

module.exports = router;
