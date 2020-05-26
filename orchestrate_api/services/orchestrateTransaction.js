
const mongoose = require('mongoose');
const axios = require('axios'); // npm install --save axios

const pegasysOrchestrate = require('pegasys-orchestrate'); // npm install pegasys-orchestrate
const ContractRegistry = pegasysOrchestrate.ContractRegistry;
const AccountGenerator = pegasysOrchestrate.AccountGenerator;
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



const registerContract = async (contractArtifact) => {
    try {
        let res;
        let req;

        const contractRegistry = new ContractRegistry(keys.orchestrateDomain + ':' + keys.orchestrateContractRegistryPort);

        console.log("\nRegistering contract...");
        // Register Contract
        req = {
            name: contractArtifact.contractName,
            tag: 'latest',
            abi: contractArtifact.abi,
            bytecode: contractArtifact.bytecode,
            deployedBytecode: contractArtifact.deployedBytecode

        };
        // This line can be uncommented to register a new contract
        res = await contractRegistry.register(req);
        console.log("\nRegister response (this is usually empty)\n", res);

        // Get contract
        console.log("Trying to get contract details back from the registry\n", contractArtifact.contractName);
        res = await contractRegistry.get(contractArtifact.contractName);
        console.log("Contract details\n", res);

    } catch (e) {
        console.log(e);
        return;
    };
}


const deployContract = async (chainName, contractName, walletAddress) => {
    try {
        console.log("\n\n\nPreparing to deploy contract...");
        const producer = new Producer([keys.orchestrateDomain + ':' + keys.orchestrateMessagePort]);
        await producer.connect();

        console.log("From account", walletAddress);

        // Deploy a new  contract and returns the ID of the request
        const requestId = await producer.sendTransaction({
            chainName: chainName,
            contractName: contractName,
            contractTag: 'latest',
            methodSignature: 'constructor()',
            from: walletAddress,
            gas: 2000000
        });

        console.log('Transaction request sent with id: ', requestId);

        await producer.disconnect();
        return requestId;

    } catch (e) {
        console.log(e);
        return;
    };

}


module.exports.registerDeployContract = async (reqbody) => {
    // Extract parameters
    const chainName = reqbody.chainName;
    const contractName = reqbody.contractName;
    const walletNumber = reqbody.walletNumber;

    // Process actions
    const contractArtifactFile = "../smart_contracts/" + contractName + ".json";
    const contractArtifact = require(contractArtifactFile);
    const walletAddress = await appVariableService.getWalletAddress(walletNumber);

    await registerContract(contractArtifact);
    const requestId = await deployContract(chainName, contractName, walletAddress);
    const contractAddress = await appVariableService.getLastContractAddress(requestId);

    // Save contract address
    await appVariableService.storeOrReplaceVariable(
        contractName + "ContractAddress",
        contractAddress,
        "latest"
    );

    return contractAddress;
}


const writeContractHelper = async (chainName, contractName, contractAddress, walletAddress, methodSignature, args) => {
    try {
        console.log("\n\n\nPreparing to write contract", contractAddress, "with values", args, "...");
        const producer = new Producer([keys.orchestrateDomain + ':' + keys.orchestrateMessagePort]);
        await producer.connect();

        console.log("From account", walletAddress);
        // Example of methodSignature:
        // methodSignature: 'incrementCounter(uint256)',
        const requestId = await producer.sendTransaction({
            chainName: chainName,
            contractName: contractName,
            contractTag: 'latest',
            methodSignature: methodSignature,
            args: args,
            from: walletAddress,
            to: contractAddress,
            gas: 2000000
        });

        console.log('Transaction request sent with id: ', requestId);
        await producer.disconnect();
        return requestId;
    } catch (e) {
        console.log(e);
        return;
    };
}


module.exports.writeContract = async (reqbody) => {
    // Extract parameters
    const chainName = reqbody.chainName;
    const contractName = reqbody.contractName;
    const walletNumber = reqbody.walletNumber;
    const methodSignature = reqbody.methodSignature;
    const args = reqbody.args;

    // Process actions
    const contractAddress = await appVariableService.getVariable(contractName + "ContractAddress", "latest");
    const walletAddress = await appVariableService.getWalletAddress(walletNumber);
    const requestId = await writeContractHelper(
        chainName,
        contractName,
        contractAddress,
        walletAddress,
        methodSignature,
        args
    );
    return requestId;
}


module.exports.batchWriteContract = async (reqbody) => {
    // Extract parameters
    const chainName = reqbody.chainName;
    const contractName = reqbody.contractName;
    const walletNumber = reqbody.walletNumber;
    const methodSignature = reqbody.methodSignature;
    const args = reqbody.args;
    const nTimes = reqbody.nTimes;

    // Process actions
    const contractAddress = await appVariableService.getVariable(contractName + "ContractAddress", "latest");
    const walletAddress = await appVariableService.getWalletAddress(walletNumber);
    let requestId;
    const startTime = new Date();
    for (let i = 0; i < nTimes; i++) {
        requestId = await writeContractHelper(
            chainName,
            contractName,
            contractAddress,
            walletAddress,
            methodSignature,
            args
        );
    }
    const endTime = new Date();
    const timeElapsed = (endTime - startTime) / 1000;
    return ("Dispatched " + nTimes + " transactions in " + timeElapsed + " seconds. Finished at " + endTime.toISOString());
}


