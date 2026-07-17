"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { AppHeader } from "@/components/layout/AppHeader";

export default function FluxosPage() {
  const router = useRouter();
  const { flows, moveLead } = useApp();
  
  // Track open stages for accordion
  const [openStages, setOpenStages] = useState<Record<string, boolean>>({
    "stage-novo": true,
    "stage-agenda": true,
    "stage-planejamento": true,
    "stage-tratamento": true
  });

  const toggleStage = (stageId: string) => {
    setOpenStages(prev => ({ ...prev, [stageId]: !prev[stageId] }));
  };

  const handlePatientClick = (patientId: string) => {
    if (patientId.startsWith("pat-lead")) {
      router.push("/contatos");
    } else {
      router.push(`/pacientes/${patientId}/resumo`);
    }
  };

  const currentFlow = flows[0]; // "Fluxo Geral de Acompanhamento"

  return (
    <>
      <AppHeader title="Fluxos de Pacientes" />

      <div style={styles.headerRow}>
        <span style={styles.subtitle}>Funil clínico-operacional ativo</span>
      </div>

      <div style={styles.accordionContainer}>
        {currentFlow.stages.map((stage) => {
          const isOpen = openStages[stage.id];
          return (
            <div key={stage.id} style={styles.stageGroup}>
              {/* Accordion Header */}
              <div onClick={() => toggleStage(stage.id)} style={styles.stageHeader}>
                <div style={styles.headerTextCol}>
                  <h4 style={styles.stageTitle}>{stage.title}</h4>
                  <span style={styles.stageCount}>{stage.patients.length} pacientes</span>
                </div>
                <svg 
                  style={{
                    ...styles.arrowIcon,
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)"
                  }} 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>

              {/* Accordion Body */}
              {isOpen && (
                <div style={styles.stageBody}>
                  {stage.patients.length === 0 ? (
                    <p style={styles.emptyText}>Sem pacientes nesta etapa.</p>
                  ) : (
                    stage.patients.map((pat) => (
                      <div 
                        key={pat.id} 
                        onClick={() => handlePatientClick(pat.id)}
                        style={styles.patientCard}
                      >
                        <div style={styles.cardHeader}>
                          <span style={styles.cardName}>{pat.name}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--outline)" }}>
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </div>
                        <p style={styles.cardDetails}>{pat.details}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

const styles = {
  headerRow: {
    padding: "2px 0",
  },
  subtitle: {
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  accordionContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    width: "100%",
    paddingBottom: "80px",
  },
  stageGroup: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "var(--shadow-sm)",
  },
  stageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    backgroundColor: "rgba(16, 32, 68, 0.02)",
    cursor: "pointer",
    userSelect: "none" as const,
  },
  headerTextCol: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  stageTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  stageCount: {
    fontSize: "10px",
    fontWeight: "bold",
    backgroundColor: "rgba(20, 99, 230, 0.08)",
    color: "var(--primary)",
    padding: "2px 6px",
    borderRadius: "8px",
  },
  arrowIcon: {
    color: "var(--text-secondary)",
    transition: "transform 0.2s ease",
  },
  stageBody: {
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    borderTop: "1px solid var(--border-light)",
  },
  patientCard: {
    backgroundColor: "#fafafb",
    border: "1px solid rgba(16, 32, 68, 0.05)",
    borderRadius: "10px",
    padding: "10px 12px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
    transition: "var(--transition-fast)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardName: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  cardDetails: {
    fontSize: "11px",
    color: "var(--text-secondary)",
  },
  emptyText: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    textAlign: "center" as const,
    padding: "12px 0",
  }
};
