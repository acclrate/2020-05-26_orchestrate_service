
require('dotenv').config(); // npm install dotenv
module.exports = {
    expressHttpPrefix: process.env.EXPRESS_HTTP_PREFIX,
    expressDomain: process.env.EXPRESS_DOMAIN,
    expressPort: process.env.EXPRESS_PORT,

    auth0JwksUri: process.env.AUTH0_JWKURI,
    auth0Audience: process.env.AUTH0_AUDIENCE,
    auth0Issuer: process.env.AUTH0_ISSUER,

    mongoDbUri: process.env.MONGODB_URI,

    infuraUrl: process.env.INFURA_URL,
    rinkebyUrl: process.env.RINKEBY_URL,

    besuNetworkId: 2018,

    besu: {
        node1: {
            url: "http://" + process.env.BESU_DOMAIN + ":20000",
            privateKey:
                "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
            orionPublicKey: "A1aVtMxLCUHmBVHXoZzzBgPbW/wj5axDpW9X8l91SGo="
        },
        node2: {
            url: "http://" + process.env.BESU_DOMAIN + ":20002",
            privateKey:
                "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
            orionPublicKey: "Ko2bVqD+nNlNYL5EE7y3IdOnviftjiizpjRt+HTuFBs="
        },
        node3: {
            url: "http://" + process.env.BESU_DOMAIN + ":20004",
            privateKey:
                "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
            orionPublicKey: "k2zXEin4Ip/qBGlRkJejnGWdP9cjkK+DAvKNW31L2C8="
        },
        node4: {
            url: "http://" + process.env.BESU_DOMAIN + ":20006",
            privateKey:
                "c343325ae0d934c38bcfa2cf780f7873bcc023b6bd392373453e2c3100b1ac3b",
            orionPublicKey: "AbeXslE5QjON5KRc3uEXIT9mn1XsAZ4hr3xssTHdWWM="
        },
        node5: {
            url: "http://" + process.env.BESU_DOMAIN + ":20008",
            privateKey:
                "b01ed04ab16fbe438ca32228af819bdb332a52398cf3e1bd0052fd2ea43a0b81",
            orionPublicKey: "rMpEKE5lgh3s75ChB+Td+Pis8n+0sUt9P8A/L20WPBY="
        }
    },

    forCustomChain: {
        name: 'my-network',
        networkId: 2018,
        chainId: 2018,
    },

    quorum: {
        node1: {
            url: "http://" + process.env.QUORUM_DOMAIN + ":22000",
            privateKey:
                "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
            orionPublicKey: "A1aVtMxLCUHmBVHXoZzzBgPbW/wj5axDpW9X8l91SGo="
        },
        node2: {
            url: "http://" + process.env.QUORUM_DOMAIN + ":22001",
            privateKey:
                "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
            orionPublicKey: "Ko2bVqD+nNlNYL5EE7y3IdOnviftjiizpjRt+HTuFBs="
        },
        node3: {
            url: "http://" + process.env.QUORUM_DOMAIN + ":22002",
            privateKey:
                "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
            orionPublicKey: "k2zXEin4Ip/qBGlRkJejnGWdP9cjkK+DAvKNW31L2C8="
        },
        node4: {
            url: "http://" + process.env.QUORUM_DOMAIN + ":22003",
            privateKey:
                "c343325ae0d934c38bcfa2cf780f7873bcc023b6bd392373453e2c3100b1ac3b",
            orionPublicKey: "AbeXslE5QjON5KRc3uEXIT9mn1XsAZ4hr3xssTHdWWM="
        },
        node5: {
            url: "http://" + process.env.QUORUM_DOMAIN + ":22004",
            privateKey:
                "b01ed04ab16fbe438ca32228af819bdb332a52398cf3e1bd0052fd2ea43a0b81",
            orionPublicKey: "rMpEKE5lgh3s75ChB+Td+Pis8n+0sUt9P8A/L20WPBY="
        }
    },

    orchestrateDomain: "localhost",
    orchestrateChainRegistryPort: "8081",
    orchestrateContractRegistryPort: "8020",
    orchestrateMessagePort: "9092",

};
