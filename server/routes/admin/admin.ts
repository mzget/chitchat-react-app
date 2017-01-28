import express = require('express');
const router = express.Router();
import path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
    next();
});

module.exports = router;