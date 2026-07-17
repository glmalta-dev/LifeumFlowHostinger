"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BackHeader } from "@/components/layout/BackHeader";

export default function AlertasPage() {
  const router = useRouter();
  const { tasks, patients } = useApp();

  const highPriorityTasks = tasks.filter(t => t.status === "pending" && t.priority === "high");
  const alertPatients = patients.filter(p => p.status === "alert");

  return (
    <>
      <BackHeader title="Notificações e Alertas" backUrl="/hoje" />

      <div style={styles.list}>
        {/* Pacientes em estado de Alerta */}
        {alertPatients.map((patient) => (
          <div 
            key={patient.id} 
            onClick={() => router.push(`/pacientes/${patient.id}/resumo`)}
            style={styles.alertCard}
          >
            <div style={styles.iconWrapRed}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div style={styles.textCol}>
              <h4 style={styles.alertTitle}>Estado de Alerta: {patient.name}</h4>
              <p style={styles.alertDesc}>Paciente necessita de acompanhamento operacional ativo imediato.</p>
              {patient.nextAction && (
                <span style={styles.actionBadge}>PRÓXIMA AÇÃO: {patient.nextAction}</span>
              )}
            </div>
          </div>
        ))}

        {/* Pendências de alta prioridade */}
        {highPriorityTasks.map((task) => (
          <div 
            key={task.id} 
            onClick={() => router.push("/hoje/pendencias")}
            style={styles.alertCard}
          >
            <div style={styles.iconWrapYellow}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div style={styles.textCol}>
              <h4 style={styles.alertTitle}>Pendência Atrasada: {task.title}</h4>
              <p style={styles.alertDesc}>{task.description}</p>
              <span style={styles.patientBadge}>Paciente: {task.patientName}</span>
            </div>
          </div>
        ))}

        {alertPatients.length === 0 && highPriorityTasks.length === 0 && (
          <div style={styles.emptyState}>
            <p>Nenhum alerta ou notificação pendente.</p>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  list: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    width: "100%",
  },
  alertCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    gap: "12px",
    cursor: "pointer",
    boxShadow: "var(--shadow-sm)",
  },
  iconWrapRed: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "var(--error-bg)",
    color: "var(--error)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconWrapYellow: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "var(--warning-bg)",
    color: "var(--warning)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  alertTitle: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  alertDesc: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    lineHeight: "1.4",
  },
  actionBadge: {
    fontSize: "9px",
    fontWeight: "bold",
    color: "var(--error)",
    backgroundColor: "var(--error-bg)",
    padding: "2px 6px",
    borderRadius: "6px",
    width: "fit-content",
    marginTop: "2px",
  },
  patientBadge: {
    fontSize: "9px",
    fontWeight: "bold",
    color: "var(--primary)",
    backgroundColor: "rgba(20, 99, 230, 0.08)",
    padding: "2px 6px",
    borderRadius: "6px",
    width: "fit-content",
    marginTop: "2px",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "40px 20px",
    color: "var(--text-secondary)",
  }
};
