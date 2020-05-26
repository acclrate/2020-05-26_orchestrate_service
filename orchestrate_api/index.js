// Do not forget to install nodemon and add to run dev script: npm install --save-dev nodemon
// To start app in dev: rpm run dev

const keys = require('./keys');

// Mongoose
const mongoose = require('mongoose');  // npm install --save mongoose
require('./modelsMongo/User');
require('./modelsMongo/AppVariable');
require('./modelsMongo/ConsumedReceipt');
mongoose.connect(keys.mongoDbUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });


// Express server
const express = require("express"); // npm install --save express
const app = express();


// Body parser is the middle ware to parse incoming request bodies in a middleware before your handlers, available under the req.body property
const bodyParser = require('body-parser');
// Wire body parser middleware to make sure that all bodys sent to our api get parsed
app.use(bodyParser.json());


// Enable front end to query another port from the same domain
const cors = require('cors'); // npm install --save cors
app.use(cors());


// Import routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);
const userRouter = require('./routes/web_user');
app.use('/', userRouter);
const orchestrateRouter = require('./routes/api_orchestrate');
app.use('/', orchestrateRouter);

console.log("Express running on port " + keys.expressPort);

app.listen(keys.expressPort);

