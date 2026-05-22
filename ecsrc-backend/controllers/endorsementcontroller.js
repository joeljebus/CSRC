const db = require("../db/db");
const pool = require("../db/db");
const fs = require("fs");

const path = require("path");

const { PDFDocument } = require("pdf-lib");
const getEndorsements = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await db.query(
      `
      SELECT

id,

endorsement_id,

applied_on,

scheme,

total_amount,

status,

pdf_file

FROM endorsements

WHERE user_id = $1

ORDER BY id DESC
      `,

      [userId],
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const mergePDFs = async (
  files,

  outputPath,
) => {
  const mergedPdf = await PDFDocument.create();

  for (const filePath of files) {
    if (!filePath || !fs.existsSync(filePath)) {
      continue;
    }

    // SKIP NON-PDF FILES

    if (path.extname(filePath) !== ".pdf") {
      continue;
    }

    const pdfBytes = fs.readFileSync(filePath);

    const pdf = await PDFDocument.load(pdfBytes);

    const copiedPages = await mergedPdf.copyPages(
      pdf,

      pdf.getPageIndices(),
    );

    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedBytes = await mergedPdf.save();

  fs.writeFileSync(
    outputPath,

    mergedBytes,
  );
};
const createEndorsement = async (req, res) => {
  try {
    const {
      user_id,

      funding_agency,

      funding_agency_type,

      project_type,

      scheme,

      full_project_title,

      reference_number,

      non_recurring,

      recurring,

      overhead_percent,

      gst_added,

      total_amount,

      submission_due_date,

      is_pi_regular_faculty,

      endorsement_required,

      endorsement_format,

     
    } = req.body;
    const coPrincipalInvestigators = JSON.parse(
      req.body.coPrincipalInvestigators || "[]",
    );

    const externalInvestigators = JSON.parse(
      req.body.externalInvestigators || "[]",
    );
    const reportPdf = req.files?.report_pdf?.[0]
      ? `/uploads/endorsements/${req.files.report_pdf[0].filename}`
      : null;
const endorsementCode = `END-${Date.now()}`;
const appliedDate = new Date();
    const endorsementResult = await pool.query(
      `
      INSERT INTO endorsements
(
  user_id,

  endorsement_id,
  applied_on,

  funding_agency,

  funding_agency_type,

  project_type,
  scheme,

  full_project_title,

  reference_number,

  non_recurring,

  recurring,

  overhead_percent,

  gst_added,

  total_amount,

  submission_due_date,

  is_pi_regular_faculty,

  endorsement_required,

  endorsement_format,
  report_pdf
)

      VALUES
(
  $1,$2,$3,$4,$5,
  $6,$7,$8,$9,$10,
  $11,$12,$13,$14,$15,
  $16,$17,$18,$19
)

      RETURNING id
      `,

      [
        user_id,

        endorsementCode,

        appliedDate,

        funding_agency,

        funding_agency_type,

        project_type,

        scheme,

        full_project_title,

        reference_number,

        non_recurring || null,

        recurring || null,

        overhead_percent || null,

        gst_added,

        total_amount || null,

        submission_due_date,

        is_pi_regular_faculty,

        endorsement_required,

        endorsement_format || null,
        reportPdf,
      ],
    );
    const endorsementId = endorsementResult.rows[0].id;
const files = req.files;
const proposalCopy = files?.proposal_copy?.[0]
  ? `/uploads/endorsements/${files.proposal_copy[0].filename}`
  : null;

const signedWriteup = files?.signed_writeup?.[0]
  ? `/uploads/endorsements/${files.signed_writeup[0].filename}`
  : null;

const signedBudget = files?.signed_budget?.[0]
  ? `/uploads/endorsements/${files.signed_budget[0].filename}`
  : null;

const endorsementFormatFile = files?.endorsement_format_file?.[0]
  ? `/uploads/endorsements/${files.endorsement_format_file[0].filename}`
  : null;

const overheadExemptionFile = files?.overhead_exemption_file?.[0]
  ? `/uploads/endorsements/${files.overhead_exemption_file[0].filename}`
  : null;
  await pool.query(
    `
  INSERT INTO endorsement_documents
  (
    endorsement_id,

    proposal_copy,

    signed_writeup,

    signed_budget,

    endorsement_format_file,

    overhead_exemption_file
  )

  VALUES ($1,$2,$3,$4,$5,$6)
  `,

    [
      endorsementId,

      proposalCopy,

      signedWriteup,

      signedBudget,

      endorsementFormatFile,

      overheadExemptionFile,
    ],
  );
    
const pdfFiles = [
  proposalCopy ? path.join(__dirname, "..", proposalCopy) : null,

  signedWriteup ? path.join(__dirname, "..", signedWriteup) : null,

  signedBudget ? path.join(__dirname, "..", signedBudget) : null,

  endorsementFormatFile
    ? path.join(__dirname, "..", endorsementFormatFile)
    : null,

  overheadExemptionFile
    ? path.join(__dirname, "..", overheadExemptionFile)
    : null,
];

const mergedPdfName = `${endorsementCode}.pdf`;

const mergedPdfPath = path.join(
  __dirname,

  "..",

  "uploads",

  "final-pdfs",

  mergedPdfName,
);

await mergePDFs(
  pdfFiles,

  mergedPdfPath,
);

const mergedPdfDbPath = `/uploads/final-pdfs/${mergedPdfName}`;
await pool.query(
  `
  UPDATE endorsements

  SET pdf_file = $1

  WHERE id = $2
  `,

  [mergedPdfDbPath, endorsementId],
);
    // INSERT CO-PI

    if (coPrincipalInvestigators && coPrincipalInvestigators.length > 0) {
      console.log(
        "COPI:",

        coPrincipalInvestigators,
      );

      for (const copi of coPrincipalInvestigators) {
        console.log(copi);

        if (!copi.copi_user_id) {
          continue;
        }

        await pool.query(
          `
      INSERT INTO endorsement_copi
      (
        endorsement_id,
        copi_user_id,
        role
      )

      VALUES ($1,$2,$3)
      `,

          [endorsementId, Number(copi.copi_user_id), copi.role || null],
        );
      }
    }
    // INSERT EXTERNAL INVESTIGATORS

    if (externalInvestigators && externalInvestigators.length > 0) {
      for (const ext of externalInvestigators) {
        // SKIP EMPTY ROWS

        if (!ext.full_name || ext.full_name.trim() === "") {
          continue;
        }
console.log(ext);
        await pool.query(
          `
    INSERT INTO endorsement_external_investigators
    (
      endorsement_id,
      full_name,
      designation,
      institute
    )

    VALUES ($1,$2,$3,$4)
    `,

          [
            endorsementId,

            ext.full_name,

            ext.designation || null,

            ext.institute || null,
          ],
        );
      }
    }
const reportPdfName = `${endorsementCode}-REPORT.pdf`;

const reportPdfPath = path.join(
  __dirname,

  "..",

  "uploads",

  "final-pdfs",

  reportPdfName,
);



const reportPdfDbPath = `/uploads/final-pdfs/${reportPdfName}`;

await pool.query(
  `
  UPDATE endorsements

  SET report_pdf = $1

  WHERE id = $2
  `,

  [reportPdfDbPath, endorsementId],
);
console.log(req.files);
    res.status(201).json({
      message: "Endorsement created successfully",

      endorsementId,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
module.exports = {
  getEndorsements,

  createEndorsement,
};
