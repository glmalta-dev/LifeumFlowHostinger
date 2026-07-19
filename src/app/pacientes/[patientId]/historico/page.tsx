"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function HistoricoPage() {
  const params = useParams();
  const { appointments, evolutions, files } = useApp();
  
  const patientId = params.patientId as string;

  // Build a unified timeline from different items
  const timelineItems = [
    ...appointments.filter(a => a.patientId === patientId).map(a => ({
      date: a.date,
      title: `Consulta de ${a.type.toUpperCase()}`,
      description: `Profissional: ${a.professional} • Status: ${a.status.toUpperCase()}`,
      icon: "calendar",
      color: "var(--primary)"
    })),
    ...evolutions.filter(e => e.patientId === patientId).map(e => ({
      date: e.date,
      title: `Evolução Clínica: ${e.procedure}`,
      description: e.description,
      icon: "evolution",
      color: "var(--success)"
    })),
    ...files.filter(f => f.patientId === patientId).map(f => ({
      date: f.uploadDate,
      title: `Arquivo Anexado: ${f.name}`,
      description: `Tamanho: ${f.size}`,
      icon: "file",
      color: "var(--warning)"
    }))
  ].sort((a, b) => b.date.localeCompare(a.date)); // Sort by date descending

  return (
    <>
      <div style={styles.headerRow}>
        <h3 style={styles.title}>Linha do Tempo Clínica</h3>
        <span style={styles.sub}>Histórico cronológico consolidado</span>
      </div>

      <div style={styles.timeline}>
        {timelineItems.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Nenhuma atividade registrada no histórico.</p>
          </div>
        ) : (
          timelineItems.map((item, idx) => (
            <div key={idx} style={styles.timelineItem}>
              <div style={styles.leftCol}>
                <div style={{ ...styles.iconBadge, backgroundColor: item.color }}>
                  {item.icon === "calendar" && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  )}
                  {item.icon === "evolution" && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  )}
                  {item.icon === "file" && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  )}
                </div>
                {idx < timelineItems.length - 1 && <div style={styles.timelineLine} />}
              </div>
              
              <div style={styles.rightCol}>
                <span style={styles.itemDate}>{item.date}</span>
                <h4 style={styles.itemTitle}>{item.title}</h4>
                <p style={styles.itemDesc}>{item.description}</p>
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
  timeline: {
    display: "flex",
    flexDirection: "column" as const,
    width: "100%",
    padding: "4px 10px 40px 10px",
  },
  timelineItem: {
    display: "flex",
    gap: "14px",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  iconBadge: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    zIndex: 2,
  },
  timelineLine: {
    width: "2px",
    flex: 1,
    backgroundColor: "var(--border-light)",
    margin: "4px 0",
  },
  rightCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
    paddingBottom: "24px",
  },
  itemDate: {
    fontSize: "10px",
    fontWeight: "bold",
    color: "var(--text-secondary)",
  },
  itemTitle: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginTop: "2px",
  },
  itemDesc: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    marginTop: "2px",
    lineHeight: "1.4",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "40px 20px",
    color: "var(--text-secondary)",
  }
};
