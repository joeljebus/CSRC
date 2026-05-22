import React, { useRef, useState, useEffect } from "react";
import "./ProfilePage.css";

import {
  getProfile,
  updateProfile,
  uploadDocument,
} from "../../services/profileservices";
/* ── Reusable plain field ── */
const Field = ({
  label,

  value,

  sensitive,

  editable,

  onChange,
}) => (
  <div className="field-group">
    <span className="field-label">{label}</span>

    {editable ? (
      <input
        type="text"
        className="field-input"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <div className={`field-value ${sensitive ? "sensitive" : ""}`}>
        {value}
      </div>
    )}
  </div>
);
/* ── Section wrapper ── */
const SectionCard = ({ title, icon, children }) => (
  <div className="profile-section-card">
    <div className="section-card-header">
      {icon}
      <h3>{title}</h3>
    </div>
    <div className="section-card-body">{children}</div>
  </div>
);

/* ── Document Row ── */
const DocRow = ({ label, fileKey, docState, onUpload, isEditing }) => {
  const inputRef = useRef(null);
  const doc = docState[fileKey];

  /*const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(fileKey, file);
  };*/

  const handleView = () => {
    if (doc?.url)
      window.open(
        `http://localhost:5000${doc.url}`,

        "_blank",
      );
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`http://localhost:5000${doc.url}`);

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = doc.file.name;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);

      alert("Download failed");
    }
  };

  return (
    <div className="doc-row">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        className="doc-file-input"
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files[0];

          if (file && onUpload) {
            onUpload(
              fileKey,

              file,
            );
          }
        }}
      />

      {/* Doc info */}
      <div className="doc-info">
        <div className="doc-name">{label}</div>
        <div
          className={`doc-status ${doc?.uploaded ? "uploaded" : "not-uploaded"}`}
        >
          <span className="doc-status-dot" />
          {doc?.uploaded ? "Document uploaded" : "Not uploaded"}
        </div>
        {doc?.file && <div className="doc-filename">{doc.file.name}</div>}
      </div>

      {/* Action buttons */}
      <div className="doc-actions">
        {/* Upload */}
        {isEditing && (
          <button
            className="doc-btn upload"
            onClick={() => inputRef.current.click()}
            title="Upload document"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />

              <polyline points="17 8 12 3 7 8" />

              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>

            {doc?.uploaded ? "Replace" : "Upload"}
          </button>
        )}

        {/* View */}
        <button
          className="doc-btn view"
          onClick={handleView}
          disabled={!doc?.uploaded}
          title="View document"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View
        </button>

        {/* Download */}
        <button
          className="doc-btn download"
          onClick={handleDownload}
          disabled={!doc?.uploaded}
          title="Download document"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
};

/* ── Main Profile Page ── */
const ProfilePage = () => {
  
const [profile, setProfile] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const handleChange = (field, value) => {
  setProfile((prev) => ({
    ...prev,

    [field]: value,
  }));
};
const handleSave = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    await updateProfile(
      user.id,

      profile,
    );

    alert("Profile updated successfully");

    setIsEditing(false);
  } catch (err) {
    console.log(err);

    console.log(err.response?.data);

    alert(err.response?.data?.message || "Update failed");
  }
};
  const handleUpload = async (key, file) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const formData = new FormData();

      formData.append(
        "document",

        file,
      );

      formData.append(
        "userId",

        user.id,
      );

      formData.append(
        "documentType",

        key,
      );

      await uploadDocument(formData);

      alert("Document uploaded");

      // REFRESH PROFILE

      const updated = await getProfile(user.id);

      setProfile(updated.data);
    } catch (err) {
      console.log(err);

      alert("Upload failed");
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // GET LOGGED-IN USER

        const user = JSON.parse(localStorage.getItem("user"));

        // CALL BACKEND

        const res = await getProfile(user.id);

        // STORE DATA

        setProfile(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-page">
      <div className="page-header">
        <div className="page-breadcrumb">
          Home / <span>Profile</span>
        </div>
        <h1 className="page-title">User Profile</h1>
      </div>

      {/* ── Hero ── */}
      <div className="profile-hero">
        <div className="profile-photo-wrap">
          <div className="profile-photo">
            {profile?.staff_name
              ? profile.staff_name.substring(0, 2).toUpperCase()
              : "AU"}
          </div>
          <button className="photo-upload-btn" title="Upload photo">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </button>
        </div>
        <div className="profile-hero-info">
          <div className="profile-name">
            {profile?.salutation} {profile?.initial} {profile?.staff_name}
          </div>
          <div className="profile-designation">
            {profile?.designation}

            {" — "}

            {profile?.department}
          </div>
          <div className="profile-tags">
            <span className="profile-tag">{profile?.campus || ""}</span>
            <span className="profile-tag">
              Staff ID: {profile?.user_id || ""}
            </span>
            <span className="profile-tag">
              Intercom: {profile?.intercom || ""}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-sections">
        {/* ── Personal Info ── */}
        <SectionCard
          title="Personal Information"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          }
        >
          <div className="fields-grid">
            <Field label="Staff ID" value={profile?.user_id || ""} />

            <Field
              label="Salutation"
              value={profile?.salutation || ""}
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "salutation",

                  value,
                )
              }
            />

            <Field
              label="Initial"
              value={profile?.initial || ""}
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "initial",

                  value,
                )
              }
            />

            <Field
              label="Staff Name"
              value={profile?.staff_name || ""}
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "staff_name",

                  value,
                )
              }
            />

            <Field
              label="Designation"
              value={profile?.designation || ""}
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "designation",

                  value,
                )
              }
            />

            <Field
              label="Department"
              value={profile?.department || ""}
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "department",

                  value,
                )
              }
            />

            <Field
              label="Campus"
              value={profile?.campus || ""}
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "campus",

                  value,
                )
              }
            />

            <Field
              label="Intercom"
              value={profile?.intercom || ""}
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "intercom",

                  value,
                )
              }
            />

            <Field
              label="Mobile"
              value={profile?.mobile || ""}
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "mobile",

                  value,
                )
              }
            />

            <Field
              label="Email ID"
              value={JSON.parse(localStorage.getItem("user"))?.email || ""}
            />

            <Field
              label="Date of Birth"
              value={profile?.dob || ""}
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "dob",

                  value,
                )
              }
            />

            <Field
              label="Date of Service"
              value={profile?.dos || ""}
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "dos",

                  value,
                )
              }
            />

            <Field
              label="Date of Superannuation"
              value={profile?.superannuation_date || ""}
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "superannuation_date",

                  value,
                )
              }
            />
          </div>
        </SectionCard>

        {/* ── Identity Documents ── */}
        <SectionCard
          title="Identity Documents"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
          }
        >
          <div className="fields-grid" style={{ marginBottom: 20 }}>
            <Field
              label="Aadhaar Number"
              value={profile?.aadhaar_number || ""}
              sensitive
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "aadhaar_number",

                  value,
                )
              }
            />

            <Field
              label="PAN Number"
              value={profile?.pan_number || ""}
              sensitive
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "pan_number",

                  value,
                )
              }
            />
          </div>

          <div className="doc-grid">
            <DocRow
              label="Aadhaar Card"
              fileKey="aadhaar"
              isEditing={isEditing}
              docState={{
                aadhaar: {
                  uploaded: !!profile?.aadhaar_file,

                  url: profile?.aadhaar_file,

                  file: {
                    name: "Aadhaar Card",
                  },
                },
              }}
              onUpload={isEditing ? handleUpload : null}
            />

            <DocRow
              label="PAN Card"
              fileKey="pan"
              isEditing={isEditing}
              docState={{
                pan: {
                  uploaded: !!profile?.pan_file,

                  url: profile?.pan_file,

                  file: {
                    name: "PAN Card",
                  },
                },
              }}
              onUpload={isEditing ? handleUpload : null}
            />
          </div>
        </SectionCard>

        {/* ── Bank Details ── */}
        <SectionCard
          title="Bank Details"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M3 9l9-5 9 5v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" />
              <polyline points="9 22 9 13 15 13 15 22" />
            </svg>
          }
        >
          <div className="fields-grid" style={{ marginBottom: 20 }}>
            <Field
              label="Bank Name"
              value={profile?.bank_name || ""}
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "bank_name",

                  value,
                )
              }
            />

            <Field
              label="Branch"
              value={profile?.branch || ""}
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "branch",

                  value,
                )
              }
            />

            <Field
              label="Account Number"
              value={profile?.account_number || ""}
              sensitive
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "account_number",

                  value,
                )
              }
            />

            <Field
              label="IFSC Code"
              value={profile?.ifsc_code || ""}
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "ifsc_code",

                  value,
                )
              }
            />

            <Field
              label="Account Type"
              value={profile?.account_type || ""}
              editable={isEditing}
              onChange={(value) =>
                handleChange(
                  "account_type",

                  value,
                )
              }
            />
          </div>

          <div className="doc-grid">
            <DocRow
              label=" Bank Passbook "
              fileKey="passbookOrCheque"
              isEditing={isEditing}
              docState={{
                passbookOrCheque: {
                  uploaded: !!profile?.passbook_file,

                  url: profile?.passbook_file,

                  file: {
                    name: "Passbook / Cancelled Cheque",
                  },
                },
              }}
              onUpload={isEditing ? handleUpload : null}
            />
          </div>
        </SectionCard>
        <button
          className="update-btn"
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? "Save Profile" : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
