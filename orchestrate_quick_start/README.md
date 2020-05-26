<p align="center">
  <img src="static/orchestrate-logo.png" alt="Pegasys Orchestrate"/>
</p>

# PegaSys Orchestrate Quickstart

PegaSys Orchestrate is a platform that enables enterprises to easily build secure
and reliable applications on Ethereum blockchains.

Orchestrate provides advanced features when connected to blockchain networks:

- Transaction management (transaction crafting, gas management, nonce management, and transaction listening)
- Account management with private key storage in Hashicorp Vault
- Smart contract registry
- Public and private transactions
- Multi-chain.

For more information, refer to the [PegaSys Orchestrate official Documentation](https://docs.orchestrate.pegasys.tech/).

During this quick-start you use:

- Orchestrate command line interface using npm scripts.
- Orchestrate REST API using Curl.
- Orchestrate SDK using Node Javascript samples.

## Requirements

- Run this Quickstart on a Linux or macOS machine.
- Have access to the [Orchestrate Docker registry](#login-on-docker-registry).
- [Docker version >= 18](https://www.docker.com/) installed and running and [Docker-compose](https://docs.docker.com/compose/install/) installed.
- [Node.js version >=10 and NPM](https://nodejs.org/en/) installed.
- [Curl](https://curl.haxx.se/download.html) installed.

> **Tip:** _To avoid port conflicts, stop other Ethereum clients on your computer before starting
> this quickstart._

### Network requirement

The quickstart connects to a blockchain network. You can use the default local Hyperledger Besu network
provided by this quickstart or provide an external one, such as an Infura project.

#### Local Besu network

A local Besu network using Clique is included in this quickstart.
If using the local Besu network, there are no specific requirements to run this network.

#### External network

To use an external network, you must have the network RPC endpoint address.

You can use Infura with an [infura.io](https://infura.io/) account and a Rinkeby project ID.
For more details, refer to [_Getting Started With Infura_](https://blog.infura.io/getting-started-with-infura-28e41844cc89/).

## Step 1. Set up and run Orchestrate

### Clone project

```bash
git clone https://github.com/PegaSysEng/orchestrate-quick-start.git
```

### Login on Docker registry

If you are running Orchestrate for the first time, you must login to the Orchestrate Docker registry.

Request access on [Pegasys Zendesk support site](http://pegasys.zendesk.com/)
(create an account with your email address or login with an existing one) or by sending an email to
[support@pegasys.tech](mailto:support@pegasys.tech).

> **Important:** _When you receive these credentials from Pegasys, you can continue this Quickstart
> and connect to the registry from your terminal._
>
> **You cannot continue without the registry credentials.**

```bash
docker login -u <username> -p <password> consensys-docker-pegasys-orchestrate.bintray.io
```

### Copy the environment file

Depending on the network that you want to use:

- A local Hyperledger Besu Clique network
- An Infura Rinkeby network.

Copy the example environment files (`.env.besu.example`
or `.env.infura-rinkeby.example`) to a `.env` file at the root of the project.

> **Important:** _If using Infura, replace the `NETWORK_ENDPOINT` value in your `.env` file with the
> correct Infura endpoint, including your Infura network project ID._

You will define some other variables in this `.env` file later. Using the same `.env`
file throughout enables a consistent experience.

### Run Orchestrate Quickstart

The Orchestrate Quickstart uses a Docker compose setup and includes Orchestrate services,
as well as other services including Kafka, Redis, Postgres and Hashicorp Vault, and an Hyperledger Besu node.

- Dependent services are configured in the [dependencies docker-compose.yml file](scripts/deps/docker-compose.yml).
- The Besu node is configured in the [Besu docker-compose-besu.yml file](scripts/deps/docker-compose-besu.yml).
- Orchestrate microservices are configured in [main docker-compose.yml file](docker-compose.yml).

Run the quickstart:

```bash
npm run up
```

![npm run up console output](static/npm-run-up.png)

> **Note:** _To stop Orchestrate, run `npm run down`. `npm run down` stops all containers and removes all data volumes._

### Install Orchestrate command line interface (CLI)

```bash
npm install
```

Verify that the CLI is properly installed and list all commands:

```bash
npm run orchestrate help
```

To access details of each command:

```bash
npm run orchestrate [cmd] help
```

**Example:** `npm run orchestrate contracts help`

## Step 2 - Create an Ethereum account

### Create account

Use the Orchestrate CLI to generate an account:

```bash
npm run generate-account
```

![Generate account console output](static/generate-account.png)

We use this account as your network faucet.

### Copy account address

Copy the address and include it in the `.env` files as the `FAUCET_ACCOUNT` variable.

Example: `FAUCET_ACCOUNT=0x6230592812dE2E256D1512504c3E8A3C49975f07`

### List accounts stored in Hashicorp Vault

To view available accounts, run the `hashicorp-accounts` command:

```bash
npm run hashicorp-accounts
```

![Hashicorp accounts listing](static/hashicorp-accounts.png)

### Run Hashicorp Vault commands

Run any [Hashicorp Vault CLI command](https://www.vaultproject.io/docs/commands/) by running
`npm run hashicorp-vault` followed by the command:

```bash
npm run hashicorp-vault -- <command>
```

For example, to display the [vault token](https://www.vaultproject.io/docs/concepts/tokens):

```bash
npm run hashicorp-vault -- token lookup
```

## Step 3 - Connect to a blockchain network

### Register a blockchain network

Now that you have Orchestrate up and running and an account created,
it's time to connect Orchestrate to a blockchain network.

Use the Orchestrate REST API to register a blockchain network:

```bash
npm run register-chain
```

![Create chain console output](static/post-chain.png)

The chain unique identifier (`uuid`) is displayed in the JSON result.

> **Note:** _To make this quickstart easy, we provide an NPM command to register the network using the variables in the `.env` file.
> Under the hood, it's a Curl post request to Orchestrate REST API.
> Have a look at the `package.json` file for details on this command._

### Copy chain unique identifier

Copy the chain unique identifier `uuid` and paste it into your `.env` file
as the value for the `CHAIN_UUID` variable.

Example: `CHAIN_UUID=8a4d0093-c2b7-459b-af2a-8992aa145041`

> **Note:** _Depending on the network environment file you chose earlier, you connect your Orchestrate
> instance to a private local Besu network or to Rinkeby through [Infura](https://infura.io/).
> You can connect Orchestrate to any Ethereum network using the network RPC endpoint._

### Send a JSON-RPC request through blockchain proxy

Verify that the chain JSON-RPC is being proxied by Orchestrate:

```bash
npm run get-latest-block
```

![JSON-RPC test response](static/json-rpc-proxy.png)

> **Note:** _As with creating a chain, we provide an NPM command to make the request.
> Have a look at the `package.json` file for details on this command._

## Step 4 - Configure a faucet

> **Note:** _On paid gas networks (for example, public networks such as Ethereum mainnet or Rinkeby
> and also some private networks, such as the Besu one used in this quickstart),
> an Ethereum account must have a positive ETH balance to pay transactions fees for mining.
> Orchestrate provides a faucet to enable automatically providing the required ETH to accounts managed by Orchestrate_

### Create the faucet on Orchestrate

A [faucet](https://docs.orchestrate.pegasys.tech) is defined using a name, a creditor account used
to credit other accounts, and a chain identified by its UUID.

The following command uses the `CHAIN`, `CHAIN_UUID` and `FAUCET_ACCOUNT` values from the `.env` file to create a faucet.
The faucet is called with the chain name suffixed by `-faucet`.

Use the Orchestrate API to configure a faucet:

```bash
npm run create-faucet
```

![Create faucet console output](static/post-faucet.png)

### Send ETH to the faucet account

> **Important:** _In order to credit other addresses, the faucet account must have some ETH._

If you're not familiar with MetaMask, refer to this [article about getting started with Metamask](https://medium.com/openberry/getting-started-with-metamask-b9ac23a10c83).

#### Local Besu network

On the quickstart Besu local network, some [pre-defined accounts are configured with an ETH balance](https://besu.hyperledger.org/en/stable/Reference/Accounts-for-Testing/).

Connect Metamask to `http://localhost:8545` and transfer 1 or 2 ETH from one of the test accounts to
your `FAUCET_ACCOUNT` address.

#### Rinkeby

If connected to Rinkeby, the recommended approach is to credit the faucet account by transferring 1 or 2 ETH from one of your personal
Rinkeby accounts using [MetaMask](https://metamask.io/).

![Credit faucet with MetaMask](static/metamask-credit-faucet.png)

If you do not have any Rinkeby test ETH, you can request some for free from an [official Rinkeby faucet](https://faucet.rinkeby.io/).

## Step 5 - Register a smart contract

Orchestrate provides a contract registry.

You can use this registry to deploy contracts on your registered networks.
But first you have to create, compile, and add your contract to the registry.

### Compile the smart contract

```bash
npm run compile
```

![Compile contract console output](static/compile-contract.png)

_The Orchestrate Quickstart uses [Truffle](https://www.trufflesuite.com/) for compiling._

> **Note:** _The Quickstart provides a basic Solidity smart contract [Counter.sol](smart-contracts/Counter.sol)
> for demonstration purpose. The contract only increments an integer value._

### Push the smart contract to the Contract Registry

```bash
npm run register-contract
```

![Register contract console output](static/register-contract.png)

### List smart contracts stored in the Contract Registry

```bash
npm run get-catalog
```

![Get catalog console output](static/get-catalog.png)

### Get details about a smart contract

```bash
npm run get-contract
```

![Get contract console output](static/get-contract.png)

## Step 6 - Create an account to send transactions

Generate an account to be used for sending transactions to the smart contact. The generated account is stored by the Hashicorp Vault service.

```bash
npm run generate-account
```

![Generate account console output](static/generate-account-faucet.png)

**Note:** _The generated account is automatically funded by the faucet service configured previously._

### Copy account addresss

Copy the generated account address and set the `FROM_ACCOUNT` value with this address in `.env` file.

### Verify Rinkeby account funded

If using Rinkeby, you can verify that the account has been properly funded by the faucet using [Etherscan Rinkeby explorer](https://rinkeby.etherscan.io/). Search for the account address in the main search field.

![Etherscan display of generated account](static/etherscan-account.png)

## Step 7 - Deploy a smart contract and send transactions

### Listen to transaction receipts events

Orchestrate manages blockchain transactions that are asynchronous by nature due to blockchain mining time. Orchestrate provides an event consumer to process transaction receipts when they are generated.

Orchestrate uses [Apache Kafka](https://kafka.apache.org/) to handle these asynchronous communications.

In the next steps, we send two kinds of transactions:

- Create the contract on the chain
- Interact with the contract.

You have to run a consumer script to listen to the transaction receipt events and see them happen on the network.

On your current terminal, start the consumer and let the consumer run on foreground by keeping the terminal:

```bash
npm run consume
```

> **Reference script:** [consume.ts](src/consume/consume.ts)

![Consumer console output](static/npm-consume.png)

### Deploy the Smart Contract

On another terminal, in the same project directory, deploy the smart contract:

```bash
npm run deploy
```

After a few seconds (depending on block time), you see the receipt related to the contract creation transaction in the consumer terminal.

![Contract deployment transaction receipt](static/npm-deploy.png)

### Copy contract address

Copy the `contractAddress` in the receipt and set the `TO_ACCOUNT` value with this address in `.env` file.

### Verify Rinkeby contract deployed

If using Rinkeby, you can verify that the contract was deployed by using [Etherscan Rinkeby explorer](https://rinkeby.etherscan.io) and searching for the sender address.

![Etherscan display of deployed contract on Rinkeby](static/etherscan-deploy.png)

### Send a transaction to the smart contract

> **Important:** _Before moving forward, ensure the `FROM_ACCOUNT` and `TO_ACCOUNT` are set in the `.env` file._

On the second terminal, send the transaction:

```bash
npm run send-tx
```

After a few seconds (depending on block time), you see the transaction receipt in the consumer output on the first terminal.

![Receipt for transaction sent to the contract](static/npm-send-tx.png)

### Verify Rinkeby transaction

If using Rinkeby, you can verify the transaction was sent using [Etherscan Rinkeby explorer](https://rinkeby.etherscan.io) and searching for the sender address.

![Etherscan display of transaction on Rinkeby](static/etherscan-send-tx.png)

## Last step - Shut down the quickstart and remove data

Stop the consumer script by using `ctrl+C` in the terminal window where the script is running.

Stop the quickstart services and network:

```bash
npm run down
```
