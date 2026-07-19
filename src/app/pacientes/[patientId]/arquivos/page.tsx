"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/lib/supabaseClient";
import { getErrorMessage } from "@/lib/errors";

export default function ArquivosPage() {
  const params = useParams();
  const router = useRouter();
  const { files, addFile, deleteFile, activeClinicId, showToast } = useApp();
  
  const patientId = params.patientId as string;
  const filteredFiles = files.filter((f) => f.patientId === patientId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("exame");
  const [notes, setNotes] = useState("");
  const [externalUrl, setExternalUrl] = useState("");

  const handleUploadReal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile && !externalUrl.trim()) {
      showToast("Selecione um arquivo ou informe um link externo.", "error");
      return;
    }
    if (!supabase || !activeClinicId) {
      showToast("Conexão com o Supabase ou clínica não ativa.", "error");
      return;
    }
    
    setIsUploading(true);

    try {
      if (!uploadFile) {
        const parsed = new URL(externalUrl);
        if (parsed.protocol !== "https:") throw new Error("O link externo deve usar HTTPS.");
        await addFile({
          patientId, name: title.trim() || parsed.hostname, title: title.trim() || undefined,
          category, notes: notes.trim() || undefined, externalUrl: parsed.toString(),
          uploadDate: new Date().toISOString().split("T")[0], size: "Link externo",
          mimeType: "text/uri-list", downloadUrl: parsed.toString()
        });
        setExternalUrl(""); setTitle(""); setNotes(""); setIsModalOpen(false);
        return;
      }
      const fileExt = uploadFile.name.split(".").pop();
      const fileName = `${activeClinicId}/${patientId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("patient-exams")
        .upload(fileName, uploadFile, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        showToast(`Erro no upload: ${uploadError.message}`, "error");
        setIsUploading(false);
        return;
      }

      const sizeInMB = uploadFile.size / (1024 * 1024);
      const friendlySize = sizeInMB >= 1 
        ? `${sizeInMB.toFixed(1)} MB` 
        : `${(uploadFile.size / 1024).toFixed(0)} KB`;

      try {
        await addFile({
          patientId, name: uploadFile.name, title: title.trim() || undefined,
          category, notes: notes.trim() || undefined,
          uploadDate: new Date().toISOString().split("T")[0], size: friendlySize,
          mimeType: uploadFile.type || "application/octet-stream", downloadUrl: fileName
        });
      } catch (metadataError) {
        await supabase.storage.from("patient-exams").remove([fileName]);
        throw metadataError;
      }

      setUploadFile(null); setTitle(""); setNotes("");
      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error("Falha ao salvar arquivo no banco:", err);
      showToast(`Erro ao salvar arquivo no banco: ${getErrorMessage(err, "erro desconhecido")}`, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const openFile = async (file: (typeof files)[number]) => {
    if (file.externalUrl) {
      window.open(file.externalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (!supabase) return;
    const storagePath = file.downloadUrl.replace(/^patient-exams\//, "");
    const { data, error } = await supabase.storage.from("patient-exams").createSignedUrl(storagePath, 60);
    if (error) { showToast(`Erro ao abrir arquivo: ${error.message}`, "error"); return; }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const removeFile = async (id: string) => {
    if (!window.confirm("Remover este arquivo permanentemente?")) return;
    await deleteFile(id);
  };

  return (
    <>
      {isModalOpen && (
        <div style={modalStyles.overlay} onClick={() => setIsModalOpen(false)}>
          <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
            <h4 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 700 }}>Anexar Exame Clínico</h4>
            <form onSubmit={handleUploadReal} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="form-group">
                <label htmlFor="file-title" className="form-label">TITULO</label>
                <input id="file-title" className="form-control" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Radiografia panoramica" />
              </div>
              <div className="form-group">
                <label htmlFor="file-category" className="form-label">CATEGORIA</label>
                <select id="file-category" className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="exame">Exame</option><option value="imagem">Imagem</option>
                  <option value="documento">Documento</option><option value="outros">Outros</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="file-input" className="form-label">SELECIONE O EXAME (PDF OU IMAGEM)</label>
                <input
                  id="file-input"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  className="form-control"
                  onChange={e => setUploadFile(e.target.files?.[0] || null)}
                  disabled={isUploading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="external-url" className="form-label">OU LINK EXTERNO HTTPS</label>
                <input id="external-url" type="url" className="form-control" value={externalUrl} onChange={e => setExternalUrl(e.target.value)} disabled={isUploading} />
              </div>
              <div className="form-group">
                <label htmlFor="file-notes" className="form-label">OBSERVACOES</label>
                <textarea id="file-notes" className="form-control" rows={2} value={notes} onChange={e => setNotes(e.target.value)} disabled={isUploading} />
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: "10px" }} disabled={isUploading || (!uploadFile && !externalUrl.trim())}>
                  {isUploading ? "Enviando..." : "Anexar"}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, padding: "10px" }} disabled={isUploading}>
                  Cancelar
                </button>
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
                <span style={styles.fileName}>{file.title || file.name}</span>
                <span style={styles.fileMeta}>Enviado em: {file.uploadDate} • {file.size}</span>
              </button>

              <div style={styles.actions}>
                <button
                  type="button"
                  onClick={() => void openFile(file)}
                  style={styles.actionBtn}
                  title="Abrir"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
                <button type="button" onClick={() => void removeFile(file.id)} style={styles.actionBtn} title="Excluir">×</button>
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
    border: "none",
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
