const mongoose = require('mongoose');
const Web3 = require("web3");
const EthereumTx = require('ethereumjs-tx').Transaction

const ethWallet = require('ethereumjs-wallet'); // npm install ethereumjs-wallet
const crypto = require('crypto');

const Common = require('ethereumjs-common').default;
const EEAClient = require("./eeaclient");

const keys = require("../keys.js");
const orchestrateSetupService = require('./orchestrateSetup');

const customCommon = Common.forCustomChain('mainnet', keys.forCustomChain, 'petersburg');



module.exports.readContract_getCounter = async (reqbody) => {
    // Extract parameters
    const fromNode = reqbody.chainName;
    const contractName = reqbody.contractName;

    // Select node
    const nodeUrl = await orchestrateSetupService.getChainUrl(fromNode);
    console.log("Node URL", nodeUrl);
    const web3 = new EEAClient(new Web3(nodeUrl), keys.besuNetworkId);
    // Select contract
    const contractArtifactFile = "../smart_contracts/" + contractName + ".json";
    const contractAbi = require(contractArtifactFile).abi;
    const AppVariable = mongoose.model('appvariable');
    const contractAddressRecord = await AppVariable.findOne({
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