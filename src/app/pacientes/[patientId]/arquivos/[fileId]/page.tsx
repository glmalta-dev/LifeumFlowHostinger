"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BackHeader } from "@/components/layout/BackHeader";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/lib/supabaseClient";

export default function VisualizarArquivoPage() {
  const { patientId, fileId } = useParams<{ patientId: string; fileId: string }>();
  const { files, showToast } = useApp();
  const file = files.find((item) => item.id === fileId && item.patientId === patientId);
  const [urlToUse, setUrlToUse] = useState<string>("");

  useEffect(() => {
    if (!file) return;

    if (!file.externalUrl && supabase) {
      const filePath = file.downloadUrl.replace(/^patient-exams\//, "");
      
      supabase.storage
        .from("patient-exams")
        .createSignedUrl(filePath, 3600)
        .then(({ data, error }) => {
          if (error) {
            console.error("Erro ao gerar URL assinada:", error);
            showToast("Erro ao carregar arquivo de exames.", "error");
            setUrlToUse("");
          } else if (data?.signedUrl) {
            setUrlToUse(data.signedUrl);
          }
        });
    }
  }, [file, showToast]);

  if (!file) {
    return (
      <>
        <BackHeader title="Visualizar arquivo" backUrl={`/pacientes/${patientId}/arquivos`} />
        <div className="card"><p>Arquivo não encontrado.</p></div>
      </>
    );
  }

  const resolvedUrl = file.externalUrl || urlToUse;
  const isImage = file.mimeType.startsWith("image/") && resolvedUrl;

  return (
    <>
      <BackHeader title="Visualizar arquivo" backUrl={`/pacientes/${patientId}/arquivos`} />
      <section className="card" aria-labelledby="file-title">
        <div style={{ minHeight: 220, borderRadius: 12, background: "rgba(16,32,68,.04)", display: "grid", placeItems: "center", padding: 24, overflow: "hidden" }}>
          {isImage ? (
            <img 
              src={resolvedUrl}
              alt={`Exame ${file.name}`} 
              style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px", objectFit: "contain" }} 
            />
          ) : (
            <span style={{ fontSize: 52 }} aria-hidden="true">{file.mimeType.includes("pdf") ? "📄" : "🖼️"}</span>
          )}
        </div>
        <h2 id="file-title" style={{ fontSize: 18, overflowWrap: "anywhere", marginTop: "14px" }}>{file.title || file.name}</h2>
        <p>Enviado em {file.uploadDate} · {file.size}</p>
        
        {resolvedUrl && (
          <a className="btn btn-primary" href={resolvedUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: "8px" }}>
            Abrir exame completo
          </a>
        )}
      </section>
    </>
  );
}
