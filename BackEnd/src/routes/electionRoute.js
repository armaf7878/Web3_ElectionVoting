const express = require('express');
const route = express.Router();
const authMiddle = require('../app/midleware/authMiddleware');
const electionController = require('../app/controller/electionController');


route.post("/create_election" , authMiddle, electionController.create);
route.post("/:id", authMiddle, electionController.detail);

module.exports = route