"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function EvolucoesPage() {
  const params = useParams();
  const router = useRouter();
  const { evolutions } = useApp();

  const patientId = params.patientId as string;
  const filteredEvos = evolutions.filter((e) => e.patientId === patientId);

  return (
    <>
      <div style={styles.headerRow}>
        <h3 style={styles.title}>Histórico de Evoluções Clínicas</h3>
        <button 
          onClick={() => router.push(`/pacientes/${patientId}/evolucoes/nova`)} 
          style={styles.addBtn}
        >
          + Nova Evolução
        </button>
      </div>

      <div style={styles.evoList}>
        {filteredEvos.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Nenhuma evolução clínica registrada.</p>
          </div>
        ) : (
          filteredEvos.map((evo) => (
            <div key={evo.id} style={styles.evoCard}>
              <div style={styles.evoHeader}>
                <span style={styles.evoDate}>{evo.date}</span>
                <span style={styles.evoDoctor}>{evo.professional}</span>
              </div>
              
              <h4 style={styles.procedureTitle}>{evo.procedure}</h4>
              <p style={styles.evoDesc}>{evo.description}</p>
              
              {(evo.nextStep || evo.recommendedReturnDays) && (
                <div style={styles.evoFooter}>
                  {evo.nextStep && (
                    <div style={styles.footerItem}>
                      <span style={styles.label}>PRÓXIMA ETAPA:</span>
                      <span style={styles.val}>{evo.nextStep}</span>
                    </div>
                  )}
                  {evo.recommendedReturnDays && (
                    <div style={styles.footerItem}>
                      <span style={styles.label}>RETORNO RECOMENDADO:</span>
                      <span style={styles.val}>{evo.recommendedReturnDays} dias</span>
                    </div>
                  )}
                </div>
              )}
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
  evoList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    width: "100%",
  },
  evoCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    boxShadow: "var(--shadow-sm)",
  },
  evoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--border-light)",
    paddingBottom: "6px",
  },
  evoDate: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "var(--text-primary)",
  },
  evoDoctor: {
    fontSize: "10px",
    color: "var(--text-secondary)",
  },
  procedureTitle: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--primary)",
  },
  evoDesc: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    lineHeight: "1.5",
  },
  evoFooter: {
    backgroundColor: "rgba(16, 32, 68, 0.03)",
    padding: "8px 10px",
    borderRadius: "8px",
    marginTop: "4px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  footerItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: "8px",
    fontWeight: "bold",
    color: "var(--text-secondary)",
  },
  val: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "40px 20px",
    color: "var(--text-secondary)",
  }
};
