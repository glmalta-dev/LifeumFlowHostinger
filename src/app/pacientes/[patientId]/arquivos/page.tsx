"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function ArquivosPage() {
  const params = useParams();
  const router = useRouter();
  const { files, addFile } = useApp();
  
  const patientId = params.patientId as string;
  const filteredFiles = files.filter((f) => f.patientId === patientId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filename, setFilename] = useState("");

  const handleUploadSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filename) return;
    
    addFile({
      patientId,
      name: filename,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      mimeType: filename.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/png",
      downloadUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAH6DghNOpwVxNj7KcxHRysmfbU"
    });
    setFilename("");
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <div style={modalStyles.overlay} onClick={() => setIsModalOpen(false)}>
          <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
            <h4 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 700 }}>Anexar Exame (Simulador)</h4>
            <form onSubmit={handleUploadSimulate} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="form-group">
                <label className="form-label">NOME DO ARQUIVO</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: radiografia_panoramica.png"
                  value={filename}
                  onChange={e => setFilename(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: "10px" }}>Anexar</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, padding: "10px" }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={styles.headerRow}>
        <h3 style={styles.title}>Documentos e Exames</h3>
        <button 
          onClick={() => setIsModalOpen(true)} 
          style={styles.addBtn}
        >
          + Anexar Exame
        </button>
      </div>

      <div style={styles.fileList}>
        {filteredFiles.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Nenhum exame ou radiografia anexada.</p>
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div key={file.id} style={styles.fileCard}>
              <div style={styles.fileIconWrap}>
                {file.mimeType.includes("pdf") ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "#E5484D" }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "#26B978" }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                )}
              </div>
              
              <button type="button" onClick={() => router.push(`/pacientes/${patientId}/arquivos/${file.id}`)} style={styles.fileInfoButton}>
                <span style={styles.fileName}>{file.name}</span>
                <span style={styles.fileMeta}>Enviado em: {file.uploadDate} • {file.size}</span>
              </button>

              <div style={styles.actions}>
                <a 
                  href={file.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.actionBtn}
                  title="Baixar"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

const styles = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "4px 0",
  },
  title: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  addBtn: {
    padding: "6px 12px",
    backgroundColor: "rgba(20, 99, 230, 0.08)",
    color: "var(--primary)",
    border: "none",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  fileList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    width: "100%",
  },
  fileCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "12px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "var(--shadow-sm)",
  },
  fileIconWrap: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    backgroundColor: "rgba(16, 32, 68, 0.03)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  fileInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    minWidth: 0,
  },
  fileInfoButton: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column" as const,
    padding: 0,
    border: 0,
    background: "transparent",
    cursor: "pointer",
    textAlign: "left" as const,
  },
  fileName: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  fileMeta: {
    fontSize: "10px",
    color: "var(--text-secondary)",
    marginTop: "2px",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  actionBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "rgba(16, 32, 68, 0.05)",
    color: "var(--text-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    textDecoration: "none",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "40px 20px",
    color: "var(--text-secondary)",
  }
};

const modalStyles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10, 15, 25, 0.4)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modal: {
    width: "100%",
    maxWidth: "340px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "18px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    display: "flex",
    flexDirection: "column" as const,
  }
};
