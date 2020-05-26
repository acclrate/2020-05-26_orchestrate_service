var jwtDecode = require('jwt-decode');

const keys = require('../keys');

// Each request has a nodeOrigin field, this will be used to check that the logged in user has access to this nodeOrigin
const checkPermissions = (req, res, next) => {

    // console.log("\nChecking permissions:");
    // The previous step has added the following fields of the decoded jwt to req.user:
    // { iss: 'https://eckt.eu.auth0.com/',
    // sub: '6tdLT3kukuA3WYd02645OnunaEscyZJM@clients',
    // aud: 'https://api.mysite.com',
    // iat: 1590424620,
    // exp: 1590511020,
    // azp: '6tdLT3kukuA3WYd02645OnunaEscyZJM',
    // gty: 'client-credentials',
    // permissions: []
    // }
    // req.user.sub can be tested for permissions to access route req.url

    // If the user is not authorized, then
    // return res.status(401).send({ error: 'Request not allowed' });
    next();
}

module.exports = {
    checkPermissions
};

