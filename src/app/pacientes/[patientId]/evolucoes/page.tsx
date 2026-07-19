"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function EvolucoesPage() {
  const params = useParams();
  const router = useRouter();
  const { evolutions, evolutionRevisions, reviseEvolution } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [procedure, setProcedure] = useState("");
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const patientId = params.patientId as string;
  const filteredEvos = evolutions.filter((e) => e.patientId === patientId);
  const openRevision = (id: string) => {
    const evolution = evolutions.find(item => item.id === id);
    if (!evolution) return;
    setEditingId(id); setProcedure(evolution.procedure); setDescription(evolution.description); setReason("");
  };
  const submitRevision = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingId || reason.trim().length < 3) return;
    setSaving(true);
    try { await reviseEvolution(editingId, { procedure: procedure.trim(), description: description.trim() }, reason.trim()); setEditingId(null); }
    finally { setSaving(false); }
  };

  return (
    <>
      {editingId && <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(10,15,25,.45)", display: "grid", placeItems: "center", padding: 20 }} onClick={() => setEditingId(null)}>
        <form className="card" onSubmit={submitRevision} onClick={event => event.stopPropagation()} style={{ width: "100%", maxWidth: 420, display: "grid", gap: 12 }}>
          <h2 style={{ fontSize: 16 }}>Revisar evolucao</h2>
          <div className="form-group"><label className="form-label" htmlFor="revision-procedure">PROCEDIMENTO</label><input id="revision-procedure" className="form-control" value={procedure} onChange={event => setProcedure(event.target.value)} required /></div>
          <div className="form-group"><label className="form-label" htmlFor="revision-description">DESCRICAO</label><textarea id="revision-description" className="form-control" rows={5} value={description} onChange={event => setDescription(event.target.value)} required /></div>
          <div className="form-group"><label className="form-label" htmlFor="revision-reason">JUSTIFICATIVA DA REVISAO</label><textarea id="revision-reason" className="form-control" rows={3} value={reason} onChange={event => setReason(event.target.value)} minLength={3} required /></div>
          <div style={{ display: "flex", gap: 8 }}><button className="btn btn-primary" disabled={saving}>{saving ? "Salvando..." : "Salvar revisao"}</button><button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancelar</button></div>
        </form>
      </div>}
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <small>{evolutionRevisions.filter(item => item.evolutionId === evo.id).length} revisao(oes)</small>
                <button type="button" className="btn btn-secondary" onClick={() => openRevision(evo.id)}>Revisar</button>
              </div>
              
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
