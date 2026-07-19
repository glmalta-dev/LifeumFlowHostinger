"use client";

import React, { useEffect, useState } from "react";
import { BackHeader } from "@/components/layout/BackHeader";
import { useApp } from "@/context/AppContext";

export default function ConfiguracoesPage() {
  const { templates, addTemplate, updateTemplate, deleteTemplate, showToast, clinicSettings, saveClinicSettings } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingClinic, setSavingClinic] = useState(false);
  const [administrativePhone, setAdministrativePhone] = useState("");
  const [inactivityDays, setInactivityDays] = useState(30);
  const [resources, setResources] = useState("");
  const [businessHours, setBusinessHours] = useState("{}");

  useEffect(() => {
    if (!clinicSettings) return;
    // O formulario precisa ser hidratado quando a configuracao remota chega.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdministrativePhone(clinicSettings.administrativePhone ?? "");
    setInactivityDays(clinicSettings.inactivityDays);
    setResources(clinicSettings.resources.join(", "));
    setBusinessHours(JSON.stringify(clinicSettings.businessHours, null, 2));
  }, [clinicSettings]);

  const saveClinic = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingClinic(true);
    try {
      const parsedHours = JSON.parse(businessHours || "{}");
      await saveClinicSettings({
        administrativePhone: administrativePhone.trim() || undefined,
        inactivityDays, resources: resources.split(",").map(item => item.trim()).filter(Boolean),
        businessHours: parsedHours, preferences: clinicSettings?.preferences ?? {},
        version: clinicSettings?.version
      });
    } catch (error) {
      showToast(error instanceof SyntaxError ? "Horario de funcionamento deve ser um JSON valido." : "Nao foi possivel salvar as configuracoes.", "error");
    } finally { setSavingClinic(false); }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setBodyText("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !bodyText.trim()) return;
    setSaving(true);
    try {
      if (editingId) await updateTemplate(editingId, { title: title.trim(), bodyText: bodyText.trim() });
      else await addTemplate({ title: title.trim(), bodyText: bodyText.trim(), isActive: true });
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <BackHeader title="Configuracoes" backUrl="/mais" />
      <section className="card">
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Clinica e operacao</h2>
        <form onSubmit={saveClinic} style={{ display: "grid", gap: 12 }}>
          <div className="form-group"><label htmlFor="clinic-phone" className="form-label">TELEFONE ADMINISTRATIVO</label><input id="clinic-phone" className="form-control" value={administrativePhone} onChange={event => setAdministrativePhone(event.target.value)} /></div>
          <div className="form-group"><label htmlFor="inactive-days" className="form-label">DIAS PARA ALERTA DE INATIVIDADE</label><input id="inactive-days" type="number" min={1} max={3650} className="form-control" value={inactivityDays} onChange={event => setInactivityDays(Number(event.target.value))} required /></div>
          <div className="form-group"><label htmlFor="resources" className="form-label">SALAS E CADEIRAS (SEPARADAS POR VIRGULA)</label><input id="resources" className="form-control" value={resources} onChange={event => setResources(event.target.value)} /></div>
          <div className="form-group"><label htmlFor="business-hours" className="form-label">HORARIOS DE FUNCIONAMENTO (JSON)</label><textarea id="business-hours" className="form-control" rows={5} value={businessHours} onChange={event => setBusinessHours(event.target.value)} /></div>
          <button className="btn btn-primary" disabled={savingClinic}>{savingClinic ? "Salvando..." : "Salvar configuracoes"}</button>
        </form>
      </section>

      <section className="card">
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Modelos de WhatsApp</h2>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>{editingId ? "Editar modelo" : "Novo modelo"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div className="form-group">
            <label htmlFor="template-title" className="form-label">TITULO</label>
            <input id="template-title" className="form-control" value={title} onChange={(event) => setTitle(event.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="template-body" className="form-label">MENSAGEM</label>
            <textarea id="template-body" className="form-control" rows={5} value={bodyText} onChange={(event) => setBodyText(event.target.value)} required />
            <small>Variaveis: {'{primeiro_nome}'}, {'{nome_completo}'}, {'{data}'}, {'{horario}'}, {'{profissional}'}, {'{clinica}'}, {'{localizacao}'}</small>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" disabled={saving}>{saving ? "Salvando..." : "Salvar modelo"}</button>
            {editingId && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>}
          </div>
        </form>
      </section>

      <section style={{ display: "grid", gap: 10 }}>
        {templates.length === 0 && <div className="card"><p>Nenhum modelo cadastrado.</p></div>}
        {templates.map((template) => (
          <article className="card" key={template.id} style={{ opacity: template.isActive ? 1 : 0.65 }}>
            <strong>{template.title}</strong>
            <p style={{ whiteSpace: "pre-wrap", margin: "8px 0" }}>{template.bodyText}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-secondary" onClick={() => { setEditingId(template.id); setTitle(template.title); setBodyText(template.bodyText); }}>Editar</button>
              <button className="btn btn-secondary" onClick={() => updateTemplate(template.id, { isActive: !template.isActive })}>{template.isActive ? "Desativar" : "Ativar"}</button>
              <button className="btn btn-secondary" onClick={async () => {
                if (!window.confirm(`Excluir o modelo ${template.title}?`)) return;
                try { await deleteTemplate(template.id); } catch { showToast("Nao foi possivel excluir o modelo.", "error"); }
              }}>Excluir</button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
