const express = require('express');
const router = express.Router();
const { createGame } = require('../controllers/gameController');

router.post('/game', createGame);

module.exports = router;