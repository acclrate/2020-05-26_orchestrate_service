// The mongodb configuration is defined in index.js with mongoose connect.

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define schema
const consumedReceiptSchema = new Schema({
    requestID: String,
    txContext: Object,
    receipt: Object
}, { timestamps: true });

// Declare collection and schema
mongoose.model('consumedreceipt', consumedReceiptSchema);


