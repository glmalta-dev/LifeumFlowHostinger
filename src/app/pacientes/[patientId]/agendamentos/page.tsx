"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function AgendamentosPage() {
  const params = useParams();
  const router = useRouter();
  const { appointments } = useApp();

  const patientId = params.patientId as string;
  const filteredApps = appointments.filter((a) => a.patientId === patientId);

  return (
    <>
      <div style={styles.headerRow}>
        <h3 style={styles.title}>Histórico de Consultas</h3>
        <button 
          onClick={() => router.push(`/pacientes/${patientId}/agendamentos/editar`)} 
          style={styles.addBtn}
        >
          + Novo Agendamento
        </button>
      </div>

      <div style={styles.appList}>
        {filteredApps.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Nenhuma consulta agendada para este paciente.</p>
          </div>
        ) : (
          filteredApps.map((app) => {
            const isCancelled = app.status === "cancelado";
            const isConfirmed = app.status === "confirmado";
            return (
              <div key={app.id} style={styles.appCard}>
                <div style={styles.appHeader}>
                  <div style={styles.timeBlock}>
                    <span style={styles.date}>{app.date}</span>
                    <span style={styles.time}>às {app.time}</span>
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: isCancelled ? "var(--error-bg)" : isConfirmed ? "var(--success-bg)" : "rgba(20, 99, 230, 0.08)",
                    color: isCancelled ? "var(--error)" : isConfirmed ? "var(--success)" : "var(--primary)"
                  }}>
                    {app.status.toUpperCase()}
                  </span>
                </div>
                
                <div style={styles.appBody}>
                  <div style={styles.infoGroup}>
                    <span style={styles.label}>TIPO DE PROCEDIMENTO</span>
                    <span style={styles.val}>{app.type.toUpperCase()}</span>
                  </div>
                  <div style={styles.infoGroup}>
                    <span style={styles.label}>PROFISSIONAL</span>
                    <span style={styles.val}>{app.professional}</span>
                  </div>
                </div>

                {app.notes && (
                  <p style={styles.notes}><strong>Notas:</strong> {app.notes}</p>
                )}
              </div>
            );
          })
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
  appList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    width: "100%",
  },
  appCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    boxShadow: "var(--shadow-sm)",
  },
  appHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeBlock: {
    display: "flex",
    flexDirection: "column" as const,
  },
  date: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  time: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    marginTop: "2px",
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "9px",
    fontWeight: "bold",
  },
  appBody: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
  },
  infoGroup: {
    display: "flex",
    flexDirection: "column" as const,
  },
  label: {
    fontSize: "8px",
    fontWeight: "bold",
    color: "var(--text-secondary)",
    letterSpacing: "0.5px",
  },
  val: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginTop: "2px",
  },
  notes: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    borderTop: "1px solid var(--border-light)",
    paddingTop: "8px",
    marginTop: "2px",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "40px 20px",
    color: "var(--text-secondary)",
  }
};
