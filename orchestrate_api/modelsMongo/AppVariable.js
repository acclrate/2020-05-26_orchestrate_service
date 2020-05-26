// The mongodb configuration is defined in index.js with mongoose connect.

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define schema
const appVariableSchema = new Schema({
    key: String,
    value: String,
    reference: String
}, { timestamps: true });

// Declare collection and schema
mongoose.model('appvariable', appVariableSchema);

