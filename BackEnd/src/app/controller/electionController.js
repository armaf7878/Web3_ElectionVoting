const Election = require('../model/election');
const User = require('../model/user');
const Organization = require('../model/organization');
const VoteTransaction = require('../model/vote_transactions');
const { ethers } = require('ethers');
const {
    provider,
    wallet,
    abi,
    bytecode,
    getContract,
    getWalletAddress
} = require('../../config/blockchain');
const election = require('../model/election');


class electionController {
    async create(req, res) {
        const  {organization_id}  = req.params;

        const candidates = [];
        for (const candidate of req.body.candidates) {
            const user = await User.findById(candidate);
            if (!user) {
                return res.status(404).json({ error: `Candidate with ID ${candidate} not found!` });
            }
            candidates.push({
                _id: user._id,
                name: user.name,
                walletAddress: user.walletAddress
            });
        }

        const voters = [];
        for (const voter of req.body.voters) {
            const user = await User.findById(voter);
            if (!user) {
                return res.status(404).json({ error: `Voter with ID ${voter} not found!` });
            }
            voters.push({
                _id: user._id,
                name: user.name,
                walletAddress: user.walletAddress
            });
        }
        
        try {
            const {
                name,
                startTime,
                endTime
            } = req.body;
            //Kiểm tra candidates và voters có trong organization hay không
            for (const candidate of candidates) {
                const existCandidate = await Organization.findOne({
                    _id: organization_id,
                    "members.user_id": candidate._id,
                    "members.status": "approved"
                });
                if (!existCandidate) {
                    return res.status(400).json({ error: `Candidate ${candidate.name} is not an approved member of the organization!` });      
                }
            }

            for (const voter of voters) {
                const existVoter = await Organization.findOne({
                    _id: organization_id,
                    "members.user_id": voter._id,
                    "members.status": "approved"
                });
                if (!existVoter) {
                    return res.status(400).json({ error: `Voter ${voter.name} is not an approved member of the organization!` });      
                }
            }

            const creator = req.user.walletAddress;
            console.log(`[electionController] Creating election: ${name} for organization: ${organization_id}`);

            const organization = await Organization.findById(organization_id);

            if (!organization) {
                return res.status(404).json({ error: "Organization Not Found !" });
            }

            if (req.user.id != organization.owner) {
                return res
                    .status(403)
                    .json({
                        error:
                            "Only the owner can create elections"
                    });
            }

            const exist = await Election.findOne({
                name,
                organization: organization_id
            });

            if (exist) {
                return res.status(400).json({ error: "Election name already exists in this organization!" });
            };

            console.log(`[electionController] Deploying Smart Contract...`);
            const factory = new ethers.ContractFactory(
                abi,
                bytecode,
                wallet
            );

            const contract = await factory.deploy();
            await contract.waitForDeployment();
            const contractAddress = await contract.getAddress();
            console.log(`[electionController] Contract deployed at: ${contractAddress}`);

            // Initialize election details on-chain
            const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
            const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

            console.log(`[electionController] Setting election details on-chain...`);
            const createTx = await contract.createElection(name, startTimestamp, endTimestamp);
            await createTx.wait();

            //[ADD CANDIDATES]
            console.log(`[electionController] Adding ${candidates.length} candidates...`);
            if(candidates.length > 0){
                for (const candidate of candidates) {
                    console.log(`[electionController] Adding candidate: ${candidate.name} with wallet: ${candidate.walletAddress}`);
                    const tx = await contract.addCandidate(candidate.name, candidate.walletAddress);
                    await tx.wait();
                };
            }
            
            //[ADD VOTERS]
            if(candidates.length > 0){
                console.log(`[electionController] Adding ${voters.length} voters...`);
                for (const voter of voters) {
                    const tx = await contract.addVoter(voter.walletAddress);
                    await tx.wait();
                };
            }
            
            // Save to Database
            const election = await Election.create({
                name,
                organization: organization_id,
                startTime,
                endTime,
                createdBy: creator,
                contractAddress,
                candidates,
                voters,
                status: "active" // Or pending depending on startTime
            });

            console.log(`[electionController] Election saved to DB: ${election._id}`);
            res.json(election);

        } catch (error) {
            console.error(`[electionController] Create error:`, error);
            res.status(500).json({
                error: error.message
            });
        }
    }

    async detail(req, res) {
        try {
            res.status(200).json({ message: "Detail empty placeholder" });
        } catch (error) {
            res.status(500).json({ error: "Server Error" });
        }
    };

    async AllElectionInOrganize(req, res) {
        try {
            const { organization_id } = req.params;
            const elections = await Election.find({ organization: organization_id });
            res.json(elections)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    async DetailOrganization(req, res) {
        try {
            const { election_id } = req.params;
            const election = await Election.findOne({ _id: id })
            res.json(election);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    async addCandidate(req, res) {
        try {
            const {
                electionID,
                users
            } = req.body;

            const election = await Election.findOne({ _id: electionID });

            if (!election) {
                return res.status(404).json({ Error: "Not Found Election" });
            };

            const contract = new ethers.Contract(
                election.contractAddress,
                abi,
                wallet
            );

            for (const user of users) {
                const tx = await contract.addCandidate(user.name);
                await tx.wait();

                election.candidates.push({
                    user_id: user._id,
                    name: user.name
                });

                await election.save();
            }

            res.json({
                message: "Candidate added successfully"
            });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };

    async addVoter(req, res) {
        try {
            const {
                electionID,
                voters
            } = req.body;

            const election = await Election.findById(electionID);

            if (!election) {
                return res.status(404).json({ error: "Election Not Found!" });
            }

            const contract = new ethers.Contract(
                election.contractAddress,
                abi,
                wallet
            );

            for (const voter of voters) {
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
                message: "Voter added successfully"
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }

    }
    
    async vote(req, res) {

        try {
            const  {electionID}  = req.params;
            const {
                candidate_id,
                private_key
            } = req.body;

            const candidate = await User.findById(candidate_id);
            if (!candidate) {
                return res.status(404).json({ error: "Candidate Not Found!" });
            }
            
            const election = await Election.findById(electionID);

            if (!election) {
                return res.status(404).json({ error: "Election Not Found!" });
            }

            
            const wallet_1 = getWalletAddress(private_key);
         
            
            if(wallet_1.signer.address !== req.user.walletAddress){
                console.log("Checking wallet address:", wallet_1.signer.address, "User's wallet address:", req.user.walletAddress);
                return res.status(403).json({ error: "Invalid private key for the authenticated user!" });
            }
            const contract = new ethers.Contract(
                election.contractAddress,
                abi,
                wallet_1
            );
            
            
            contract.on("VoteCast", (voter, candidate, event) => {
                console.log(`Vote casted by ${voter} for candidate ${candidate}`);
                // event metadata
                console.log("block:", event.log.blockNumber);
                console.log("txHash:", event.log.transactionHash);
            })
      
            try {
                await contract.vote.staticCall(candidate.walletAddress);
            } catch (err) {
                return res.status(403).json({ error: err.reason });
            }
            const tx = await contract.vote(candidate.walletAddress);
            const receipt = await tx.wait();
            console.log("Vote transaction receipt:", receipt, tx);
            // Save vote transaction details
            const voteTransaction = new VoteTransaction({
                election_id: election._id,
                voter_id: req.user.id,
                candidate_id: candidate._id,
                transactionHash: receipt.hash,
                blockNumber: receipt.blockNumber
            });

            await voteTransaction.save();

            res.json({
                message: "Vote casted successfully",
                voteTransaction: voteTransaction
            });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }

    }


    async getVoteResult(req, res) {

        try {
            const  {electionID}  = req.params;
            const {
                private_key
            } = req.body;
            
            const election = await Election.findById(electionID);

            if (!election) {
                return res.status(404).json({ error: "Election Not Found!" });
            }

            
            const wallet_1 = getWalletAddress(private_key);
            if(wallet_1.signer.address !== req.user.walletAddress){
                console.log("Checking wallet address:", wallet_1.signer.address, "User's wallet address:", req.user.walletAddress);
                return res.status(403).json({ error: "Invalid private key for the authenticated user!" });
            }
            const contract = new ethers.Contract(
                election.contractAddress,
                abi,
                wallet_1
            );
      
            try {
                const results = await contract.getResults();
                const resultFormated = [];
                for(let i = 0; i < results.length; i++){
                    resultFormated.push({
                        name: results[i].name,
                        voteCount: results[i].voteCount.toString()
                    })
                }
                console.log("Election Results:", resultFormated);
                res.json({
                    message: "Get results successfully",
                    results: resultFormated
                });
            } catch (err) {
                return res.status(403).json({ error: err });
            }

            

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }

    }

    async getElectionInfo(req, res) {
        try {
            const  {election_id}  = req.params;
            const election = await Election.findById(election_id)
                .populate('organization', 'name')
                .populate('candidates', 'name walletAddress')
                .populate('voters', 'name walletAddress'); 
            if (!election) {
                return res.status(404).json({ error: "Election Not Found!" });
            }   
              res.json(election);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }  
    
    async getVoteTransactions(req, res) {
        try {
            const  {election_id}  = req.params;
            const transactions = await VoteTransaction.find({ election_id })
                .populate('voter_id', 'name')
                .populate('candidate_id', 'name');
            res.json(transactions);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async lookupBlockchain(req, res) {
        
        try{
            const{tx_hash} = req.body;
            const iface = new ethers.Interface(abi);
            const tx = await provider.getTransaction(tx_hash);
            const receipt = await provider.getTransactionReceipt(tx_hash);
            if(tx){
                const decoded = iface.parseTransaction({
                    data: tx.data
                });
                console.log(decoded.name);   // tên function
                console.log(decoded.args);  
                const Candidate = await User.findOne({walletAddress: decoded.args[0]});
                const Voter = await User.findOne({walletAddress: tx.from});
                return res.json(
                    {
                        "txHash": tx_hash,
                        "status": receipt.status,
                        "from": tx.from,
                        "to_Contact": tx.to,
                        "action": {
                            "function": decoded.name,
                            "params": {
                                "voter_info": {
                                        "walletAddress": Voter.walletAddress,
                                        "name": Voter.name,
                                        "email": Voter.email
                                },
                                "candidate_info": {
                                        "walletAddress": Candidate.walletAddress,
                                        "name": Candidate.name,
                                        "email": Candidate.email
                                },
                            }
                        },
                        "block": tx.blockNumber,
                        "gas": {
                            "used": receipt.gasUsed.toString()
                        }
                    }
                )
            }
            else{
                return res.json({'tx_info': "Không tìm thấy tx"})
            }
            
        }
        catch(error){
            return res.status(500).json({err: error.message});
        }
        

     }


};
module.exports = new electionController()