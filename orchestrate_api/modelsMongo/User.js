// The mongodb configuration is defined in index.js with mongoose connect.

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define schema
const userSchema = new Schema({
    nodeOrigin: String,
    auth0ID: String,
    email: String,
}, { timestamps: true });

// Declare collection and schema
mongoose.model('user', userSchema);

