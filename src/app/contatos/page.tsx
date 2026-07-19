"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { BackHeader } from "@/components/layout/BackHeader";
import type { Lead } from "@/types";

export default function ContatosPage() {
  const { leads, moveLead, showToast } = useApp();

  const handleLeadContact = (lead: Lead) => {
    showToast(`Disparando WhatsApp para Lead ${lead.name}...`, "success");
    window.open(`https://wa.me/5511987654321?text=Olá ${lead.name}, recebemos seu interesse pelo canal ${lead.source}.`, "_blank");
    
    // Auto advance state for demo
    if (lead.status === "novo") {
      moveLead(lead.id, "contatado");
    }
  };

  return (
    <>
      <BackHeader title="Contatos e Leads (CRM)" backUrl="/mais" />

      <div style={styles.leadList}>
        {leads.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Nenhum lead ativo encontrado.</p>
          </div>
        ) : (
          leads.map((lead) => {
            const isNew = lead.status === "novo";
            return (
              <div key={lead.id} style={styles.leadCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.leadNameBlock}>
                    <h4 style={styles.leadName}>{lead.name}</h4>
                    <span style={styles.leadSource}>Origem: {lead.source}</span>
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: isNew ? "var(--error-bg)" : "rgba(20, 99, 230, 0.08)",
                    color: isNew ? "var(--error)" : "var(--primary)"
                  }}>
                    {lead.status.toUpperCase()}
                  </span>
                </div>

                {lead.notes && (
                  <p style={styles.leadNotes}>{lead.notes}</p>
                )}

                <div style={styles.cardActions}>
                  <button onClick={() => handleLeadContact(lead)} className="btn btn-primary" style={styles.actionBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    Iniciar Contato
                  </button>
                  {lead.status === "contatado" && (
                    <button 
                      onClick={() => {
                        moveLead(lead.id, "agendado");
                      }} 
                      className="btn btn-secondary" 
                      style={styles.actionBtnSec}
                    >
                      Marcar Agendamento
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

const styles = {
  leadList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    width: "100%",
  },
  leadCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    boxShadow: "var(--shadow-sm)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leadNameBlock: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
  },
  leadName: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  leadSource: {
    fontSize: "10px",
    color: "var(--text-secondary)",
  },
  statusBadge: {
    padding: "2px 8px",
    borderRadius: "6px",
    fontSize: "9px",
    fontWeight: "bold",
  },
  leadNotes: {
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  cardActions: {
    display: "flex",
    gap: "8px",
    marginTop: "4px",
  },
  actionBtn: {
    padding: "8px 12px",
    fontSize: "12px",
    borderRadius: "8px",
    flex: 1,
  },
  actionBtnSec: {
    padding: "8px 12px",
    fontSize: "12px",
    borderRadius: "8px",
    flex: 1,
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "40px 20px",
    color: "var(--text-secondary)",
  }
};
