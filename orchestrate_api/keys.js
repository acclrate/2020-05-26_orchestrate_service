
require('dotenv').config(); // npm install dotenv
module.exports = {
    expressHttpPrefix: process.env.EXPRESS_HTTP_PREFIX,
    expressDomain: process.env.EXPRESS_DOMAIN,
    expressPort: process.env.EXPRESS_PORT,

    auth0JwksUri: process.env.AUTH0_JWKURI,
    auth0Audience: process.env.AUTH0_AUDIENCE,
    auth0Issuer: process.env.AUTH0_ISSUER,

    mongoDbUri: process.env.MONGODB_URI,

    orchestrateDomain: "localhost",
    orchestrateChainRegistryPort: "8081",
    orchestrateContractRegistryPort: "8020",
    orchestrateMessagePort: "9092",

};
