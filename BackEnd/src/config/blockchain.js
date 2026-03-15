const { ethers } = require("ethers");
require("dotenv").config();

const abi = require("../contract/abi.json");
const bytecode = require("../contract/bytecode.json");

const provider = new ethers.JsonRpcProvider(
    process.env.GANACHE_RPC
);

const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    provider
);

const getContract = (address) => {

    return new ethers.Contract(
        address,
        abi.abi,
        wallet
    );

};

module.exports = {

    provider,
    wallet,
    abi: abi.abi,
    bytecode: bytecode.bytecode,
    getContract

};