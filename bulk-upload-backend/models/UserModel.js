const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name: {
        type: String
    },
    Email: {
        type: String
    },
    Designation: {
        type: String
    },
    Mobile: {
        type: String
    }
});

module.exports = mongoose.model('userDetail', userSchema);