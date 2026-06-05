import { useEffect, useState } from "react";
import {
  FaFolderOpen,
  FaIdCard,
  FaAward,
  FaFilePdf,
  FaSearch,
  FaUpload,
  FaDownload,
  FaTrash,
  FaEdit,
  FaTimes,
  FaPlus,
  FaShieldAlt,
  FaGraduationCap,
} from "react-icons/fa";
import "./Documents.css";

const defaultDocuments = [
  {
    id: 1,
    title: "Enrollment Certificate - Liam Smith",
    type: "Certificates",
    owner: "Liam Smith",
    date: "2026-03-01",
    size: "245KB",
    uploadedBy: "Admin Office",
  },
  {
    id: 2,
    title: "Grade 6 Report Card - Emily Brown",
    type: "Report Card",
    owner: "Emily Brown",
    date: "2026-02-28",
    size: "180KB",
    uploadedBy: "Robert Chen",
  },
  {
    id: 3,
    title: "Student ID - Noah Johnson",
    type: "ID Card",
    owner: "Noah Johnson",
    date: "2026-04-01",
    size: "95KB",
    uploadedBy: "Admin Office",
  },
];

const defaultCertificates = [
  {
    id: 1,
    studentName: "Emily Brown",
    grade: "Grade 6",
    certificateType: "Merit Certificate",
    issueDate: "2026-03-15",
    remarks: "Excellent academic performance",
    theme: "merit",
  },
  {
    id: 2,
    studentName: "Liam Smith",
    grade: "Grade 5",
    certificateType: "Completion Certificate",
    issueDate: "2026-03-15",
    remarks: "Successfully completed academic year",
    theme: "completion",
  },
  {
    id: 3,
    studentName: "Noah Johnson",
    grade: "Grade 4",
    certificateType: "Attendance Certificate",
    issueDate: "2026-03-15",
    remarks: "Outstanding attendance record",
    theme: "attendance",
  },
];

const emptyDocument = {
  title: "",
  type: "Certificates",
  owner: "",
  date: new Date().toISOString().split("T")[0],
  size: "",
  uploadedBy: "",
};

const emptyCertificate = {
  studentName: "",
  grade: "Grade 1",
  certificateType: "Merit Certificate",
  issueDate: new Date().toISOString().split("T")[0],
  remarks: "",
  theme: "merit",
};

function Documents() {
  const [activeTab, setActiveTab] = useState("documents");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem("documents");
    return saved ? JSON.parse(saved) : defaultDocuments;
  });

  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem("certificates");
    return saved ? JSON.parse(saved) : defaultCertificates;
  });

  const [students] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });

  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [editingDocumentId, setEditingDocumentId] = useState(null);
  const [editingCertificateId, setEditingCertificateId] = useState(null);

  const [documentForm, setDocumentForm] = useState({ ...emptyDocument });
  const [certificateForm, setCertificateForm] = useState({
    ...emptyCertificate,
  });

  useEffect(() => {
    localStorage.setItem("documents", JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem("certificates", JSON.stringify(certificates));
  }, [certificates]);

  const filteredDocuments = documents.filter((doc) => {
    const keyword = searchTerm.toLowerCase();

    const matchesSearch =
      doc.title.toLowerCase().includes(keyword) ||
      doc.owner.toLowerCase().includes(keyword) ||
      doc.type.toLowerCase().includes(keyword);

    const matchesType = typeFilter === "All Types" || doc.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const filteredCertificates = certificates.filter((cert) => {
    const keyword = searchTerm.toLowerCase();

    return (
      cert.studentName.toLowerCase().includes(keyword) ||
      cert.certificateType.toLowerCase().includes(keyword) ||
      cert.grade.toLowerCase().includes(keyword)
    );
  });

  const studentRecords = documents.filter(
    (doc) => doc.type === "Report Card" || doc.type === "ID Card"
  );

  const openAddDocument = () => {
    setEditingDocumentId(null);
    setDocumentForm({ ...emptyDocument });
    setShowDocumentModal(true);
  };

  const openEditDocument = (doc) => {
    setEditingDocumentId(doc.id);
    setDocumentForm({ ...doc });
    setShowDocumentModal(true);
  };

  const saveDocument = (e) => {
    e.preventDefault();

    const newDoc = {
      id: editingDocumentId || Date.now(),
      ...documentForm,
      size: documentForm.size || "120KB",
      uploadedBy: documentForm.uploadedBy || "Admin Office",
    };

    if (editingDocumentId) {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === editingDocumentId ? newDoc : doc))
      );
    } else {
      setDocuments((prev) => [newDoc, ...prev]);
    }

    setShowDocumentModal(false);
    setEditingDocumentId(null);
    setDocumentForm({ ...emptyDocument });
  };

  const deleteDocument = (id) => {
    if (!window.confirm("Delete this document?")) return;
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const openAddCertificate = () => {
    setEditingCertificateId(null);
    setCertificateForm({ ...emptyCertificate });
    setShowCertificateModal(true);
  };

  const openEditCertificate = (cert) => {
    setEditingCertificateId(cert.id);
    setCertificateForm({ ...cert });
    setShowCertificateModal(true);
  };

  const saveCertificate = (e) => {
    e.preventDefault();

    const newCert = {
      id: editingCertificateId || Date.now(),
      ...certificateForm,
    };

    if (editingCertificateId) {
      setCertificates((prev) =>
        prev.map((cert) =>
          cert.id === editingCertificateId ? newCert : cert
        )
      );
    } else {
      setCertificates((prev) => [newCert, ...prev]);
    }

    setShowCertificateModal(false);
    setEditingCertificateId(null);
    setCertificateForm({ ...emptyCertificate });
  };

  const deleteCertificate = (id) => {
    if (!window.confirm("Delete this certificate?")) return;
    setCertificates((prev) => prev.filter((cert) => cert.id !== id));
  };

  const downloadCertificate = (cert) => {
    const content = `
EDUSMART SCHOOL

CERTIFICATE

This is to certify that

${cert.studentName}

from ${cert.grade}

has received

${cert.certificateType}

Issued Date: ${cert.issueDate}

Remarks:
${cert.remarks}

Authorized Signature
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${cert.studentName}-${cert.certificateType}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const downloadDocument = (doc) => {
    const content = `
EDUSMART SCHOOL DOCUMENT

Title: ${doc.title}
Type: ${doc.type}
Owner: ${doc.owner}
Date: ${doc.date}
Uploaded By: ${doc.uploadedBy}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="documents-page">
      <div className="page-title-row">
        <div>
          <h2>Documents</h2>
          <p>Manage student records, certificates and uploaded files</p>
        </div>

        <button
          className="upload-btn"
          onClick={
            activeTab === "certificates" ? openAddCertificate : openAddDocument
          }
        >
          <FaPlus />
          {activeTab === "certificates"
            ? "Generate Certificate"
            : "Upload Document"}
        </button>
      </div>

      <div className="document-stats">
        <div className="document-stat-card">
          <h3>{documents.length}</h3>
          <p>Total Documents</p>
        </div>

        <div className="document-stat-card">
          <h3>{certificates.length}</h3>
          <p>Total Certificates</p>
        </div>

        <div className="document-stat-card">
          <h3>{students.length || studentRecords.length}</h3>
          <p>Students Records</p>
        </div>

        <div className="document-stat-card">
          <h3>{documents.filter((doc) => doc.type === "Other").length || 4}</h3>
          <p>Other files</p>
        </div>
      </div>

      <div className="documents-tabs">
        <button
          className={activeTab === "documents" ? "active" : ""}
          onClick={() => setActiveTab("documents")}
        >
          <FaFolderOpen />
          All documents
        </button>

        <button
          className={activeTab === "records" ? "active" : ""}
          onClick={() => setActiveTab("records")}
        >
          <FaFolderOpen />
          Student records
        </button>

        <button
          className={activeTab === "certificates" ? "active" : ""}
          onClick={() => setActiveTab("certificates")}
        >
          <FaAward />
          Certificates
        </button>
      </div>

      <div className="documents-filter-card">
        <div className="documents-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search Student or roll no......"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {activeTab !== "certificates" && (
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option>All Types</option>
            <option>Certificates</option>
            <option>Report Card</option>
            <option>ID Card</option>
            <option>Other</option>
          </select>
        )}
      </div>

      {activeTab === "documents" && (
        <div className="document-list-card">
          {filteredDocuments.map((doc) => (
            <div className="document-row" key={doc.id}>
              <div className="doc-left">
                <div className="doc-icon pdf">
                  <FaFilePdf />
                </div>

                <div>
                  <h4>{doc.title}</h4>
                  <p>
                    {doc.owner} · {doc.date} · {doc.size} · By {doc.uploadedBy}
                  </p>
                </div>
              </div>

              <div className="doc-actions">
                <span className={`doc-badge ${doc.type.replace(" ", "-")}`}>
                  {doc.type}
                </span>

                <button onClick={() => downloadDocument(doc)}>
                  <FaDownload />
                </button>

                <button onClick={() => openEditDocument(doc)}>
                  <FaEdit />
                </button>

                <button onClick={() => deleteDocument(doc.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          {filteredDocuments.length === 0 && <p>No documents found</p>}
        </div>
      )}

      {activeTab === "records" && (
        <div className="document-list-card">
          {studentRecords.map((doc) => (
            <div className="document-row" key={doc.id}>
              <div className="doc-left">
                <div className="doc-icon record">
                  <FaIdCard />
                </div>

                <div>
                  <h4>{doc.title}</h4>
                  <p>
                    {doc.owner} · {doc.date} · {doc.size} · By {doc.uploadedBy}
                  </p>
                </div>
              </div>

              <div className="doc-actions">
                <span className="doc-badge ID-Card">{doc.type}</span>

                <button onClick={() => downloadDocument(doc)}>
                  <FaDownload />
                </button>

                <button onClick={() => openEditDocument(doc)}>
                  <FaEdit />
                </button>

                <button onClick={() => deleteDocument(doc.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          {studentRecords.length === 0 && <p>No student records found</p>}
        </div>
      )}

      {activeTab === "certificates" && (
        <div className="certificate-grid">
          {filteredCertificates.map((cert) => (
            <div className={`certificate-card ${cert.theme}`} key={cert.id}>
              <div className="certificate-top">
                <div className="certificate-icon">
                  {cert.theme === "attendance" ? (
                    <FaShieldAlt />
                  ) : cert.theme === "completion" ? (
                    <FaGraduationCap />
                  ) : (
                    <FaAward />
                  )}
                </div>

                <span>{cert.certificateType.replace(" Certificate", "")}</span>
              </div>

              <div className="certificate-body">
                <h3>{cert.certificateType}</h3>
                <p>{cert.studentName}</p>
                <p>Issued: {cert.issueDate}</p>
              </div>

              <button
                className="download-certificate-btn"
                onClick={() => downloadCertificate(cert)}
              >
                <FaDownload />
                Download Certificate
              </button>

              <div className="certificate-actions">
                <button onClick={() => openEditCertificate(cert)}>
                  <FaEdit />
                </button>

                <button onClick={() => deleteCertificate(cert.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          {filteredCertificates.length === 0 && <p>No certificates found</p>}
        </div>
      )}

      {showDocumentModal && (
        <div className="modal-overlay">
          <div className="document-modal">
            <div className="modal-header">
              <h3>{editingDocumentId ? "Edit" : "Upload"} Document</h3>

              <button onClick={() => setShowDocumentModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={saveDocument}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Document Title</label>
                  <input
                    value={documentForm.title}
                    onChange={(e) =>
                      setDocumentForm({
                        ...documentForm,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={documentForm.type}
                    onChange={(e) =>
                      setDocumentForm({
                        ...documentForm,
                        type: e.target.value,
                      })
                    }
                  >
                    <option>Certificates</option>
                    <option>Report Card</option>
                    <option>ID Card</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Owner</label>
                  <input
                    value={documentForm.owner}
                    onChange={(e) =>
                      setDocumentForm({
                        ...documentForm,
                        owner: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={documentForm.date}
                    onChange={(e) =>
                      setDocumentForm({
                        ...documentForm,
                        date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Size</label>
                  <input
                    value={documentForm.size}
                    onChange={(e) =>
                      setDocumentForm({
                        ...documentForm,
                        size: e.target.value,
                      })
                    }
                    placeholder="245KB"
                  />
                </div>

                <div className="form-group">
                  <label>Uploaded By</label>
                  <input
                    value={documentForm.uploadedBy}
                    onChange={(e) =>
                      setDocumentForm({
                        ...documentForm,
                        uploadedBy: e.target.value,
                      })
                    }
                    placeholder="Admin Office"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowDocumentModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCertificateModal && (
        <div className="modal-overlay">
          <div className="document-modal">
            <div className="modal-header">
              <h3>
                {editingCertificateId ? "Edit" : "Generate"} Certificate
              </h3>

              <button onClick={() => setShowCertificateModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={saveCertificate}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Student Name</label>
                  <input
                    value={certificateForm.studentName}
                    onChange={(e) =>
                      setCertificateForm({
                        ...certificateForm,
                        studentName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Grade</label>
                  <select
                    value={certificateForm.grade}
                    onChange={(e) =>
                      setCertificateForm({
                        ...certificateForm,
                        grade: e.target.value,
                      })
                    }
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((grade) => (
                      <option key={grade}>Grade {grade}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Certificate Type</label>
                  <select
                    value={certificateForm.certificateType}
                    onChange={(e) =>
                      setCertificateForm({
                        ...certificateForm,
                        certificateType: e.target.value,
                      })
                    }
                  >
                    <option>Merit Certificate</option>
                    <option>Completion Certificate</option>
                    <option>Attendance Certificate</option>
                    <option>Sports Certificate</option>
                    <option>Participation Certificate</option>
                    <option>Achievement Certificate</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Theme</label>
                  <select
                    value={certificateForm.theme}
                    onChange={(e) =>
                      setCertificateForm({
                        ...certificateForm,
                        theme: e.target.value,
                      })
                    }
                  >
                    <option value="merit">Merit</option>
                    <option value="completion">Completion</option>
                    <option value="attendance">Attendance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Issue Date</label>
                  <input
                    type="date"
                    value={certificateForm.issueDate}
                    onChange={(e) =>
                      setCertificateForm({
                        ...certificateForm,
                        issueDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group full">
                  <label>Remarks</label>
                  <textarea
                    value={certificateForm.remarks}
                    onChange={(e) =>
                      setCertificateForm({
                        ...certificateForm,
                        remarks: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCertificateModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Documents;