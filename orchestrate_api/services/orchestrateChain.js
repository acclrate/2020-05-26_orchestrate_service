
const mongoose = require('mongoose');
const axios = require('axios'); // npm install --save axios
const pegasysOrchestrate = require('pegasys-orchestrate'); // npm install pegasys-orchestrate
const AccountGenerator = pegasysOrchestrate.AccountGenerator;
const ContractRegistry = pegasysOrchestrate.ContractRegistry;
const Producer = pegasysOrchestrate.Producer;
const Consumer = pegasysOrchestrate.Consumer;
const EventType = pegasysOrchestrate.EventType;
const ResponseMessage = pegasysOrchestrate.ResponseMessage;

const Web3 = require("web3");
const EthereumTx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;
const EEAClient = require("./eeaclient");

const keys = require("../keys.js");
const appVariableService = require("./appVariable");


module.exports.registerChain = async (reqbody) => {
    try {
        let data;
        let apicallres;
        let networkID;

        // Register Node
        console.log("\n\nRegistering Node", reqbody.name, reqbody.url);
        console.log("http://" + keys.orchestrateDomain + ":" + keys.orchestrateChainRegistryPort + "/chains");
        data = {
            name: reqbody.name,
            urls: [reqbody.url]
        };
        apicallres = await axios({
            method: 'post',
            url: "http://" + keys.orchestrateDomain + ":" + keys.orchestrateChainRegistryPort + "/chains",
            data: data
        });
        console.log(apicallres.data);
        networkID = apicallres.data.uuid;
        console.log("\nNode ID\n", networkID);
        return apicallres.data;

    } catch (e) {
        console.log(e.message);
    };
}


module.exports.resetChains = async (reqbody) => {
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


module.exports.getChains = async (reqbody) => {
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


module.exports.getChain = async (chainName) => {
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

        let i;
        for (let j = 0; j < apicallres.data.length; j++) {
            if (apicallres.data[j].name == chainName) { i = j; }
        }
        console.log(apicallres.data[i]);
        return apicallres.data[i];

    } catch (e) {
        console.log(e.message);
    };



}