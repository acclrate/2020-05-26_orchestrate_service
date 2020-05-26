
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
const blockchainHelpers = require("./blockchainHelpers");





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


const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getWalletAddress = async (i) => {
    const NetworkVariable = mongoose.model('networkvariable');
    const varKey = "walletAddress" + i;
    const variableFound = await NetworkVariable.findOne({ key: varKey });
    return variableFound.value;
}

const getLastContractAddress = async (requestId) => {
    console.log("\nWaiting 6 seconds to get contract address...");
    await sleep(6000);
    const NetworkVariable = mongoose.model('networkvariable');
    const recordFound = await NetworkVariable.findOne({ key: "lastContractAddress", reference: requestId });
    console.log("\nFound contract address in receipt:", recordFound.value);
    return recordFound.value;
}


module.exports.deployContract = async (reqbody) => {
    // Extract parameters
    const chainName = reqbody.chainName;
    const contractName = reqbody.contractName;
    const walletNumber = reqbody.walletNumber;

    // Process actions
    const contractArtifactFile = "../smart_contracts/" + contractName + ".json";
    const contractArtifact = require(contractArtifactFile);
    const walletAddress = await getWalletAddress(walletNumber);

    await registerContract(contractArtifact);
    const requestId = await deployContract(chainName, contractName, walletAddress);
    const contractAddress = await getLastContractAddress(requestId);

    // Save contract address
    const NetworkVariable = mongoose.model('networkvariable');
    await NetworkVariable.updateOne({
        key: contractName + "ContractAddress",
        reference: "latest"
    }, {
        key: contractName + "ContractAddress",
        value: contractAddress,
        reference: "latest"
    }, {
        upsert: true, setDefaultsOnInsert: true
    });

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
    const NetworkVariable = mongoose.model('networkvariable');
    const contractAddressRecord = await NetworkVariable.findOne({
        key: contractName + "ContractAddress",
        reference: "latest"
    });
    const contractAddress = contractAddressRecord.value;
    const walletAddress = await getWalletAddress(walletNumber);
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


module.exports.readContract_getCounter = async (reqbody) => {
    // Extract parameters
    const fromNode = reqbody.nodeOrigin;
    const contractName = reqbody.contractName;

    // Select node
    const nodeUrl = blockchainHelpers.getNodeUrl(fromNode);
    console.log("Node URL", nodeUrl);
    const web3 = new EEAClient(new Web3(nodeUrl), keys.besuNetworkId);
    // Select contract
    const contractArtifactFile = "../smart_contracts/" + contractName + ".json";
    const contractAbi = require(contractArtifactFile).abi;
    const NetworkVariable = mongoose.model('networkvariable');
    const contractAddressRecord = await NetworkVariable.findOne({
        key: contractName + "ContractAddress",
        reference: "latest"
    });
    const contractAddress = contractAddressRecord.value;
    const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);
    // Call method
    const res = await contractInstance.methods.getCounter().call();
    const startTime = new Date();
    console.log("readContract_getCounter result\n", res);
    const decodedRes = {
        counter: res,
        timestamp: startTime.toISOString()
    }
    return decodedRes;
}

module.exports.writeContract_many = async (reqbody) => {
    // Extract parameters
    const chainName = reqbody.chainName;
    const contractName = reqbody.contractName;
    const walletNumber = reqbody.walletNumber;
    const methodSignature = reqbody.methodSignature;
    const args = reqbody.args;
    const nTimes = reqbody.nTimes;

    // Process actions
    const NetworkVariable = mongoose.model('networkvariable');
    const contractAddressRecord = await NetworkVariable.findOne({
        key: contractName + "ContractAddress",
        reference: "latest"
    });
    const contractAddress = contractAddressRecord.value;
    const walletAddress = await getWalletAddress(walletNumber);
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


