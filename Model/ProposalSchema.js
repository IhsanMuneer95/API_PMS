const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    rollNumber: {
        type: String,
        required: true,
        trim: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    accepted: {
        type: Number,
        default: 0
    },
    rejected: {
        type: Number,
        default: 0
    },
    teachers: [{ 
        type: String
    }],
    deadline: {
        type: Date,
        default: () => Date.now() + 3*24*60*60*1000 
    },
    message: [{
        type:String
    }]
}, {
    timestamps: true
});

const Proposal = mongoose.model('Proposals', proposalSchema);

module.exports = Proposal;
