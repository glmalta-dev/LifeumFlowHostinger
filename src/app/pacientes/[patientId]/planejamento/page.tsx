"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function PlanejamentoPage() {
  const params = useParams();
  const router = useRouter();
  const { patients } = useApp();

  const patientId = params.patientId as string;
  const patient = patients.find((p) => p.id === patientId);

  if (!patient) return null;

  // Mock planner areas
  const areas = [
    { id: "protese", title: "Prótese", status: "Em andamento", count: "3/5 etapas", progress: 60, color: "#1463e6" },
    { id: "implantodontia", title: "Implantodontia", status: "Pendente", count: "0/3 etapas", progress: 0, color: "#00629e" },
    { id: "dentistica", title: "Dentística", status: "Concluído", count: "4/4 etapas", progress: 100, color: "#26B978" },
    { id: "ortodontia", title: "Ortodontia", status: "Não Iniciado", count: "0/1 etapa", progress: 0, color: "#737786" }
  ];

  const handleAreaClick = (areaId: string) => {
    router.push(`/pacientes/${patientId}/planejamento/${areaId}`);
  };

  return (
    <>
      <div style={styles.headerRow}>
        <h3 style={styles.title}>Plano de Tratamento</h3>
        <span style={styles.sub}>Organizado por áreas clínicas</span>
      </div>

      <div style={styles.areaList}>
        {areas.map((area) => (
          <div 
            key={area.id} 
            onClick={() => handleAreaClick(area.id)}
            style={styles.areaCard}
          >
            <div style={styles.cardHeader}>
              <div style={styles.areaTitleArea}>
                <div style={{ ...styles.colorIndicator, backgroundColor: area.color }} />
                <h4 style={styles.areaName}>{area.title}</h4>
              </div>
              <span style={{ 
                ...styles.statusBadge, 
                backgroundColor: area.status === "Concluído" ? "var(--success-bg)" : area.status === "Em andamento" ? "rgba(20, 99, 230, 0.08)" : "rgba(115, 119, 134, 0.08)",
                color: area.status === "Concluído" ? "var(--success)" : area.status === "Em andamento" ? "var(--primary)" : "var(--text-secondary)"
              }}>
                {area.status}
              </span>
            </div>

            <div style={styles.progressSection}>
              <div style={styles.progressTextRow}>
                <span style={styles.progressLabel}>Progresso</span>
                <span style={styles.progressValue}>{area.count} ({area.progress}%)</span>
              </div>
              <div style={styles.progressBarBg}>
                <div style={{ ...styles.progressBarFill, width: `${area.progress}%`, backgroundColor: area.color }} />
              </div>
            </div>
            
            <div style={styles.footerRow}>
              <span style={styles.footerText}>Próxima Ação pendente</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--outline)" }}>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const styles = {
  headerRow: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
    padding: "4px 0",
  },
  title: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  sub: {
    fontSize: "11px",
    color: "var(--text-secondary)",
  },
  areaList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    width: "100%",
  },
  areaCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    cursor: "pointer",
    boxShadow: "var(--shadow-sm)",
    transition: "var(--transition-fast)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  areaTitleArea: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  colorIndicator: {
    width: "8px",
    height: "20px",
    borderRadius: "4px",
  },
  areaName: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: "bold",
  },
  progressSection: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  progressTextRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--text-secondary)",
  },
  progressLabel: {
    textTransform: "uppercase" as const,
    fontSize: "9px",
    letterSpacing: "0.5px",
  },
  progressValue: {
    color: "var(--text-primary)",
  },
  progressBarBg: {
    width: "100%",
    height: "6px",
    backgroundColor: "rgba(16, 32, 68, 0.05)",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.4s ease-out",
  },
  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid var(--border-light)",
    paddingTop: "10px",
    marginTop: "2px",
  },
  footerText: {
    fontSize: "11px",
    color: "var(--text-secondary)",
  }
};
