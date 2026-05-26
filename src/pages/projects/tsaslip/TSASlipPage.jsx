import React, { useMemo, useState } from "react";
import "../SlipPages.css";

const dummyRows = [
  {
    id: 1,
    procNo: "TSA/CGC/2023-24",
    date: "10-07-2023",
    beneficiary: "Ms NANDANA B",
    head: "Manpower",
    amount: "62,000/-",
    status: "CLEAR",
  },
];

const TSASlipPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("claim");
  const [previewOpen, setPreviewOpen] = useState(false);

  const pdfUrl = useMemo(() => {
    const html = `
      <html>
      <head>
        <title>TSA Claim Bill</title>
        <style>
          body{font-family:Arial;padding:35px;color:#111}
          .bill{border:2px solid #111;padding:25px}
          h2,h4{text-align:center;margin:5px}
          table{width:100%;border-collapse:collapse;margin-top:20px}
          td{border:1px solid #222;padding:8px;font-size:13px}
          .boxes{display:flex;margin-top:40px;gap:20px}
          .box{border:1px solid #111;width:50%;height:130px;padding:10px}
        </style>
      </head>
      <body>
        <div class="bill">
          <h2>CENTRE FOR SPONSORED RESEARCH AND CONSULTANCY</h2>
          <h4>TSA CLAIM BILL</h4>
          <table>
            <tr><td>PFMS User ID</td><td>PFMS001</td></tr>
            <tr><td>CSRC Proc No.</td><td>TSA/CGC/2023-24</td></tr>
            <tr><td>Beneficiary</td><td>Ms NANDANA B</td></tr>
            <tr><td>Head</td><td>Manpower</td></tr>
            <tr><td>Amount</td><td>Rs. 62,000/-</td></tr>
          </table>
          <div class="boxes">
            <div class="box">TSA DATA APPROVER<br/><br/>ASST. SUPDT. DIR.</div>
            <div class="box">TSA PAYMENT AUTHORITY CSRC<br/><br/>ASST. SUPDT. DIR.</div>
          </div>
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
          <span>TSA(H) Slip</span>
        </div>
        <h1 className="page-title">TSA(H) Slip</h1>
        <p className="page-title-meta">Treasury Single Account Head claim management</p>
      </div>

      <div className="slip-action-row">
        <button className={activeTab === "claim" ? "slip-main-btn active" : "slip-main-btn"} onClick={() => setActiveTab("claim")}>New Claim</button>
        <button className={activeTab === "overhead" ? "slip-main-btn active blue" : "slip-main-btn blue"} onClick={() => setActiveTab("overhead")}>New Overheads</button>
        <button className={activeTab === "pdf" ? "slip-main-btn active yellow" : "slip-main-btn yellow"} onClick={() => setActiveTab("pdf")}>New PDFs</button>
      </div>

      {activeTab === "claim" && <ClaimForm title="New TSA(H) Claim" />}
      {activeTab === "overhead" && <OverheadForm title="New TSA(H) Overhead Claim" />}
      {activeTab === "pdf" && <PDFForm title="New TSA(H) PDF Claim" />}

      <SlipTable rows={dummyRows} onView={() => setPreviewOpen(true)} title="List of TSA(H) Claims" />

      {previewOpen && (
        <PDFPreviewModal title="TSA(H) Claim Bill Preview" pdfUrl={pdfUrl} onClose={() => setPreviewOpen(false)} />
      )}
    </div>
  );
};

const ClaimForm = ({ title }) => (
  <div className="slip-card">
    <h2>{title}</h2>
    <div className="slip-form-grid">
      <Input label="Digit 1 (Transaction Type)" type="select" options={["Payments(Charges)", "Receipts"]} />
      <Input label="Digit 2&3 (Primary Cost Centre)" type="select" options={["CSRC", "CGC"]} />
      <Input label="Digit 4&5 (Secondary Cost Centre)" type="select" options={["Research", "Development"]} />
      <Input label="Digit 6&7 (Ledger Group)" type="select" options={["Manpower", "Consumables"]} />
      <Input label="Digit 8&9 (General Ledger)" type="select" options={["Salary", "Equipment"]} />
      <Input label="CSRC Proc No. with Date" type="select" options={["TSA/CGC/2023-24 - 10-07-2023"]} />
      <Input label="Budget Heads" type="select" options={["Manpower", "Consumables", "Travel"]} />
    </div>
    <SubmitButton />
  </div>
);

const OverheadForm = ({ title }) => (
  <div className="slip-card">
    <h2>{title}</h2>
    <div className="slip-form-grid">
      <Input label="PFMS User ID" placeholder="PFMS User ID" />
      <Input label="Name of the Scheme & Code" type="select" options={["TSA Scheme - 1819", "TSA Scheme - 2024"]} />
      <Input label="CSRC Proc No. with Date" type="select" options={["TSA/CGC/2023-24"]} />
      <Input label="Overhead For" type="select" options={["Institute Overhead", "Department Overhead"]} />
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
      <Input label="Name of the Scheme & Code" type="select" options={["TSA Scheme - 1819", "TSA Scheme - 2024"]} />
      <Input label="CSRC Proc No. with Date" type="select" options={["TSA/CGC/2023-24"]} />
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
    {textarea ? <textarea className="slip-input textarea" placeholder={placeholder}></textarea> :
      type === "select" ? (
        <select className="slip-input">
          <option value="">-- Select --</option>
          {options.map((op) => <option key={op}>{op}</option>)}
        </select>
      ) : <input className="slip-input" type={type} placeholder={placeholder} />}
  </div>
);

const SubmitButton = () => <div className="slip-submit-row"><button>Submit Claim</button></div>;

const SlipTable = ({ rows, onView, title }) => (
  <div className="slip-table-card">
    <h2>{title}</h2>
    <div className="slip-table-wrap">
      <table>
        <thead>
          <tr><th>SL.No</th><th>Proc No</th><th>Date</th><th>Beneficiary</th><th>Head</th><th>Amount</th><th>Status</th><th>View</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.procNo}</td><td>{r.date}</td><td>{r.beneficiary}</td><td>{r.head}</td><td>{r.amount}</td>
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
          <a href={pdfUrl} download="tsa-claim.pdf">Download PDF</a>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
      <iframe src={pdfUrl} title={title}></iframe>
    </div>
  </div>
);

export default TSASlipPage;