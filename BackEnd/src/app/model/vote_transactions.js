const {default: mongoose, mongo} = require('mongoose');
const Schema = mongoose.Schema;

const VoteTransaction = new Schema({
    election_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        required: true  
    },
    voter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    candidate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    transactionHash: {
        type: String,
        required: true
    },
    blockNumber: {
        type: Number,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('VoteTransaction', VoteTransaction);