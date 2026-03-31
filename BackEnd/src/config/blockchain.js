const { ethers } = require("ethers");
const { NonceManager } = require("ethers");
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

const managedWallet = new NonceManager(wallet);

const getContract = (address) => {

    return new ethers.Contract(
        address,
        abi.abi,
        wallet
    );

};

const getWalletAddress = (address) => {
    const wallet_1 = new ethers.Wallet(
        address,
        provider
    );

    const managedWallet_1 = new NonceManager(wallet_1);
    return managedWallet_1;
}

module.exports = {

    provider,
    wallet:managedWallet,
    abi: abi.abi,
    bytecode: bytecode.bytecode,
    getContract,
    getWalletAddress
};