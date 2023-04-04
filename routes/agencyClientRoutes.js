const express = require('express');
const router = express.Router();
const agencyClientController = require('../controllers/agencyClientController');
const auth = require('../utils/auth');

router.post('/', auth.authenticateToken, agencyClientController.createAgencyClient);

router.put('/clients/:clientId', auth.authenticateToken, agencyClientController.updateClient);

router.get('/top-clients', auth.authenticateToken, agencyClientController.getTopClients);

module.exports = router;
