const Election = require('../model/election');
const Organization = require('../model/organization');
const {ethers} = require('ethers');
const {
    wallet,
    abi,
    bytecode,
    getContract
} = require('../../config/blockchain');


class electionController{
    async create(req, res){
        try {
            const {
                name,
                organizationId,
                startTime,
                endTime,
                candidates,
                voters
            } = req.body;

            const creator = req.user.wallet;

            const organization = await Organization.findById(organizationId);

            if(!organization){
                return res.status(404).json({error: "Organization Not Found !"});
            }

            const exist = await Election.findOne({
                name,
                organization: organizationId
            });

            if(exist){
                return res.status(400).json({error: "Election name is exist !"});
            };

            const factory = new ethers.ContractFactory(
                abi,
                bytecode,
                wallet
            );

            const contract = await factory.deploy();

            await contract.waitForDeployment();

            const contractAddress = await contract.getAddress();

            //[ADD CANDIDATES]
            for(const candidate of candidates){
                const tx = contractAddress.addCandidate(
                    candidate.name
                )

                await tx.wait();
            };

            //[ADD VOTES]

            for(const voter of voters){
                const tx = contractAddress.addVoter(
                    voter.walletAddress
                );

                await tx.wait();
            };

            
            
        } catch (error) {
            
        }
    }
};
module.exports = new electionController()