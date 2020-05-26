const express = require('express');
const requireJWT = require('../middlewares/requireJWT');
const checkAccess = require('../middlewares/checkAccess');
const router = express.Router();

const userService = require('../services/user');

// POST Get User
router.post('/web/user/getUser', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await userService.getUser(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;

