# EECE597Demo

This repo's code is based on the work of ChainlessJS and ChainlessServer. The ChainlessJS generated the skeleton code of the frontend, which is based on ReactJS. The ChainlessServer generated the skeleton code of backend, which is based on ExpressJS. The purpose of this project is to demonstrate the work of these two projects, proving that with these two projects, the game developer don't need to learn web3 related knowledge to do web3 game developments.

The demo takes the form of a online game center platform, contains two games for now: Gobang game and memory game. The user uses web3auth as login method and the two games are asscoiated with their own smart contract.

# Web3 dependencies

<code>web3</code>
<code>@web3auth/modal</code>

# How to deploy smart contracts
1. Instal npm dependencies

<code>cd contracts/GobangUserProfile</code>

<code>npm install</code>

2. Enter your mnemonic in the truffle-config.js

<code>vim truffle-config.js</code>

3. Compile and migrate the smart contract

<code>truffle compile</code>

<code>truffle migrate --network matic</code>

4. Repeat the steps for MemoryGameProfile smart contract

# How to run frontend

<code>cd frontend</code>

<code>npm install</code>

<code>npm start</code>

# How to run backend

<code>cd backend</code>

<code>npm install</code>

<code>node app.js</code>

# How to run test