
const mongoose = require('mongoose');
const axios = require('axios'); // npm install --save axios
const pegasysOrchestrate = require('pegasys-orchestrate'); // npm install pegasys-orchestrate
const AccountGenerator = pegasysOrchestrate.AccountGenerator;
const ContractRegistry = pegasysOrchestrate.ContractRegistry;

const keys = require("../keys.js");
const appVariableService = require("./appVariable");

const resetOrchestrate = async () => {
    try {
        let data;
        let apicallres;

        console.log("\n\n\nChecking available chains...");
        console.log("http://" + keys.orchestrateDomain + ":" + keys.orchestrateChainRegistryPort + "/chains");
        apicallres = await axios({
            method: 'get',
            url: "http://" + keys.orchestrateDomain + ":" + keys.orchestrateChainRegistryPort + "/chains"
        });
        console.log(apicallres.data);
        const availableChains = apicallres.data;

        console.log("Deleting available chains");
        for (let i = 0; i < availableChains.length; i++) {
            console.log("Deleting", availableChains[i].name);
            console.log("http://" + keys.orchestrateDomain + ":" + keys.orchestrateChainRegistryPort + "/chains/" + availableChains[i].uuid);
            apicallres = await axios({
                method: 'delete',
                url: "http://" + keys.orchestrateDomain + ":" + keys.orchestrateChainRegistryPort + "/chains/" + availableChains[i].uuid
            });
            console.log(apicallres.data);
        }

        console.log("Checking available chains...");
        apicallres = await axios({
            method: 'get',
            url: "http://" + keys.orchestrateDomain + ":" + keys.orchestrateChainRegistryPort + "/chains"
        });
        console.log(apicallres.data);

    } catch (e) {
        console.log(e.message);
    };
};


const registerRinkeby = async () => {
    try {

        let data;
        let apicallres;
        let networkID;

        // Register Rinkeby
        console.log("\n\n\nRegistering Rinkeby", keys.rinkebyUrl);
        console.log("http://" + keys.orchestrateDomain + ":" + keys.orchestrateChainRegistryPort + "/chains");
        data = {
            name: "rinkeby",
            urls: [keys.rinkebyUrl]
        };
        apicallres = await axios({
            method: 'post',
            url: "http://" + keys.orchestrateDomain + ":" + keys.orchestrateChainRegistryPort + "/chains",
            data: data
        });
        console.log(apicallres.data);
        networkID = apicallres.data.uuid;
        console.log("\nNode ID\n", networkID);
    } catch (e) {
        console.log(e.message);
    };
}


const registerNode = async (networkName, nodeName) => {
    try {

        let data;
        let apicallres;
        let networkID;

        // Register Node
        console.log("\n\nRegistering Node", networkName, nodeName);
        console.log("http://" + keys.orchestrateDomain + ":" + keys.orchestrateChainRegistryPort + "/chains");
        data = {
            name: networkName + nodeName,
            urls: [keys[networkName][nodeName].url]
        };
        apicallres = await axios({
            method: 'post',
            url: "http://" + keys.orchestrateDomain + ":" + keys.orchestrateChainRegistryPort + "/chains",
            data: data
        });
        console.log(apicallres.data);
        networkID = apicallres.data.uuid;
        console.log("\nNode ID\n", networkID);

    } catch (e) {
        console.log(e.message);
    };
}


const getAvailableChains = async () => {
    try {

        let data;
        let apicallres;

        console.log("\nChecking available chains...");
        console.log("http://" + keys.orchestrateDomain + ":" + keys.orchestrateChainRegistryPort + "/chains");
        apicallres = await axios({
            method: 'get',
            url: "http://" + keys.orchestrateDomain + ":" + keys.orchestrateChainRegistryPort + "/chains"
        });
        console.log(apicallres.data);
        return apicallres.data;

    } catch (e) {
        console.log(e.message);
    };
};


module.exports.registerChains = async (reqbody) => {
    await resetOrchestrate();
    await registerRinkeby();
    await registerNode("besu", "node1");
    await registerNode("besu", "node2");
    await registerNode("quorum", "node1");
    const res = await getAvailableChains();
    return res;
}


module.exports.getChains = async (reqbody) => {
    const res = await getAvailableChains();
    return res;
}

module.exports.getChainUrl = async (chainName) => {
    const availableChains = await getAvailableChains();
    let i;
    for (let j = 0; j < availableChains.length; j++) {
        if (availableChains[j].name == chainName) { i = j }
    }
    return availableChains[i].urls[0];
}

module.exports.createAccounts = async (reqbody) => {
    console.log("\n\nCreating wallets...");
    // const accountGenerator = new AccountGenerator(['localhost:9092']);
    console.log("Calling AccountGenerator at", keys.orchestrateDomain + ':' + keys.orchestrateMessagePort);
    const accountGenerator = new AccountGenerator([keys.orchestrateDomain + ':' + keys.orchestrateMessagePort]);
    await accountGenerator.connect()

    console.log("Account generator connected");

    const walletAddress1 = await accountGenerator.generateAccount();
    console.log("\nThe address created is\n", walletAddress1);
    await appVariableService.storeOrReplaceVariable("walletAddress1", walletAddress1, "latest");

    const walletAddress2 = await accountGenerator.generateAccount();
    console.log("\nThe address created is\n", walletAddress2);
    await appVariableService.storeOrReplaceVariable("walletAddress2", walletAddress2, "latest");

    const walletAddress3 = await accountGenerator.generateAccount();
    console.log("\nThe address created is\n", walletAddress3);
    await appVariableService.storeOrReplaceVariable("walletAddress3", walletAddress3, "latest");

    const walletAddress4 = await accountGenerator.generateAccount();
    console.log("\nThe address created is\n", walletAddress4);
    await appVariableService.storeOrReplaceVariable("walletAddress4", walletAddress4, "latest");

    const walletAddress5 = await accountGenerator.generateAccount();
    console.log("\nThe address created is\n", walletAddress5);
    await appVariableService.storeOrReplaceVariable("walletAddress5", walletAddress5, "latest");

    const walletAddress6 = await accountGenerator.generateAccount();
    console.log("\nThe address created is\n", walletAddress6);
    await appVariableService.storeOrReplaceVariable("walletAddress6", walletAddress6, "latest");

    await accountGenerator.disconnect();
    const res = await appVariableService.getVariables();
    return res;
}


module.exports.getContracts = async (reqbody) => {
    try {
        let res;
        let req;

        // Check current contract registry
        console.log("\n\n\nContract Registry URL", keys.orchestrateDomain + ':' + keys.orchestrateContractRegistryPort);
        console.log("Current contract registry...");
        const contractRegistry = new ContractRegistry(keys.orchestrateDomain + ':' + keys.orchestrateContractRegistryPort);
        res = await contractRegistry.getCatalog();
        console.log("Contract catalog\n", res);

        // let res2 = res.map(async (x) => {
        // console.log("Trying to get contract details back from the registry\n", x);
        // let res3 = await contractRegistry.get(x);
        // console.log("Contract details\n", res3);
        // });
        return res;

    } catch (e) {
        console.log(e);
        return;
    };
}

