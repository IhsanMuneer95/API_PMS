const express = require('express');
const router = express.Router();
const {registerUser,loginUser,uploadFile,addProposal,getProposal,
    getAllProposal,updateProposalStatus,updateProposal,upsertSubmissionPeriod,getSubmissionPeriod } = require("../Controller/Controller");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/upload", uploadFile);
router.post("/set-submission-period", upsertSubmissionPeriod);
router.post("/submit-proposal/:id", addProposal);
router.patch("/reviewsubmiting/:proposalId", updateProposalStatus);
router.patch("/update-proposal/:id", updateProposal);
router.get("/get-proposal", getProposal);
router.get("/proposals", getAllProposal);
router.get("/getdeadline", getSubmissionPeriod);



module.exports = router;
