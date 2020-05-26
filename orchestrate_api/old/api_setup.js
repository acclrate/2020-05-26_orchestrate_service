const express = require('express');
const router = express.Router();

const requireJWT = require('../middlewares/requireJWT');
const checkAccess = require('../middlewares/checkAccess');
const orchestrateSetupService = require('../services/orchestrateSetup');


router.post('/api/setup/registerChains', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await orchestrateSetupService.registerChains(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


router.post('/api/setup/getChains', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await orchestrateSetupService.getChains(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


router.post('/api/setup/createAccounts', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await orchestrateSetupService.createAccounts(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


router.post('/api/setup/getContracts', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);
    try {
        const response = await orchestrateSetupService.getContracts(req.body);
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

