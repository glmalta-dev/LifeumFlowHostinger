"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BackHeader } from "@/components/layout/BackHeader";

export default function NovoPacientePage() {
  const router = useRouter();
  const { addPatient } = useApp();

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [notes, setNotes] = useState("");
  const [nextAction, setNextAction] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Por favor, preencha nome e celular.");
      return;
    }

    const newId = addPatient({
      name,
      phone,
      email,
      birthDate,
      status: "active",
      nextAction: nextAction || undefined,
      notes: notes || undefined
    });

    router.push(`/pacientes/${newId}/resumo`);
  };

  return (
    <>
      <BackHeader title="Cadastrar Paciente" backUrl="/pacientes" />

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Nome */}
        <div className="form-group">
          <label className="form-label">NOME COMPLETO</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Digite o nome completo do paciente..."
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
            placeholder="(11) 98765-4321"
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
            placeholder="exemplo@email.com"
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

        {/* Próxima Ação */}
        <div className="form-group">
          <label className="form-label">PRIMEIRA AÇÃO OPERACIONAL</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Ex: Agendar primeira consulta de avaliação..."
            value={nextAction} 
            onChange={(e) => setNextAction(e.target.value)} 
          />
        </div>

        {/* Notas */}
        <div className="form-group">
          <label className="form-label">NOTAS INICIAIS</label>
          <textarea 
            rows={3} 
            className="form-control" 
            placeholder="Informações adicionais..."
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
          />
        </div>

        {/* Submit */}
        <div style={styles.actions}>
          <button type="submit" className="btn btn-primary">
            Cadastrar e Abrir Ficha
          </button>
          <button 
            type="button" 
            onClick={() => router.push("/pacientes")}
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
