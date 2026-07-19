"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BackHeader } from "@/components/layout/BackHeader";
import { useApp } from "@/context/AppContext";

export default function DetalheAreaPlanejamentoPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useApp();
  
  const patientId = params.patientId as string;
  const areaId = params.areaId as string;

  // Title translation
  const titles: Record<string, string> = {
    protese: "Prótese Dentária",
    implantodontia: "Implantodontia",
    dentistica: "Dentística Restauradora",
    ortodontia: "Ortodontia"
  };

  const areaTitle = titles[areaId] || "Planejamento Clínico";

  // Checklist state simulation
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Moldagem diagnóstica inicial", done: true },
    { id: 2, text: "Planejamento estético digital (wax-up)", done: true },
    { id: 3, text: "Prova de facetas / mock-up clínico", done: false },
    { id: 4, text: "Cimentação adesiva definitiva", done: false },
    { id: 5, text: "Consulta de ajuste oclusal final", done: false }
  ]);

  const handleToggle = (id: number) => {
    const item = checklist.find(i => i.id === id);
    if (!item) return;
    
    const nextDone = !item.done;
    setChecklist(prev => 
      prev.map(i => i.id === id ? { ...i, done: nextDone } : i)
    );
    showToast(nextDone ? "Etapa concluída!" : "Etapa reaberta.", "success");
  };

  const doneCount = checklist.filter(i => i.done).length;
  const progressPercent = Math.round((doneCount / checklist.length) * 100);

  return (
    <>
      <BackHeader title={areaTitle} backUrl={`/pacientes/${patientId}/planejamento`} />

      {/* Info Card */}
      <div className="card">
        <div style={styles.progressHeader}>
          <div>
            <div style={styles.progressLabel}>CHECKLIST DE PROCEDIMENTOS</div>
            <div style={styles.progressValue}>{doneCount} de {checklist.length} concluídos</div>
          </div>
          <span style={styles.percentBadge}>{progressPercent}%</span>
        </div>
        <div style={styles.progressBarBg}>
          <div style={{ ...styles.progressBarFill, width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Checklist Items */}
      <div style={styles.checklist}>
        {checklist.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handleToggle(item.id)}
            style={styles.checkRow}
          >
            <div style={{
              ...styles.checkbox,
              backgroundColor: item.done ? "var(--primary)" : "#ffffff",
              borderColor: item.done ? "var(--primary)" : "var(--outline-variant)"
            }}>
              {item.done && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
            <span style={{
              ...styles.itemText,
              textDecoration: item.done ? "line-through" : "none",
              color: item.done ? "var(--text-secondary)" : "var(--text-primary)",
              fontWeight: item.done ? 500 : 600
            }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Action CTA */}
      <button 
        onClick={() => {
          showToast("Salvo com sucesso!", "success");
          router.push(`/pacientes/${patientId}/planejamento`);
        }} 
        className="btn btn-primary"
        style={styles.saveBtn}
      >
        Concluir e Voltar
      </button>
    </>
  );
}

const styles = {
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: "9px",
    fontWeight: "bold",
    color: "var(--text-secondary)",
    letterSpacing: "0.5px",
  },
  progressValue: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginTop: "2px",
  },
  percentBadge: {
    fontSize: "18px",
    fontWeight: 800,
    color: "var(--primary)",
  },
  progressBarBg: {
    width: "100%",
    height: "6px",
    backgroundColor: "rgba(16, 32, 68, 0.05)",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "var(--primary)",
    borderRadius: "3px",
    transition: "width 0.3s ease-out",
  },
  checklist: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    width: "100%",
  },
  checkRow: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "12px",
    padding: "14px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    boxShadow: "var(--shadow-sm)",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    borderRadius: "6px",
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  },
  itemText: {
    fontSize: "13px",
  },
  saveBtn: {
    marginTop: "20px",
  }
};
