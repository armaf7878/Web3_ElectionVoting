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
            user_id: mongoose.Schema.Types.ObjectId,
            name: String
        }
    ],

    voters: [
        {
            user_id: mongoose.Schema.Types.ObjectId,
            name: String
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