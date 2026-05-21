const pool = require("../db/db");

// GET PROFILE

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await pool.query(
      `SELECT *

       FROM faculty_profile

       WHERE user_id = $1`,

      [userId],
    );

    // PROFILE NOT FOUND

    if (profile.rows.length === 0) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    // SUCCESS

    res.json(profile.rows[0]);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      salutation,

      initial,

      staff_name,

      designation,

      department,

      campus,

      intercom,

      mobile,

      dob,

      dos,

      superannuation_date,

      aadhaar_number,

      pan_number,

      bank_name,

      branch,

      account_number,

      ifsc_code,

      account_type,
    } = req.body;

    await pool.query(
      `UPDATE faculty_profile

       SET

       salutation=$1,

       initial=$2,

       staff_name=$3,

       designation=$4,

       department=$5,

       campus=$6,

       intercom=$7,

       mobile=$8,

       dob=$9,

       dos=$10,

       superannuation_date=$11,

       aadhaar_number=$12,

       pan_number=$13,

       bank_name=$14,

       branch=$15,

       account_number=$16,

       ifsc_code=$17,

       account_type=$18

       WHERE user_id=$19`,

      [
        salutation,

        initial,

        staff_name,

        designation,

        department,

        campus,

        intercom,

        mobile,

        dob,

        dos,

        superannuation_date,

        aadhaar_number,

        pan_number,

        bank_name,

        branch,

        account_number,

        ifsc_code,

        account_type,

        userId,
      ],
    );

    res.json({
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const {
      userId,

      documentType,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const filePath = `/uploads/${req.file.filename}`;

    let columnName = "";

    // MAP DOCUMENT TYPE

    if (documentType === "aadhaar") {
      columnName = "aadhaar_file";
    } else if (documentType === "pan") {
      columnName = "pan_file";
    } else if (documentType === "passbookOrCheque") {
      columnName = "passbook_file";
    }

    // UPDATE DB

    await pool.query(
      `UPDATE faculty_profile

       SET ${columnName} = $1

       WHERE user_id = $2`,

      [filePath, userId],
    );

    res.json({
      message: "Document uploaded",

      filePath,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Upload failed",
    });
  }
};