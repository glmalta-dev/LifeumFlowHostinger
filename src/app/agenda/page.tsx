"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { AppHeader } from "@/components/layout/AppHeader";

export default function AgendaPage() {
  const router = useRouter();
  const { appointments } = useApp();
  const [activeTab, setActiveTab] = useState<"hoje" | "todos">("hoje");

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredApps = appointments.filter((app) => {
    if (app.status === "cancelado") return false;
    if (activeTab === "hoje") {
      return app.date === todayStr;
    }
    return true; // All upcoming/past
  }).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  return (
    <>
      <AppHeader title="Agenda Geral" />

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button 
          onClick={() => setActiveTab("hoje")} 
          style={activeTab === "hoje" ? styles.tabActive : styles.tab}
        >
          Compromissos de Hoje
        </button>
        <button 
          onClick={() => setActiveTab("todos")} 
          style={activeTab === "todos" ? styles.tabActive : styles.tab}
        >
          Próximos Compromissos
        </button>
      </div>

      {/* Appointment list */}
      <div style={styles.list}>
        {filteredApps.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Nenhuma consulta agendada para este período.</p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div 
              key={app.id} 
              onClick={() => router.push(`/pacientes/${app.patientId}/resumo`)}
              style={styles.card}
            >
              <div style={styles.timeBlock}>
                <span style={styles.time}>{app.time}</span>
                <span style={styles.date}>{app.date}</span>
              </div>
              <div style={styles.infoCol}>
                <h4 style={styles.patientName}>{app.patientName}</h4>
                <p style={styles.appDesc}>{app.type.toUpperCase()} • {app.professional}</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--outline-variant)" }}>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          ))
        )}
      </div>
    </>
  );
}

const styles = {
  tabContainer: {
    display: "flex",
    borderBottom: "1px solid var(--border-light)",
    width: "100%",
  },
  tab: {
    flex: 1,
    padding: "10px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    cursor: "pointer",
    textAlign: "center" as const,
  },
  tabActive: {
    flex: 1,
    padding: "10px",
    background: "none",
    border: "none",
    borderBottom: "2px solid var(--primary)",
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--primary)",
    cursor: "pointer",
    textAlign: "center" as const,
  },
  list: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    width: "100%",
    paddingBottom: "80px",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "12px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    boxShadow: "var(--shadow-sm)",
  },
  timeBlock: {
    display: "flex",
    flexDirection: "column" as const,
    borderLeft: "3px solid var(--primary)",
    paddingLeft: "10px",
    width: "70px",
  },
  time: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "var(--text-primary)",
  },
  date: {
    fontSize: "10px",
    color: "var(--text-secondary)",
    marginTop: "2px",
  },
  infoCol: {
    flex: 1,
  },
  patientName: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  appDesc: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    marginTop: "2px",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "40px 20px",
    color: "var(--text-secondary)",
  }
};
