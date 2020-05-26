const express = require('express');
const router = express.Router();

const requireJWT = require('../middlewares/requireJWT');
const checkAccess = require('../middlewares/checkAccess');
const orchestrateTransactionService = require('../services/orchestrateTransaction');
const blockchainPublicService = require('../services/blockchainPublic');

router.post('/api/contract/deployContract', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);
    try {
        const response = await orchestrateTransactionService.registerDeployContract(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


router.post('/api/contract/readContract', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);
    try {
        const response = await blockchainPublicService.readContract_getCounter(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


router.post('/api/contract/writeContract', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);
    try {
        const response = await orchestrateTransactionService.writeContract(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


router.post('/api/contract/batchWriteContract', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);
    try {
        const response = await orchestrateTransactionService.batchWriteContract(req.body);
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
