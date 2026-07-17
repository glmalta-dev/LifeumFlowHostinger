"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BackHeader } from "@/components/layout/BackHeader";

export default function ConfiguracoesPage() {
  const router = useRouter();
  const { showToast } = useApp();

  const [clinicName, setClinicName] = useState("Lifeum Odontologia");
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyOverdue, setNotifyOverdue] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Configurações salvas com sucesso!", "success");
    router.push("/mais");
  };

  return (
    <>
      <BackHeader title="Configurações" backUrl="/mais" />

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Clinica */}
        <div className="form-group">
          <label className="form-label">NOME DA CLÍNICA</label>
          <input 
            type="text" 
            className="form-control" 
            value={clinicName} 
            onChange={(e) => setClinicName(e.target.value)} 
            required
          />
        </div>

        {/* Notificações */}
        <div className="form-group">
          <label className="form-label" style={{ marginBottom: "10px" }}>PREFERÊNCIAS DE ALERTAS</label>
          
          <div style={styles.switchRow}>
            <span>Cobrança de WhatsApp automática</span>
            <input 
              type="checkbox" 
              checked={notifyWhatsApp} 
              onChange={(e) => setNotifyWhatsApp(e.target.checked)} 
              style={styles.checkbox}
            />
          </div>

          <div style={styles.switchRow}>
            <span>Alertas de pendências atrasadas</span>
            <input 
              type="checkbox" 
              checked={notifyOverdue} 
              onChange={(e) => setNotifyOverdue(e.target.checked)} 
              style={styles.checkbox}
            />
          </div>
        </div>

        {/* Submit */}
        <div style={styles.actions}>
          <button type="submit" className="btn btn-primary">
            Salvar Preferências
          </button>
          <button 
            type="button" 
            onClick={() => router.push("/mais")}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "18px",
    width: "100%",
  },
  switchRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "10px",
    fontSize: "12px",
    color: "var(--text-primary)",
    fontWeight: 600,
    marginBottom: "8px",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    marginTop: "10px",
  }
};
