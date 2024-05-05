
const User = require("../Model/SignUpSchema")
const Proposal = require("../Model/ProposalSchema")
const Submition = require("../Model/SubmissionSchema")
const multer = require('multer');
const storage = require('../cloudinaryConfig');
const upload = multer({ storage: storage }).single('file');

require('dotenv').config();

const registerUser = async (req, res) => {
  const { organizationName, email, password, role } = req.body;
  try {
    const user = await User.create({
      organizationName,
      email,
      password,
      role
    });
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};


const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  console.log(email, password, role);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (password !== user.password) {
      return res.status(400).json({ success: false, error: "Invalid password" });
    }
    if (role !== user.role) {
      return res.status(400).json({ success: false, error: "Invalid role" });
    }

    // Now include the user's _id in the response
    res.json({
      success: true,
      message: "User authenticated successfully",
      userId: user._id  // Return the MongoDB ObjectId (_id) of the user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};


const uploadFile = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'Unknown error occurred when uploading.' });
    }

    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl: req.file.path
    });
  });
};

const addProposal = async (req, res) => {
  try {
    const { title, name, rollNumber, fileUrl, userId } = req.body;

    const newProposal = new Proposal({
      title,
      name,
      rollNumber,
      fileUrl,
      userId
    });

    await newProposal.save();

    res.status(201).json({
      success: true,
      message: 'Proposal submitted successfully',
      proposal: newProposal
    });
  } catch (error) {
    console.error('Failed to submit proposal:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting proposal',
      error: error.message
    });
  }
};

const upsertSubmissionPeriod = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
            let submission = await Submition.findOne();

      if (submission) {
                   submission.startDate = startDate;
          submission.endDate = endDate;
      } else {
          // If no submission period exists, create a new one
          submission = new Submition({
              startDate,
              endDate
          });
      }

      await submission.save(); 
      res.status(200).json({
          success: true,
          message: 'Submission period has been updated successfully.',
          submission
      });
  } catch (error) {
      console.error('Error updating submission period:', error);
      res.status(500).json({
          success: false,
          message: 'Failed to update submission period due to internal server error.',
          error: error.message
      });
  }
};

const getSubmissionPeriod = async (req, res) => {
  try {
     
      const submission = await Submition.findOne();

      if (submission) {
         
          res.status(200).json({
              success: true,
              message: 'Submission period retrieved successfully.',
              submission
          });
      } else {
         
          res.status(404).json({
              success: false,
              message: 'No submission period has been set.'
          });
      }
  } catch (error) {
      console.error('Error retrieving submission period:', error);
      res.status(500).json({
          success: false,
          message: 'Failed to retrieve submission period due to internal server error.',
          error: error.message
      });
  }
};


const getProposal = async (req, res) => {
  const userId = req.query.userId;  // Use req.query for GET requests
  console.log(userId);

  try {
    const proposals = await Proposal.find({ userId: userId }); // This looks incorrect if userId is meant to fetch proposals by a user field
    res.json({ proposals });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).send('Server Error');
  }
};

const getAllProposal = async (req, res) => {

  try {
    const proposals = await Proposal.find({});
    res.json({ proposals });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).send('Server Error');
  }
};

const updateProposalStatus = async (req, res) => {
  const { proposalId } = req.params;
  const { status, teacherId, message } = req.body;

  console.log('Status:', status, 'Proposal ID:', proposalId, 'Teacher ID:', teacherId);

  try {
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).send({ message: "Proposal not found" });
    }

    // Check if the teacher has already interacted with the proposal
    if (!proposal.teachers.includes(teacherId)) {
      proposal.teachers.push(teacherId);

      if (status === 'Accepted') {
        proposal.accepted += 1;
      } else if (status === 'Rejected') {
        proposal.rejected += 1;
      }

      // Add a new message to the message array without reassigning it
      proposal.message.push(message);

      proposal.status = status; 
      await proposal.save();

      res.status(200).send({
        message: 'Proposal status updated successfully',
        proposal: proposal
      });
    } else {
      res.status(200).send({
        message: 'This teacher has already interacted with this proposal.',
        proposal: proposal
      });
    }
  } catch (error) {
    console.error('Failed to update proposal status:', error);
    res.status(500).send({ message: 'Failed to update proposal status', error: error.toString() });
  }
};



const updateProposal = async (req, res) => {
  const { id } = req.params;
  const { title, name, rollNumber, fileUrl, status, message } = req.body;

  try {
    const proposal = await Proposal.findById(id);

    if (!proposal) {
      return res.status(404).json({ success: false, message: "Proposal not found" });
    }

    // Update fields only if they are provided in the request body
    if (title !== undefined) proposal.title = title;
    if (name !== undefined) proposal.name = name;
    if (rollNumber !== undefined) proposal.rollNumber = rollNumber;
    if (fileUrl !== undefined) proposal.fileUrl = fileUrl;
    if (status !== undefined) proposal.status = status;
    if (message !== undefined) proposal.message.push(message); // Assuming message is an array and you want to add to it

    await proposal.save();
    res.json({ success: true, message: "Proposal updated successfully", proposal });
  } catch (error) {
    console.error('Failed to update proposal:', error);
    res.status(500).json({ success: false, message: "Failed to update proposal" });
  }
};


module.exports = {
  registerUser, loginUser, uploadFile, addProposal, getProposal,
   getAllProposal,updateProposalStatus,updateProposal,upsertSubmissionPeriod,getSubmissionPeriod
};
