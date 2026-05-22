const express = require("express");

const router = express.Router();

const endorsementFilesUpload = require("../middleware/reportUpload");

const {
  getEndorsements,

  createEndorsement,
} = require("../controllers/endorsementcontroller");

router.get(
  "/:userId",

  getEndorsements,
);

router.post(
  "/create",

  endorsementFilesUpload.fields([
    {
      name: "proposal_copy",
      maxCount: 1,
    },

    {
      name: "signed_writeup",
      maxCount: 1,
    },

    {
      name: "signed_budget",
      maxCount: 1,
    },

    {
      name: "endorsement_format_file",

      maxCount: 1,
    },

    {
      name: "overhead_exemption_file",

      maxCount: 1,
    },

    {
      name: "report_pdf",
      maxCount: 1,
    },
  ]),

  createEndorsement,
);

module.exports = router;
