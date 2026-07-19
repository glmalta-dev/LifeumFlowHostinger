"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BackHeader } from "@/components/layout/BackHeader";
import type { Patient } from "@/types";
import { normalizeBrazilianPhone } from "@/lib/phone";
import { isValidBirthDate, isValidCpf, normalizeCpf } from "@/lib/validation";

export default function NovoPacientePage() {
  const router = useRouter();
  const { addPatient, patients, showToast } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [duplicateAcknowledged, setDuplicateAcknowledged] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState<"female" | "male" | "intersex" | "not_informed">("not_informed");
  const [notes, setNotes] = useState("");
  const [nextAction, setNextAction] = useState("");
  
  // Novos campos requeridos para consistência cadastral
  const [cpf, setCpf] = useState("");
  const [address, setAddress] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [addressComplement, setAddressComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !isValidBirthDate(birthDate)) {
      showToast("Informe nome, telefone e uma data de nascimento valida.", "error");
      return;
    }
    const normalizedPhone = normalizeBrazilianPhone(phone);
    if (!normalizedPhone.valid) {
      showToast(normalizedPhone.reason, "error");
      return;
    }
    if (cpf && !isValidCpf(cpf)) {
      showToast("CPF invalido.", "error");
      return;
    }
    const cpfDigits = normalizeCpf(cpf);
    const duplicate = patients.find((patient) => {
      const existingPhone = normalizeBrazilianPhone(patient.phone);
      return Boolean(cpfDigits && normalizeCpf(patient.cpf) === cpfDigits)
        || (existingPhone.valid && existingPhone.national === normalizedPhone.national);
    });
    if (duplicate && !duplicateAcknowledged) {
      setDuplicateWarning(`Possivel duplicidade com ${duplicate.name}. Revise os dados ou confirme o cadastro.`);
      setDuplicateAcknowledged(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const newId = await addPatient({
        name,
        phone,
        email,
        birthDate,
        sex,
        status: "active",
        cpf: cpfDigits || undefined,
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

      router.push(`/pacientes/${newId}/resumo`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BackHeader title="Cadastrar Paciente" backUrl="/pacientes" />

      <form onSubmit={handleSubmit} style={styles.form}>
        {duplicateWarning && <div role="alert" style={{ padding: "10px", borderRadius: "8px", background: "#fff4d6", color: "#7a4b00", fontSize: "12px" }}>{duplicateWarning}</div>}
        {/* Nome */}
        <div className="form-group">
          <label htmlFor="new-patient-name" className="form-label">NOME COMPLETO *</label>
          <input 
            id="new-patient-name"
            name="name"
            type="text" 
            className="form-control" 
            placeholder="Ex: Carlos Eduardo Silva"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
          />
        </div>

        {/* Celular e CPF */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="new-patient-phone" className="form-label">CELULAR / WHATSAPP *</label>
            <input 
              id="new-patient-phone"
              name="phone"
              type="text" 
              className="form-control" 
              placeholder="(11) 98765-4321"
              value={phone} 
              onChange={(e) => { setPhone(e.target.value); setDuplicateAcknowledged(false); setDuplicateWarning(null); }}
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="new-patient-cpf" className="form-label">CPF</label>
            <input 
              id="new-patient-cpf"
              name="cpf"
              type="text" 
              className="form-control" 
              placeholder="000.000.000-00"
              value={cpf} 
              onChange={(e) => { setCpf(e.target.value); setDuplicateAcknowledged(false); setDuplicateWarning(null); }}
            />
          </div>
        </div>

        {/* E-mail */}
        <div className="form-group">
          <label htmlFor="new-patient-email" className="form-label">E-MAIL</label>
          <input 
            id="new-patient-email"
            name="email"
            type="email" 
            className="form-control" 
            placeholder="exemplo@email.com"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        {/* Nascimento e Sexo */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="new-patient-birth" className="form-label">DATA DE NASCIMENTO</label>
            <input 
              id="new-patient-birth"
              name="birthDate"
              type="date" 
              className="form-control" 
              value={birthDate} 
              onChange={(e) => setBirthDate(e.target.value)} 
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="new-patient-sex" className="form-label">SEXO / GÊNERO</label>
            <select
              id="new-patient-sex"
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
            <label htmlFor="new-patient-addr" className="form-label">ENDEREÇO (RUA/AVENIDA)</label>
            <input 
              id="new-patient-addr"
              name="address"
              type="text" 
              className="form-control" 
              placeholder="Ex: Avenida Paulista"
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="new-patient-cep" className="form-label">CEP</label>
            <input 
              id="new-patient-cep"
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
            <label htmlFor="new-patient-num" className="form-label">NÚMERO</label>
            <input 
              id="new-patient-num"
              name="addressNumber"
              type="text" 
              className="form-control" 
              placeholder="Ex: 500"
              value={addressNumber} 
              onChange={(e) => setAddressNumber(e.target.value)} 
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="new-patient-comp" className="form-label">COMPLEMENTO</label>
            <input 
              id="new-patient-comp"
              name="addressComplement"
              type="text" 
              className="form-control" 
              placeholder="Ex: Sala 12"
              value={addressComplement} 
              onChange={(e) => setAddressComplement(e.target.value)} 
            />
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label htmlFor="new-patient-neigh" className="form-label">BAIRRO</label>
            <input 
              id="new-patient-neigh"
              name="neighborhood"
              type="text" 
              className="form-control" 
              placeholder="Ex: Cerqueira César"
              value={neighborhood} 
              onChange={(e) => setNeighborhood(e.target.value)} 
            />
          </div>
        </div>

        {/* Cidade e Estado */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="form-group" style={{ flex: 2 }}>
            <label htmlFor="new-patient-city" className="form-label">CIDADE</label>
            <input 
              id="new-patient-city"
              name="city"
              type="text" 
              className="form-control" 
              placeholder="Ex: São Paulo"
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="new-patient-state" className="form-label">ESTADO</label>
            <input 
              id="new-patient-state"
              name="state"
              type="text" 
              className="form-control" 
              placeholder="SP"
              maxLength={2}
              value={state} 
              onChange={(e) => setState(e.target.value.toUpperCase())} 
            />
          </div>
        </div>

        {/* Próxima Ação */}
        <div className="form-group">
          <label htmlFor="new-patient-action" className="form-label">PRIMEIRA AÇÃO OPERACIONAL</label>
          <input 
            id="new-patient-action"
            name="nextAction"
            type="text" 
            className="form-control" 
            placeholder="Ex: Agendar primeira consulta de avaliação..."
            value={nextAction} 
            onChange={(e) => setNextAction(e.target.value)} 
          />
        </div>

        {/* Notas */}
        <div className="form-group">
          <label htmlFor="new-patient-notes" className="form-label">NOTAS INICIAIS</label>
          <textarea 
            id="new-patient-notes"
            name="notes"
            rows={3} 
            className="form-control" 
            placeholder="Informações clínicas adicionais..."
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
          />
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : duplicateAcknowledged ? "Confirmar cadastro" : "Cadastrar e Abrir Ficha"}
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
