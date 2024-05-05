const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const Proposal = mongoose.model('Submition', proposalSchema);

module.exports = Proposal;
