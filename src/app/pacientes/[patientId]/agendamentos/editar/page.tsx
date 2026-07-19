"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BackHeader } from "@/components/layout/BackHeader";
import type { Appointment } from "@/types";

export default function NovoAgendamentoPage() {
  const params = useParams();
  const router = useRouter();
  const { addAppointment, patients } = useApp();

  const patientId = params.patientId as string;
  const patient = patients.find((p) => p.id === patientId);

  // Form states
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<Appointment["type"]>("consulta");
  const [professional, setProfessional] = useState("Dr. Gabriel Mendes");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      alert("Por favor, preencha a data e o horário.");
      return;
    }

    addAppointment({
      patientId,
      patientName: patient ? patient.name : "Paciente Desconhecido",
      date,
      time,
      type,
      status: "agendado",
      professional,
      notes
    });

    router.push(`/pacientes/${patientId}/agendamentos`);
  };

  return (
    <>
      <BackHeader title="Novo Agendamento" backUrl={`/pacientes/${patientId}/agendamentos`} />

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Paciente */}
        <div style={styles.patientBanner}>
          <span style={styles.bannerLabel}>PACIENTE</span>
          <span style={styles.bannerVal}>{patient?.name}</span>
        </div>

        {/* Data */}
        <div className="form-group">
          <label className="form-label">DATA DA CONSULTA</label>
          <input 
            type="date" 
            className="form-control" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required
          />
        </div>

        {/* Horário */}
        <div className="form-group">
          <label className="form-label">HORÁRIO</label>
          <input 
            type="time" 
            className="form-control" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            required
          />
        </div>

        {/* Tipo */}
        <div className="form-group">
          <label className="form-label">TIPO DE ATENDIMENTO</label>
          <select 
            className="form-control" 
            value={type} 
            onChange={(e) => setType(e.target.value as Appointment["type"])}
          >
            <option value="consulta">Consulta de Avaliação</option>
            <option value="retorno">Retorno de Acompanhamento</option>
            <option value="cirurgia">Procedimento Cirúrgico</option>
            <option value="planejamento">Planejamento Clínico</option>
            <option value="manutencao">Manutenção Geral</option>
          </select>
        </div>

        {/* Dentista */}
        <div className="form-group">
          <label className="form-label">PROFISSIONAL RESPONSÁVEL</label>
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

        {/* Notas */}
        <div className="form-group">
          <label className="form-label">OBSERVAÇÕES CLÍNICAS</label>
          <textarea 
            rows={3} 
            className="form-control" 
            placeholder="Alguma nota importante sobre esta consulta..."
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div style={styles.actions}>
          <button type="submit" className="btn btn-primary">
            Salvar Agendamento
          </button>
          <button 
            type="button" 
            onClick={() => router.push(`/pacientes/${patientId}/agendamentos`)}
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
