const express = require('express');
const router = express.Router();

const requireJWT = require('../middlewares/requireJWT');
const checkAccess = require('../middlewares/checkAccess');
const appVariable = require("../services/appVariable");
const orchestrateChain = require('../services/orchestrateChain');
const orchestrateAccount = require('../services/orchestrateAccount');
const orchestrateContract = require('../services/orchestrateContract');
const orchestrateTransaction = require('../services/orchestrateTransaction');



// CHAIN REGISTRY
router.post('/orchestrate/chain/register', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await orchestrateChain.registerChain(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


router.post('/orchestrate/chain/reset', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await orchestrateChain.resetChains(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


router.post('/orchestrate/chain/get', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await orchestrateChain.getChains(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


router.post('/orchestrate/chain/getOne', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await orchestrateChain.getChain(req.body.chainName);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


// ACCOUNTS
router.post('/orchestrate/account/create', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await orchestrateAccount.createAccount(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


router.post('/orchestrate/account/get', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await orchestrateAccount.getAccounts(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


// CONTRACTS
router.post('/orchestrate/contract/get', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await orchestrateContract.getContracts(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


router.post('/orchestrate/contract/getOne', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await orchestrateContract.getContract(req.body.contractName);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


router.post('/orchestrate/contract/register', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await orchestrateContract.registerContract(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


router.post('/orchestrate/contract/deploy', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await orchestrateContract.deployContract(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});



router.post('/orchestrate/contract/getDeployed', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await appVariable.getContractsDeployed(req.body.chainName);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


router.post('/orchestrate/transaction/write', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await orchestrateTransaction.writeTransaction(req.body);
        console.log(req.url + " API response is:");
        console.log(response);
        res.status(200).send({ msg: "Success", data: response });
        next();
    } catch (e) {
        console.log(e.message);
        res.status(500).send({ error: e.message });
    }
});


router.post('/orchestrate/transaction/read', requireJWT.jwtCheck, checkAccess.checkPermissions, async function (req, res, next) {
    console.log(req.url + " API called with body:");
    console.log(req.body);

    try {
        const response = await orchestrateTransaction.readTransaction(req.body);
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
