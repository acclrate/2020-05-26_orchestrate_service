
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

// CONTRACTS
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


module.exports.getContract = async (contractName) => {
    try {
        let res;
        let req;

        // Check current contract registry
        console.log("\n\n\nContract Registry URL", keys.orchestrateDomain + ':' + keys.orchestrateContractRegistryPort);
        console.log("Current contract registry...");
        const contractRegistry = new ContractRegistry(keys.orchestrateDomain + ':' + keys.orchestrateContractRegistryPort);

        console.log("Trying to get contract details back from the registry\n", contractName);
        res = await contractRegistry.get(contractName);
        console.log("Contract details\n", res);
        return res;

    } catch (e) {
        console.log(e);
        return;
    };
}


module.exports.registerContract = async (reqbody) => {
    try {
        let res;
        let req;

        const contractRegistry = new ContractRegistry(keys.orchestrateDomain + ':' + keys.orchestrateContractRegistryPort);

        console.log("\nRegistering contract...");
        // Register Contract
        req = {
            name: reqbody.contractName,
            tag: 'latest',
            abi: reqbody.abi,
            bytecode: reqbody.bytecode,
            deployedBytecode: reqbody.deployedBytecode

        };
        // This line can be uncommented to register a new contract
        res = await contractRegistry.register(req);
        console.log("\nRegister response (this is usually empty)\n", res);

        // Get contract
        console.log("Trying to get contract details back from the registry\n", reqbody.contractName);
        res = await contractRegistry.get(reqbody.contractName);
        console.log("Contract details\n", res);
        return res;

    } catch (e) {
        console.log(e);
        return;
    };
}


module.exports.deployContract = async (reqbody) => {
    try {
        console.log("\n\n\nPreparing to deploy contract...");
        const producer = new Producer([keys.orchestrateDomain + ':' + keys.orchestrateMessagePort]);
        await producer.connect();

        console.log("From account", reqbody.walletAddress);

        // Deploy a new  contract and returns the ID of the request
        const requestId = await producer.sendTransaction({
            chainName: reqbody.chainName,
            contractName: reqbody.contractName,
            contractTag: 'latest',
            methodSignature: 'constructor()',
            from: reqbody.walletAddress,
            gas: 2000000
        });

        console.log('Transaction request sent with id: ', requestId);

        await producer.disconnect();
        const contractAddress = await appVariableService.getLastContractAddress(requestId);

        // Save contract address
        await appVariableService.storeOrReplaceVariable(
            reqbody.contractName + "ContractAddress",
            contractAddress,
            reqbody.chainName
        );

        return {
            chainName: reqbody.chainName,
            contractName: reqbody.contractName,
            contractAddress: contractAddress
        };

    } catch (e) {
        console.log(e);
        return;
    };

}


