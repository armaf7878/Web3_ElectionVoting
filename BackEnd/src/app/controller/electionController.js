const Election = require('../model/election');
const Organization = require('../model/organization');
const {ethers} = require('ethers');
const {
    wallet,
    abi,
    bytecode,
    getContract
} = require('../../config/blockchain');
const election = require('../model/election');


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

            const creator = req.user.walletAddress;
            console.log(creator);

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

            // //[ADD CANDIDATES]
            // for(const candidate of candidates){
            //     const tx = contractAddress.addCandidate(
            //         candidate.name
            //     )

            //     await tx.wait();
            // };

            // //[ADD VOTES]

            // for(const voter of voters){
            //     const tx = contractAddress.addVoter(
            //         voter.walletAddress
            //     );

            //     await tx.wait();
            // };

            const tx = await contract.createElection(

                    name,

                    Math.floor(
                        new Date(startTime).getTime() / 1000
                    ),

                    Math.floor(
                        new Date(endTime).getTime() / 1000
                    )

                );

            await tx.wait();
                

            const election = await Election.create({

                    name,

                    organization: organizationId,

                    createdBy: creator,

                    contractAddress,

                    startTime,

                    endTime,

                    status: "pending"

                });
            
            res.status(201).json({

                message:
                "Election created successfully",

                election

            });

        } catch (error) {
            
            res.status(500).json({
                error: error.message
            });

        }
    };
    
    async AllElectionInOrganize(req, res){
        try {
            const {id} = req.params;
            const elections = await Election.find({organization: id});
            res.json(elections)
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    };

    async DetailOrganization(req, res){
        try {
            const{id} = req.params;
            const election = await Election.findOne({_id: id})
            res.json(election);
            
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    };

    async addCandidate(req, res){
        try {
            const{
                electionID,
                users
            } = req.body;

            const election = await Election.findOne({_id: electionID});
            
            if(!election){
                return res.status(404).json({Error: "Not Found Election"});
            };

            const contract = new ethers.Contract(
                election.contractAddress,
                abi,
                wallet
            );

            for(const user of users){
                const tx = await contract.addCandidate(user.name);
                await tx.wait();

                election.candidates.push({
                    user_id: user._id,
                    name: user.name
                });

                await election.save();
            }

            res.json({
                message:"Candidate added successfully"
            });

        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    };

    async addVoter(req, res){
        try {
            const{
                electionID,
                voters
            } = req.body;

            const election = await Election.findById(electionID);
            
            if(!election){
                return res.status(404).json({error: "Election Not Found!"});
            }
            
            const contract =  new ethers.Contract(
                election.contractAddress,
                abi,
                wallet
            );

            for(const voter of voters){
                const tx = await contract.addVoter(
                    voter.walletAddress
                );
                
                await tx.wait();

                election.voters.push({
                    voter_id: voter._id,
                    name: voter.name,
                });

                await election.save();
            }
            res.json({
                    message:"Voter added successfully"
                });
        } catch (error) {
            return res.status(500).json({error: error.message});
        }

    }

};
module.exports = new electionController()