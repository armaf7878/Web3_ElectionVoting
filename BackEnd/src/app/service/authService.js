const { ethers } = require("ethers");

exports.verifySignature = async (message, signature) => {

    const signerAddress = ethers.verifyMessage(message, signature);
        
    return signerAddress;

};