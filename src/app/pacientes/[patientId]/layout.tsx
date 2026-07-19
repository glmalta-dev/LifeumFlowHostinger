"use client";

import React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BackHeader } from "@/components/layout/BackHeader";

interface PatientLayoutProps {
  children: React.ReactNode;
}

export default function PatientLayout({ children }: PatientLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { patients } = useApp();
  
  const patientId = params.patientId as string;
  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return (
      <div style={styles.errorContainer}>
        <p>Paciente não encontrado.</p>
        <button onClick={() => router.push("/pacientes")} className="btn btn-primary">
          Voltar para Lista
        </button>
      </div>
    );
  }

  const tabs = [
    { id: "resumo", label: "Resumo" },
    { id: "planejamento", label: "Planejamento" },
    { id: "agendamentos", label: "Agenda" },
    { id: "evolucoes", label: "Evoluções" },
    { id: "arquivos", label: "Arquivos" },
    { id: "historico", label: "Histórico" }
  ];

  const getActiveTab = () => {
    for (const tab of tabs) {
      if (pathname.includes(`/${tab.id}`)) {
        return tab.id;
      }
    }
    return "resumo";
  };

  const activeTab = getActiveTab();

  const handleTabClick = (tabId: string) => {
    router.push(`/pacientes/${patientId}/${tabId}`);
  };

  return (
    <>
      <BackHeader title="Ficha do Paciente" backUrl="/pacientes" />

      {/* Mini Perfil do Paciente no Cabeçalho */}
      <div style={styles.profileHeader}>
        <div style={styles.avatar}>
          {patient.name.charAt(0)}
        </div>
        <div style={styles.profileText}>
          <h2 style={styles.name}>{patient.name}</h2>
          <p style={styles.phone}>{patient.phone}</p>
        </div>
        <span style={{
          ...styles.statusTag,
          backgroundColor: patient.status === "alert" ? "var(--error-bg)" : "var(--success-bg)",
          color: patient.status === "alert" ? "var(--error)" : "var(--success)"
        }}>
          {patient.status === "alert" ? "Atenção" : "Ativo"}
        </span>
      </div>

      {/* Sub-abas de Navegação da Ficha */}
      <div style={styles.tabBar} className="hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            style={activeTab === tab.id ? styles.activeTabBtn : styles.tabBtn}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo Dinâmico */}
      <div style={styles.tabContent}>
        {children}
      </div>
    </>
  );
}

const styles = {
  profileHeader: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    border: "1px solid var(--border-light)",
    boxShadow: "var(--shadow-sm)",
    width: "100%",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "rgba(20, 99, 230, 0.08)",
    color: "var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "18px",
  },
  profileText: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    minWidth: 0,
  },
  name: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  phone: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    marginTop: "2px",
  },
  statusTag: {
    padding: "4px 8px",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: "bold",
  },
  tabBar: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "6px",
    width: "100%",
    borderBottom: "1px solid var(--border-light)",
    paddingBottom: "10px",
    marginTop: "6px",
  },
  tabBtn: {
    padding: "8px 4px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "rgba(16, 32, 68, 0.02)",
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    cursor: "pointer",
    textAlign: "center" as const,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: "var(--transition-fast)",
  },
  activeTabBtn: {
    padding: "8px 4px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "rgba(20, 99, 230, 0.08)",
    color: "var(--primary)",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "center" as const,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  tabContent: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
    width: "100%",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    padding: "40px 20px",
    width: "100%",
  }
};
