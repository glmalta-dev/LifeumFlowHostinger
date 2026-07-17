"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BackHeader } from "@/components/layout/BackHeader";

export default function NovaEvolucaoPage() {
  const params = useParams();
  const router = useRouter();
  const { addEvolution, patients } = useApp();

  const patientId = params.patientId as string;
  const patient = patients.find((p) => p.id === patientId);

  // Form states
  const [procedure, setProcedure] = useState("");
  const [description, setDescription] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [returnDays, setReturnDays] = useState(30);
  const [professional, setProfessional] = useState("Dr. Gabriel Mendes");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!procedure || !description) {
      alert("Por favor, preencha o procedimento e o relato clínico.");
      return;
    }

    addEvolution({
      patientId,
      date: new Date().toISOString().split('T')[0],
      professional,
      procedure,
      description,
      nextStep: nextStep || undefined,
      recommendedReturnDays: returnDays || undefined
    });

    router.push(`/pacientes/${patientId}/evolucoes`);
  };

  return (
    <>
      <BackHeader title="Nova Evolução" backUrl={`/pacientes/${patientId}/evolucoes`} />

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Paciente */}
        <div style={styles.patientBanner}>
          <span style={styles.bannerLabel}>PACIENTE</span>
          <span style={styles.bannerVal}>{patient?.name}</span>
        </div>

        {/* Procedimento */}
        <div className="form-group">
          <label className="form-label">PROCEDIMENTO REALIZADO</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Ex: Manutenção, Profilaxia, Cimentação..."
            value={procedure} 
            onChange={(e) => setProcedure(e.target.value)} 
            required
          />
        </div>

        {/* Relato */}
        <div className="form-group">
          <label className="form-label">RELATO CLÍNICO (EVOLUÇÃO)</label>
          <textarea 
            rows={4} 
            className="form-control" 
            placeholder="Descreva detalhadamente o que foi realizado em boca, observações do paciente, anestésico usado, etc..."
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required
          />
        </div>

        {/* Próximo Passo */}
        <div className="form-group">
          <label className="form-label">PLANEJAMENTO DA PRÓXIMA ETAPA</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Ex: Instalação da coroa provisória, restauração dente 12..."
            value={nextStep} 
            onChange={(e) => setNextStep(e.target.value)} 
          />
        </div>

        {/* Retorno */}
        <div className="form-group">
          <label className="form-label">DIAS RECOMENDADOS PARA RETORNO</label>
          <select 
            className="form-control" 
            value={returnDays} 
            onChange={(e) => setReturnDays(Number(e.target.value))}
          >
            <option value={7}>7 dias (Pós-operatório curto)</option>
            <option value={15}>15 dias (Remoção de sutura)</option>
            <option value={30}>30 dias (Manutenção padrão)</option>
            <option value={90}>90 dias (Acompanhamento trimestral)</option>
            <option value={180}>180 dias (Prevenção semestral)</option>
          </select>
        </div>

        {/* Dentista */}
        <div className="form-group">
          <label className="form-label">PROFISSIONAL</label>
          <select 
            className="form-control" 
            value={professional} 
            onChange={(e) => setProfessional(e.target.value)}
          >
            <option value="Dr. Gabriel Mendes">Dr. Gabriel Mendes (Implantodontia)</option>
            <option value="Dra. Patricia Lima">Dra. Patricia Lima (Ortodontia)</option>
            <option value="Dr. Henrique Rocha">Dr. Henrique Rocha (Endodontia)</option>
          </select>
        </div>

        {/* Submit */}
        <div style={styles.actions}>
          <button type="submit" className="btn btn-primary">
            Registrar Evolução
          </button>
          <button 
            type="button" 
            onClick={() => router.push(`/pacientes/${patientId}/evolucoes`)}
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
    gap: "14px",
    width: "100%",
    paddingBottom: "40px",
  },
  patientBanner: {
    backgroundColor: "rgba(16, 32, 68, 0.03)",
    border: "1px solid var(--border-light)",
    padding: "10px 14px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
  },
  bannerLabel: {
    fontSize: "9px",
    fontWeight: "bold",
    color: "var(--text-secondary)",
  },
  bannerVal: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  actions: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    marginTop: "10px",
  }
};
