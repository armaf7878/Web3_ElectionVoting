const mongoose = require("mongoose");

const Organization = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    owner: {
        type: String, // wallet address
        required: true
    },

    code: {
        type: String,
        unique: true
    },

    members: [
        {
            walletAddress: String,
            status: {
                type: String,
                enum: ["pending", "approved"],
                default: "pending"
            }
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    "Organization",
    Organization
);