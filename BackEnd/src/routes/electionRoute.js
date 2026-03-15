const express = require('express');
const route = express.Router();
const authMiddle = require('../app/midleware/authMiddleware');
const electionController = require('../app/controller/electionController');


route.post("/create_election" , authMiddle, electionController.create);
route.post("/add_candidate", authMiddle, electionController.addCandidate);
route.post("/add_voter", authMiddle, electionController.addVoter);
route.post("/organization_election/:id", authMiddle, electionController.AllElectionInOrganize);
route.post("/detail_election/:id", authMiddle, electionController.DetailOrganization);

module.exports = route