// Enable express to process JWT tokens
const jwt = require("express-jwt"); // npm install express-jwt jwks-rsa
const jwksRsa = require("jwks-rsa");

const keys = require('../keys');

// Define middleware that validates incoming bearer tokens
// using JWKS from eckt.eu.auth0.com

const jwtCheck = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: keys.auth0JwksUri
    }),
    audience: keys.auth0Audience,
    issuer: keys.auth0Issuer,
    algorithms: ['RS256']
});

module.exports = {
    jwtCheck
};


