const mongoose = require("mongoose");

const Election = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },

    createdBy: {
        type: String, // wallet address
        required: true
    },

    startTime: {
        type: Date,
        required: true
    },

    endTime: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "active", "ended"],
        default: "pending"
    },

    contractAddress: {
        type: String
    },

    candidates: [
        {
            name: String
        }
    ],

    voters: [
        {
            walletAddress: String
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    "Election",
    Election
);