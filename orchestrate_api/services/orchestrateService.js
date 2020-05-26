
const mongoose = require('mongoose');
const axios = require('axios'); // npm install --save axios
const pegasysOrchestrate = require('pegasys-orchestrate'); // npm install pegasys-orchestrate
const AccountGenerator = pegasysOrchestrate.AccountGenerator;
const ContractRegistry = pegasysOrchestrate.ContractRegistry;

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