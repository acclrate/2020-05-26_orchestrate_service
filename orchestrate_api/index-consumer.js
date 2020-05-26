
// Launch with node index-consumer.js or npm run consume

const pegasysOrchestrate = require('pegasys-orchestrate'); // npm install --save pegasys-orchestrate
const ContractRegistry = pegasysOrchestrate.ContractRegistry;
const Producer = pegasysOrchestrate.Producer;
const Consumer = pegasysOrchestrate.Consumer;
const EventType = pegasysOrchestrate.EventType;
const ResponseMessage = pegasysOrchestrate.ResponseMessage;

const keys = require('./keys');

const mongoose = require('mongoose');  // npm install --save mongoose
require('./modelsMongo/ConsumedReceipt');
require('./modelsMongo/AppVariable');
mongoose.connect(keys.mongoDbUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });


const storeOrReplaceVariable = async (varKey, varValue, varReference) => {
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


const launchConsumer = async () => {
    console.log("Consumer URL", keys.orchestrateDomain + ':' + keys.orchestrateMessagePort);
    const consumer = new Consumer([keys.orchestrateDomain + ':' + keys.orchestrateMessagePort]);
    await consumer.connect();

    const ConsumedReceipt = mongoose.model('consumedreceipt');

    consumer.on(EventType.Response, async (responseMessage) => {
        const { value } = responseMessage.content();
        console.log("\nReceived message:\n", value);
        if (value.errors && value.errors.length > 0) {
            console.error('Transaction failed with error: ', value.errors);
            return;
        } else {
            await responseMessage.commit();
            // console.log("\nStoring message...");
            // console.log('Transaction ID:', value.id);
            // console.log('Transaction receipt: ', value.receipt);

            // WORKER'S ACTIONS
            // Save Receipt
            console.log("\nStoring receipt...");
            await new ConsumedReceipt({
                requestID: value.id,
                txContext: value.txContext,
                receipt: value.receipt
            }).save();

            // Save address of any new contract deployed
            if (value.receipt.contractAddress) {
                if (!(value.receipt.contractAddress === "0x0000000000000000000000000000000000000000")) {
                    await storeOrReplaceVariable("lastContractAddress", value.receipt.contractAddress, value.id);
                }
            }
        }
    });

    await consumer.consume();
};

launchConsumer();
