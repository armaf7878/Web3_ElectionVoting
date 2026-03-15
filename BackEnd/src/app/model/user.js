const mongoose = require("mongoose");

const User = new mongoose.Schema({

    walletAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    name: {
        type: String,
        default: ""
    },

    email: {
        type: String,
        default: ""
    },

    organizations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    }]

}, { timestamps: true });

module.exports = mongoose.model("User", User);