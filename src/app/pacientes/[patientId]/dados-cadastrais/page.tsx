"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BackHeader } from "@/components/layout/BackHeader";

export default function DadosCadastraisPage() {
  const params = useParams();
  const router = useRouter();
  const { patients, updatePatient } = useApp();

  const patientId = params.patientId as string;
  const patient = patients.find((p) => p.id === patientId);

  // Form states
  const [name, setName] = useState(patient?.name ?? "");
  const [phone, setPhone] = useState(patient?.phone ?? "");
  const [email, setEmail] = useState(patient?.email ?? "");
  const [birthDate, setBirthDate] = useState(patient?.birthDate ?? "");
  const [status, setStatus] = useState<"active" | "alert" | "inactive">(patient?.status ?? "active");
  const [nextAction, setNextAction] = useState(patient?.nextAction ?? "");
  const [notes, setNotes] = useState(patient?.notes ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Por favor, preencha nome e celular.");
      return;
    }

    updatePatient(patientId, {
      name,
      phone,
      email,
      birthDate,
      status,
      nextAction: nextAction || undefined,
      notes: notes || undefined
    });

    router.push(`/pacientes/${patientId}/resumo`);
  };

  return (
    <>
      <BackHeader title="Editar Dados Cadastrais" backUrl={`/pacientes/${patientId}/resumo`} />

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Nome */}
        <div className="form-group">
          <label className="form-label">NOME COMPLETO</label>
          <input 
            type="text" 
            className="form-control" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
          />
        </div>

        {/* Celular */}
        <div className="form-group">
          <label className="form-label">CELULAR / WHATSAPP</label>
          <input 
            type="text" 
            className="form-control" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required
          />
        </div>

        {/* E-mail */}
        <div className="form-group">
          <label className="form-label">E-MAIL</label>
          <input 
            type="email" 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        {/* Nascimento */}
        <div className="form-group">
          <label className="form-label">DATA DE NASCIMENTO</label>
          <input 
            type="date" 
            className="form-control" 
            value={birthDate} 
            onChange={(e) => setBirthDate(e.target.value)} 
          />
        </div>

        {/* Status */}
        <div className="form-group">
          <label className="form-label">STATUS CLÍNICO</label>
          <select 
            className="form-control" 
            value={status} 
            onChange={(e) => setStatus(e.target.value as "active" | "alert" | "inactive")}
          >
            <option value="active">Ativo (Em tratamento / Manutenção)</option>
            <option value="alert">Atenção (Necessita ação urgente)</option>
            <option value="inactive">Inativo (Sem contato ou arquivado)</option>
          </select>
        </div>

        {/* Próxima Ação */}
        <div className="form-group">
          <label className="form-label">PRÓXIMA AÇÃO CLÍNICO-OPERACIONAL</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Ex: Cobrar exame, remarcar cirurgia..."
            value={nextAction} 
            onChange={(e) => setNextAction(e.target.value)} 
          />
        </div>

        {/* Notas */}
        <div className="form-group">
          <label className="form-label">OBSERVAÇÕES ADICIONAIS</label>
          <textarea 
            rows={3} 
            className="form-control" 
            placeholder="Alergias, convênio ou preferências do paciente..."
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
          />
        </div>

        {/* Submit */}
        <div style={styles.actions}>
          <button type="submit" className="btn btn-primary">
            Salvar Alterações
          </button>
          <button 
            type="button" 
            onClick={() => router.push(`/pacientes/${patientId}/resumo`)}
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
  actions: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    marginTop: "10px",
  }
};
