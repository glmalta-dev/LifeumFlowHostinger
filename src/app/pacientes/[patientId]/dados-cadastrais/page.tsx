"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BackHeader } from "@/components/layout/BackHeader";
import type { Patient } from "@/types";
import { normalizeBrazilianPhone } from "@/lib/phone";
import { isValidBirthDate, isValidCpf, normalizeCpf } from "@/lib/validation";

export default function DadosCadastraisPage() {
  const params = useParams();
  const router = useRouter();
  const { patients, updatePatient, showToast } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const patientId = params.patientId as string;
  const patient = patients.find((p) => p.id === patientId);

  // Form states
  const [name, setName] = useState(patient?.name ?? "");
  const [phone, setPhone] = useState(patient?.phone ?? "");
  const [email, setEmail] = useState(patient?.email ?? "");
  const [birthDate, setBirthDate] = useState(patient?.birthDate ?? "");
  const [sex, setSex] = useState<"female" | "male" | "intersex" | "not_informed">(patient?.sex ?? "not_informed");
  const [status, setStatus] = useState<"active" | "alert" | "inactive">(patient?.status ?? "active");
  const [nextAction, setNextAction] = useState(patient?.nextAction ?? "");
  const [notes, setNotes] = useState(patient?.notes ?? "");
  
  // Novos campos requeridos para edição de dados cadastrais
  const [cpf, setCpf] = useState(patient?.cpf ?? "");
  const [address, setAddress] = useState(patient?.address ?? "");
  const [addressNumber, setAddressNumber] = useState(patient?.addressNumber ?? "");
  const [addressComplement, setAddressComplement] = useState(patient?.addressComplement ?? "");
  const [neighborhood, setNeighborhood] = useState(patient?.neighborhood ?? "");
  const [city, setCity] = useState(patient?.city ?? "");
  const [state, setState] = useState(patient?.state ?? "");
  const [postalCode, setPostalCode] = useState(patient?.postalCode ?? "");

  useEffect(() => {
    if (!patient) return;
    // O cadastro e carregado assincronamente pelo contexto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(patient.name); setPhone(patient.phone); setEmail(patient.email);
    setBirthDate(patient.birthDate); setSex(patient.sex ?? "not_informed"); setStatus(patient.status);
    setNextAction(patient.nextAction ?? ""); setNotes(patient.notes ?? ""); setCpf(patient.cpf ?? "");
    setAddress(patient.address ?? ""); setAddressNumber(patient.addressNumber ?? "");
    setAddressComplement(patient.addressComplement ?? ""); setNeighborhood(patient.neighborhood ?? "");
    setCity(patient.city ?? ""); setState(patient.state ?? ""); setPostalCode(patient.postalCode ?? "");
  }, [patient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !isValidBirthDate(birthDate)) {
      showToast("Informe nome, telefone e uma data de nascimento valida.", "error");
      return;
    }
    const normalizedPhone = normalizeBrazilianPhone(phone);
    if (!normalizedPhone.valid) { showToast(normalizedPhone.reason, "error"); return; }
    if (cpf && !isValidCpf(cpf)) { showToast("CPF invalido.", "error"); return; }

    setIsSubmitting(true);
    try {
      await updatePatient(patientId, {
        name,
        phone,
        email,
        birthDate,
        sex,
        status,
        cpf: normalizeCpf(cpf) || undefined,
        nextAction: nextAction || undefined,
        notes: notes || undefined,
        address: address || undefined,
        addressNumber: addressNumber || undefined,
        addressComplement: addressComplement || undefined,
        neighborhood: neighborhood || undefined,
        city: city || undefined,
        state: state || undefined,
        postalCode: postalCode || undefined
      });

      router.push(`/pacientes/${patientId}/resumo`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BackHeader title="Editar Dados Cadastrais" backUrl={`/pacientes/${patientId}/resumo`} />

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Nome */}
        <div className="form-group">
          <label htmlFor="patient-name" className="form-label">NOME COMPLETO *</label>
          <input 
            id="patient-name"
            name="name"
            type="text" 
            className="form-control" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
          />
        </div>

        {/* Celular e CPF */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="patient-phone" className="form-label">CELULAR / WHATSAPP *</label>
            <input 
              id="patient-phone"
              name="phone"
              type="text" 
              className="form-control" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="patient-cpf" className="form-label">CPF</label>
            <input 
              id="patient-cpf"
              name="cpf"
              type="text" 
              className="form-control" 
              placeholder="Ex: 000.000.000-00"
              value={cpf} 
              onChange={(e) => setCpf(e.target.value)} 
            />
          </div>
        </div>

        {/* E-mail */}
        <div className="form-group">
          <label htmlFor="patient-email" className="form-label">E-MAIL</label>
          <input 
            id="patient-email"
            name="email"
            type="email" 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        {/* Nascimento e Sexo */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="patient-birth" className="form-label">NASCIMENTO</label>
            <input 
              id="patient-birth"
              name="birthDate"
              type="date" 
              className="form-control" 
              value={birthDate} 
              onChange={(e) => setBirthDate(e.target.value)} 
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="patient-sex" className="form-label">SEXO / GÊNERO</label>
            <select
              id="patient-sex"
              name="sex"
              className="form-control"
              value={sex}
              onChange={(e) => setSex(e.target.value as NonNullable<Patient["sex"]>)}
            >
              <option value="not_informed">Não Informado</option>
              <option value="female">Feminino</option>
              <option value="male">Masculino</option>
              <option value="intersex">Intersexo</option>
            </select>
          </div>
        </div>

        {/* Endereço - Logradouro e CEP */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="form-group" style={{ flex: 2 }}>
            <label htmlFor="patient-addr" className="form-label">ENDEREÇO (RUA/AVENIDA)</label>
            <input 
              id="patient-addr"
              name="address"
              type="text" 
              className="form-control" 
              placeholder="Ex: Rua das Flores"
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="patient-cep" className="form-label">CEP</label>
            <input 
              id="patient-cep"
              name="postalCode"
              type="text" 
              className="form-control" 
              placeholder="00000-000"
              value={postalCode} 
              onChange={(e) => setPostalCode(e.target.value)} 
            />
          </div>
        </div>

        {/* Número, Complemento e Bairro */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="patient-num" className="form-label">NÚMERO</label>
            <input 
              id="patient-num"
              name="addressNumber"
              type="text" 
              className="form-control" 
              placeholder="Ex: 123"
              value={addressNumber} 
              onChange={(e) => setAddressNumber(e.target.value)} 
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="patient-comp" className="form-label">COMPLEMENTO</label>
            <input 
              id="patient-comp"
              name="addressComplement"
              type="text" 
              className="form-control" 
              placeholder="Ex: Apto 4"
              value={addressComplement} 
              onChange={(e) => setAddressComplement(e.target.value)} 
            />
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label htmlFor="patient-neigh" className="form-label">BAIRRO</label>
            <input 
              id="patient-neigh"
              name="neighborhood"
              type="text" 
              className="form-control" 
              placeholder="Ex: Centro"
              value={neighborhood} 
              onChange={(e) => setNeighborhood(e.target.value)} 
            />
          </div>
        </div>

        {/* Cidade e Estado */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="form-group" style={{ flex: 2 }}>
            <label htmlFor="patient-city" className="form-label">CIDADE</label>
            <input 
              id="patient-city"
              name="city"
              type="text" 
              className="form-control" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="patient-state" className="form-label">ESTADO</label>
            <input 
              id="patient-state"
              name="state"
              type="text" 
              className="form-control" 
              placeholder="Ex: SP"
              maxLength={2}
              value={state} 
              onChange={(e) => setState(e.target.value.toUpperCase())} 
            />
          </div>
        </div>

        {/* Status */}
        <div className="form-group">
          <label htmlFor="patient-status" className="form-label">STATUS CLÍNICO</label>
          <select 
            id="patient-status"
            name="status"
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
          <label htmlFor="patient-action" className="form-label">PRÓXIMA AÇÃO CLÍNICO-OPERACIONAL</label>
          <input 
            id="patient-action"
            name="nextAction"
            type="text" 
            className="form-control" 
            placeholder="Ex: Definir próxima consulta..."
            value={nextAction} 
            onChange={(e) => setNextAction(e.target.value)} 
          />
        </div>

        {/* Notas */}
        <div className="form-group">
          <label htmlFor="patient-notes" className="form-label">NOTAS INICIAIS</label>
          <textarea 
            id="patient-notes"
            name="notes"
            rows={3} 
            className="form-control" 
            placeholder="Observações do paciente..."
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
          />
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Alteracoes"}
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
