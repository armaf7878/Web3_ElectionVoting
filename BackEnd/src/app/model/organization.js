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

    description: {
        type: String
    },

    memberLimit: {
        type: Number,
        default: 1000
    },

    approvalType: {
        type: String,
        enum: ["manual", "auto"],
        default: "manual"
    },

    members: [
        {
            walletAddress: String,
            status: {
                type: String,
                enum: ["pending", "approved", "rejected"],
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