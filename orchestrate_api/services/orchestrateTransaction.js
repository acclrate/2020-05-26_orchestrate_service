
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
const orchestrateChain = require("./orchestrateChain");
const orchestrateContract = require("./orchestrateContract");


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


module.exports.writeTransaction = async (reqbody) => {
    // Extract parameters
    const chainName = reqbody.chainName;
    const contractName = reqbody.contractName;
    const walletAddress = reqbody.walletAddress;
    const methodSignature = reqbody.methodSignature;
    const args = reqbody.args;

    // Process actions
    const contractAddress = await appVariableService.getContractAddress(chainName, contractName);
    const requestId = await writeContractHelper(
        chainName,
        contractName,
        contractAddress,
        walletAddress,
        methodSignature,
        args
    );
    return {
        requestId: requestId
    };
}


module.exports.readTransaction = async (reqbody) => {
    // Extract parameters
    const chainName = reqbody.chainName;
    const contractName = reqbody.contractName;
    const methodName = reqbody.methodName;
    const networkNumber = reqbody.networkNumber; // 2018

    // Select node
    const nodeObject = await orchestrateChain.getChain(chainName);
    const nodeUrl = nodeObject.urls[0];
    console.log("Node URL", nodeUrl);
    const web3 = new EEAClient(new Web3(nodeUrl), networkNumber);

    // Select contract
    const contractAddress = await appVariableService.getContractAddress(chainName, contractName);
    const contractArtifact = await orchestrateContract.getContract(contractName);
    const contractAbi = contractArtifact.abi;
    const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);

    // Call method
    const res = await contractInstance.methods[methodName]().call();
    const startTime = new Date();
    console.log("Result\n", res);
    const decodedRes = {
        counter: res,
        timestamp: startTime.toISOString()
    }
    return decodedRes;
}