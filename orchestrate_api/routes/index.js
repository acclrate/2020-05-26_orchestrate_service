const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    res.send("Welcone to this node.js app.");

});

module.exports = router;