const {mongoose} = require('mongoose');

const Candidate = new mongoose.Schema({
    id:{
        type: String,
        
    }
});
module.exports = mongoose.model('Candidate', Candidate);
