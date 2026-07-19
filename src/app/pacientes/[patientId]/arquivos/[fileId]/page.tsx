"use client";

import { useParams } from "next/navigation";
import { BackHeader } from "@/components/layout/BackHeader";
import { useApp } from "@/context/AppContext";

export default function VisualizarArquivoPage() {
  const { patientId, fileId } = useParams<{ patientId: string; fileId: string }>();
  const { files } = useApp();
  const file = files.find((item) => item.id === fileId && item.patientId === patientId);
  return <>
    <BackHeader title="Visualizar arquivo" backUrl={`/pacientes/${patientId}/arquivos`} />
    {!file ? <div className="card"><p>Arquivo não encontrado.</p></div> : <section className="card" aria-labelledby="file-title">
      <div style={{ minHeight: 220, borderRadius: 12, background: "rgba(16,32,68,.04)", display: "grid", placeItems: "center", padding: 24 }}><span style={{ fontSize: 52 }} aria-hidden="true">{file.mimeType.includes("pdf") ? "📄" : "🖼️"}</span></div>
      <h2 id="file-title" style={{ fontSize: 18, overflowWrap: "anywhere" }}>{file.name}</h2>
      <p>Enviado em {file.uploadDate} · {file.size}</p>
      <a className="btn btn-primary" href={file.downloadUrl} target="_blank" rel="noopener noreferrer">Abrir arquivo original</a>
    </section>}
  </>;
}
