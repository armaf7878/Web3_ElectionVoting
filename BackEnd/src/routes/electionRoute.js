const express = require('express');
const route = express.Router();
const authMiddle = require('../app/midleware/authMiddleware');
const electionController = require('../app/controller/electionController');

route.post('/lookup_blockchain', authMiddle, electionController.lookupBlockchain);
route.post("/create/:organization_id" , authMiddle, electionController.create);
route.post("/add_candidate", authMiddle, electionController.addCandidate);
route.post("/add_voter", authMiddle, electionController.addVoter);
route.post("/vote/:electionID", authMiddle, electionController.vote);
route.post("/result/:electionID", authMiddle, electionController.getVoteResult);
route.get("/all/:organization_id", authMiddle, electionController.AllElectionInOrganize);
route.get("/detail/:election_id", authMiddle, electionController.DetailOrganization);
route.get("/info/:election_id", authMiddle, electionController.getElectionInfo);
route.get("/vote_transactions/:election_id", authMiddle, electionController.getVoteTransactions);
module.exports = route