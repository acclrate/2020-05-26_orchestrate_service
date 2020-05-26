
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

module.exports.createAccount = async (reqbody) => {
    console.log("\n\nCreating wallet...");
    // const accountGenerator = new AccountGenerator(['localhost:9092']);
    console.log("Calling AccountGenerator at", keys.orchestrateDomain + ':' + keys.orchestrateMessagePort);
    const accountGenerator = new AccountGenerator([keys.orchestrateDomain + ':' + keys.orchestrateMessagePort]);
    await accountGenerator.connect()

    console.log("Account generator connected");

    const walletAddress1 = await accountGenerator.generateAccount();
    console.log("\nThe address created is\n", walletAddress1);
    await appVariableService.storeOrReplaceVariable(reqbody.name, walletAddress1, "account");

    await accountGenerator.disconnect();

    return {
        name: reqbody.name,
        address: walletAddress1
    };
}


module.exports.getAccounts = async (reqbody) => {
    const AppVariable = mongoose.model('appvariable');
    const res = await AppVariable.find({ reference: "account" });
    return res;
}