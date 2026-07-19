"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function ResumoPage() {
  const params = useParams();
  const router = useRouter();
  const { patients, appointments, showToast } = useApp();

  const patientId = params.patientId as string;
  const patient = patients.find((p) => p.id === patientId);

  if (!patient) return null;

  const nextApp = appointments
    .filter((a) => a.patientId === patientId && a.status === "agendado")
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const handleWhatsApp = () => {
    showToast("Abrindo conversa via WhatsApp...", "success");
    window.open(`https://wa.me/5511987654321?text=Olá ${patient.name}, gostaria de falar sobre seu tratamento.`, "_blank");
  };

  return (
    <>
      {/* Card 1: Próxima Ação */}
      <div className="card">
        <h3 style={styles.cardTitle}>Próxima Ação Clínico-Operacional</h3>
        {patient.nextAction ? (
          <div style={styles.actionContainer}>
            <div style={styles.actionAlert}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--error)" }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span style={styles.actionText}>{patient.nextAction}</span>
            </div>
            {patient.nextActionDate && (
              <span style={styles.actionDate}>Prazo: {patient.nextActionDate}</span>
            )}
          </div>
        ) : (
          <p style={styles.emptyText}>Nenhuma próxima ação cadastrada.</p>
        )}
      </div>

      {/* Card 2: Resumo de Agendamentos */}
      <div className="card">
        <h3 style={styles.cardTitle}>Status de Agendamento</h3>
        {nextApp ? (
          <div style={styles.infoRow}>
            <div>
              <div style={styles.infoValue}>{nextApp.date} às {nextApp.time}</div>
              <div style={styles.infoLabel}>{nextApp.type.toUpperCase()} - {nextApp.professional}</div>
            </div>
            <span style={{ ...styles.statusBadge, backgroundColor: "var(--success-bg)", color: "var(--success)" }}>
              Confirmado
            </span>
          </div>
        ) : (
          <div style={styles.infoRow}>
            <div>
              <div style={styles.infoValue}>Sem agendamentos ativos</div>
              <div style={styles.infoLabel}>Paciente necessita de contato para marcar retorno.</div>
            </div>
            <button 
              onClick={() => router.push(`/pacientes/${patientId}/agendamentos/editar`)} 
              style={styles.actionBtn}
            >
              Agendar
            </button>
          </div>
        )}
      </div>

      {/* Card 3: Dados Cadastrais Rápidos */}
      <div className="card">
        <div style={styles.cardHeaderRow}>
          <h3 style={styles.cardTitle}>Dados Cadastrais</h3>
          <button 
            onClick={() => router.push(`/pacientes/${patientId}/dados-cadastrais`)} 
            style={styles.editLink}
          >
            Editar
          </button>
        </div>
        <div style={styles.detailGrid}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>NASCIMENTO</span>
            <span style={styles.detailValue}>{patient.birthDate}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>CPF</span>
            <span style={styles.detailValue}>{patient.cpf || "Não informado"}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>E-MAIL</span>
            <span style={styles.detailValue}>{patient.email}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>OBSERVAÇÕES</span>
            <span style={styles.detailValue}>{patient.notes || "Sem observações registradas."}</span>
          </div>
        </div>
      </div>

      {/* Ações de Comunicação */}
      <div style={styles.buttonsRow}>
        <button onClick={handleWhatsApp} className="btn btn-secondary" style={styles.commBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          WhatsApp
        </button>
        <button onClick={() => showToast("Simulando ligação telefônica...", "success")} className="btn btn-secondary" style={styles.commBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          Ligar
        </button>
      </div>
    </>
  );
}

const styles = {
  cardTitle: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  actionContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  actionAlert: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    backgroundColor: "var(--error-bg)",
    padding: "8px 10px",
    borderRadius: "8px",
  },
  actionText: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--error)",
    lineHeight: "1.4",
  },
  actionDate: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--text-secondary)",
  },
  emptyText: {
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoValue: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  infoLabel: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    marginTop: "2px",
  },
  actionBtn: {
    padding: "6px 12px",
    backgroundColor: "var(--primary)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editLink: {
    background: "none",
    border: "none",
    color: "var(--primary)",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  detailGrid: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column" as const,
    borderBottom: "1px solid var(--border-light)",
    paddingBottom: "6px",
  },
  detailLabel: {
    fontSize: "9px",
    fontWeight: "bold",
    color: "var(--text-secondary)",
    letterSpacing: "0.5px",
  },
  detailValue: {
    fontSize: "13px",
    color: "var(--text-primary)",
    marginTop: "2px",
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: "bold",
  },
  buttonsRow: {
    display: "flex",
    gap: "10px",
    width: "100%",
  },
  commBtn: {
    flex: 1,
  }
};
