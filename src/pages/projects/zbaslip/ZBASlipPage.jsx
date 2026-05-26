import React, { useMemo, useState } from "react";
import "../SlipPages.css";

const dummyRows = [
  {
    id: 1,
    procNo: "01/CGC/DIR/2023-24",
    date: "10-07-2023",
    beneficiary: "Ms NANDANA B",
    head: "Manpower",
    amount: "62,000/-",
    status: "CLEAR",
  },
  {
    id: 2,
    procNo: "07/CGC/DIR/2022-23",
    date: "14-03-2023",
    beneficiary: "Dr. SHUBRA SINGH",
    head: "Consumables",
    amount: "1,09,720/-",
    status: "PAID",
  },
];

const ZBASlipPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("claim");
  const [previewOpen, setPreviewOpen] = useState(false);

  const pdfUrl = useMemo(() => {
    const html = `
      <html>
        <head>
          <title>ZBA Claim Bill</title>
          <style>
            body{font-family:Arial;padding:35px;color:#111}
            .bill{border:2px solid #111;padding:25px}
            h2{text-align:center;margin:0}
            h4{text-align:center;margin-top:5px}
            table{width:100%;border-collapse:collapse;margin-top:20px}
            td,th{border:1px solid #222;padding:8px;font-size:13px}
            .sign{text-align:right;margin-top:60px;font-weight:bold}
          </style>
        </head>
        <body>
          <div class="bill">
            <h2>CENTRE FOR SPONSORED RESEARCH AND CONSULTANCY</h2>
            <h4>ZBA CLAIM BILL</h4>
            <table>
              <tr><td>PFMS User ID</td><td>PFMS001</td></tr>
              <tr><td>CSRC Proc No.</td><td>01/CGC/DIR/2023-24</td></tr>
              <tr><td>Beneficiary</td><td>Ms NANDANA B</td></tr>
              <tr><td>Head</td><td>Manpower</td></tr>
              <tr><td>Amount</td><td>Rs. 62,000/-</td></tr>
              <tr><td>Details</td><td>Dummy ZBA claim PDF preview</td></tr>
            </table>
            <p class="sign">DIRECTOR / PROFESSOR AND HEAD</p>
          </div>
        </body>
      </html>
    `;
    return URL.createObjectURL(new Blob([html], { type: "text/html" }));
  }, []);

  return (
    <div className="slip-page">
      <div className="page-header">
        <div className="page-breadcrumb">
          Home / <span onClick={() => onNavigate?.("projects")}>My Projects</span> /{" "}
          <span>ZBA Slip</span>
        </div>
        <h1 className="page-title">ZBA Slip</h1>
        <p className="page-title-meta">Zero Balance Account claim management</p>
      </div>

      <div className="slip-action-row">
        <button className={activeTab === "claim" ? "slip-main-btn active" : "slip-main-btn"} onClick={() => setActiveTab("claim")}>
          New Claim
        </button>
        <button className={activeTab === "overhead" ? "slip-main-btn active blue" : "slip-main-btn blue"} onClick={() => setActiveTab("overhead")}>
          New Overheads
        </button>
        <button className={activeTab === "pdf" ? "slip-main-btn active yellow" : "slip-main-btn yellow"} onClick={() => setActiveTab("pdf")}>
          New PDFs
        </button>
      </div>

      {activeTab === "claim" && <ClaimForm title="New ZBA Claim" />}
      {activeTab === "overhead" && <OverheadForm title="New ZBA Overhead Claim" />}
      {activeTab === "pdf" && <PDFForm title="New ZBA PDF Claim" />}

      <SlipTable rows={dummyRows} onView={() => setPreviewOpen(true)} />

      {previewOpen && (
        <PDFPreviewModal
          title="ZBA Claim Bill Preview"
          pdfUrl={pdfUrl}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
};

const ClaimForm = ({ title }) => (
  <div className="slip-card">
    <h2>{title}</h2>
    <div className="slip-form-grid">
      <Input label="Digit 1 (Transaction Type)" type="select" options={["Payments(Charges)", "Receipts", "Adjustment"]} />
      <Input label="Digit 2&3 (Primary Cost Centre)" type="select" options={["Centre for Sponsored Research", "Crystal Growth Centre"]} />
      <Input label="Digit 4&5 (Secondary Cost Centre)" type="select" options={["Research", "Consultancy", "Development"]} />
      <Input label="Digit 6&7 (Ledger Group)" type="select" options={["Manpower", "Consumables", "Travel"]} />
      <Input label="Digit 8&9 (General Ledger)" type="select" options={["Salary", "Equipment", "Contingency"]} />
      <Input label="CSRC Proc No. with Date" type="select" options={["01/CGC/DIR/2023-24 - 10-07-2023", "07/CGC/DIR/2022-23 - 14-03-2023"]} />
      <Input label="Budget Heads" type="select" options={["Manpower", "Consumables", "Contingency", "Travel"]} />
    </div>
    <SubmitButton />
  </div>
);

const OverheadForm = ({ title }) => (
  <div className="slip-card">
    <h2>{title}</h2>
    <div className="slip-form-grid">
      <Input label="PFMS User ID" placeholder="PFMS User ID" />
      <Input label="Name of the Scheme & Code" type="select" options={["Scheme A - 1819", "Scheme B - 2024"]} />
      <Input label="CSRC Proc No. with Date" type="select" options={["01/CGC/DIR/2023-24", "07/CGC/DIR/2022-23"]} />
      <Input label="Overhead For" type="select" options={["Institute Overhead", "Department Overhead", "PI Overhead"]} />
      <Input label="HoD/Director's Procs No." placeholder="Proc. No." />
      <Input label="Proc. Date" type="date" />
      <Input label="Claim Amount" placeholder="Amount" />
    </div>
    <SubmitButton />
  </div>
);

const PDFForm = ({ title }) => (
  <div className="slip-card">
    <h2>{title}</h2>
    <div className="slip-form-grid">
      <Input label="PFMS User ID" placeholder="PFMS User ID" />
      <Input label="Name of the Scheme & Code" type="select" options={["Scheme A - 1819", "Scheme B - 2024"]} />
      <Input label="CSRC Proc No. with Date" type="select" options={["01/CGC/DIR/2023-24", "07/CGC/DIR/2022-23"]} />
      <Input label="HoD/Director's Procs No." placeholder="Proc. No." />
      <Input label="Proc. Date" type="date" />
      <Input label="Claim Amount" placeholder="Amount" />
      <Input label="Details of Claim" textarea placeholder="Enter claim details" />
    </div>
    <SubmitButton />
  </div>
);

const Input = ({ label, type = "text", options = [], textarea, placeholder }) => (
  <div className="slip-field">
    <label>{label}</label>
    {textarea ? (
      <textarea className="slip-input textarea" placeholder={placeholder}></textarea>
    ) : type === "select" ? (
      <select className="slip-input">
        <option value="">-- Select --</option>
        {options.map((op) => <option key={op}>{op}</option>)}
      </select>
    ) : (
      <input className="slip-input" type={type} placeholder={placeholder} />
    )}
  </div>
);

const SubmitButton = () => (
  <div className="slip-submit-row">
    <button>Submit Claim</button>
  </div>
);

const SlipTable = ({ rows, onView }) => (
  <div className="slip-table-card">
    <h2>List of ZBA Claims</h2>
    <div className="slip-table-wrap">
      <table>
        <thead>
          <tr>
            <th>SL.No</th>
            <th>Proc No</th>
            <th>Date</th>
            <th>Beneficiary</th>
            <th>Head</th>
            <th>Amount</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.procNo}</td>
              <td>{r.date}</td>
              <td>{r.beneficiary}</td>
              <td>{r.head}</td>
              <td>{r.amount}</td>
              <td><span className="slip-status">{r.status}</span></td>
              <td><button className="slip-view-btn" onClick={onView}>👁 Preview</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PDFPreviewModal = ({ title, pdfUrl, onClose }) => (
  <div className="slip-modal">
    <div className="slip-modal-box">
      <div className="slip-modal-head">
        <h3>{title}</h3>
        <div>
          <a href={pdfUrl} download="zba-claim.pdf">Download PDF</a>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
      <iframe src={pdfUrl} title={title}></iframe>
    </div>
  </div>
);

export default ZBASlipPage;