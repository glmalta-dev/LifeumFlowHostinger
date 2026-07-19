"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { AppHeader } from "@/components/layout/AppHeader";

export default function PacientesPage() {
  const router = useRouter();
  const { patients } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "alert" | "inactive">("all");

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      (patient.cpf && patient.cpf.includes(searchTerm));
      
    const matchesStatus = statusFilter === "all" ? true : patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <AppHeader title="Pacientes" />

      {/* Busca e Filtros */}
      <div style={styles.filterSection}>
        <div style={styles.searchContainer}>
          <svg style={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Buscar por nome, CPF ou celular..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={styles.searchInput}
          />
        </div>

        <div style={styles.pillContainer}>
          <button 
            onClick={() => setStatusFilter("all")} 
            style={statusFilter === "all" ? styles.activePill : styles.pill}
          >
            Todos
          </button>
          <button 
            onClick={() => setStatusFilter("active")} 
            style={statusFilter === "active" ? styles.activePill : styles.pill}
          >
            Ativos
          </button>
          <button 
            onClick={() => setStatusFilter("alert")} 
            style={statusFilter === "alert" ? styles.activePill : styles.pill}
          >
            Atenção
          </button>
        </div>
      </div>

      {/* Lista de Pacientes */}
      <div style={styles.patientList}>
        {filteredPatients.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Nenhum paciente cadastrado correspondente aos filtros.</p>
          </div>
        ) : (
          filteredPatients.map((patient) => {
            const isAlert = patient.status === "alert";
            const isInactive = patient.status === "inactive";
            return (
              <div 
                key={patient.id} 
                onClick={() => router.push(`/pacientes/${patient.id}/resumo`)}
                style={styles.patientCard}
              >
                <div style={styles.avatarWrap}>
                  <div style={styles.avatar}>
                    {patient.name.charAt(0)}
                  </div>
                  <div style={{
                    ...styles.statusIndicator,
                    backgroundColor: isAlert ? "var(--error)" : isInactive ? "var(--outline)" : "var(--success)"
                  }} />
                </div>
                
                <div style={styles.patientInfo}>
                  <h3 style={styles.patientName}>{patient.name}</h3>
                  <p style={styles.patientPhone}>{patient.phone}</p>
                  {patient.nextAction && (
                    <div style={styles.nextActionContainer}>
                      <span style={styles.nextActionLabel}>PRÓXIMA AÇÃO:</span>
                      <span style={styles.nextActionText}>{patient.nextAction}</span>
                    </div>
                  )}
                </div>

                <svg style={styles.arrowIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button */}
      <Link href="/pacientes/novo" className="btn btn-primary" style={styles.floatingBtn}>
        + Novo Paciente
      </Link>
    </>
  );
}

const styles = {
  filterSection: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    width: "100%",
  },
  searchContainer: {
    position: "relative" as const,
    width: "100%",
  },
  searchIcon: {
    position: "absolute" as const,
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-secondary)",
  },
  searchInput: {
    width: "100%",
    padding: "12px 12px 12px 38px",
    border: "1px solid var(--outline-variant)",
    borderRadius: "12px",
    fontSize: "13px",
    outline: "none",
    fontFamily: "var(--font-family-body)",
    color: "var(--text-primary)",
    backgroundColor: "#ffffff",
  },
  pillContainer: {
    display: "flex",
    gap: "8px",
  },
  pill: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid var(--outline-variant)",
    backgroundColor: "#ffffff",
    color: "var(--text-secondary)",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "var(--transition-fast)",
  },
  activePill: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid var(--primary)",
    backgroundColor: "var(--primary)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },
  patientList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    width: "100%",
    paddingBottom: "80px",
  },
  patientCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "14px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    boxShadow: "var(--shadow-sm)",
    transition: "var(--transition-fast)",
  },
  avatarWrap: {
    position: "relative" as const,
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "rgba(20, 99, 230, 0.08)",
    color: "var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "16px",
  },
  statusIndicator: {
    position: "absolute" as const,
    bottom: "0",
    right: "0",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    border: "2px solid #ffffff",
  },
  patientInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
    minWidth: 0,
  },
  patientName: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  patientPhone: {
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  nextActionContainer: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
    marginTop: "2px",
  },
  nextActionLabel: {
    fontSize: "8px",
    fontWeight: "bold",
    color: "var(--error)",
    letterSpacing: "0.5px",
  },
  nextActionText: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  arrowIcon: {
    color: "var(--outline-variant)",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "40px 20px",
    color: "var(--text-secondary)",
  },
  floatingBtn: {
    position: "absolute" as const,
    bottom: "20px",
    left: "20px",
    right: "20px",
    width: "calc(100% - 40px)",
    zIndex: 10,
  }
};
