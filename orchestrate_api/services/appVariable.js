
const mongoose = require('mongoose');

const generalHelper = require("./generalHelper");


module.exports.storeOrReplaceVariable = async (varKey, varValue, varReference) => {
    const AppVariable = mongoose.model('appvariable');
    await AppVariable.updateOne({
        key: varKey,
        reference: varReference
    }, {
        key: varKey,
        value: varValue,
        reference: varReference
    }, {
        upsert: true, setDefaultsOnInsert: true
    });
}


module.exports.getVariables = async () => {
    const AppVariable = mongoose.model('appvariable');
    const res = await AppVariable.find({});
    return res;
}

module.exports.getVariable = async (varKey, varReference) => {
    const AppVariable = mongoose.model('appvariable');
    const recordFound = await AppVariable.findOne({
        key: varKey,
        reference: varReference
    });
    return recordFound.value;
}

module.exports.getWalletAddress = async (i) => {
    const AppVariable = mongoose.model('appvariable');
    const varKey = "walletAddress" + i;
    const recordFound = await AppVariable.findOne({ key: varKey, reference: "latest" });
    return recordFound.value;
}

module.exports.getLastContractAddress = async (requestId) => {
    console.log("\nWaiting 6 seconds to get contract address...");
    await generalHelper.sleep(6000);
    const AppVariable = mongoose.model('appvariable');
    const recordFound = await AppVariable.findOne({ key: "lastContractAddress", reference: requestId });
    console.log("\nFound contract address in receipt:", recordFound.value);
    return recordFound.value;
}

module.exports.getContractsDeployed = async (chainName) => {
    const AppVariable = mongoose.model('appvariable');
    const recordFound = await AppVariable.find({ reference: chainName });
    console.log("\nFound contracts:", recordFound);
    return recordFound;
}

module.exports.getContractAddress = async (chainName, contractName) => {
    const AppVariable = mongoose.model('appvariable');
    const recordFound = await AppVariable.findOne({
        key: contractName + 'ContractAddress',
        reference: chainName
    });
    console.log("\nFound contract:", recordFound);
    return recordFound.value;
}