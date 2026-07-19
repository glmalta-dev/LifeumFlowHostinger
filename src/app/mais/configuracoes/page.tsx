"use client";

import React, { useState } from "react";
import { BackHeader } from "@/components/layout/BackHeader";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/lib/supabaseClient";

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  active: boolean;
  email?: string;
  name?: string;
}

export default function ConfiguracoesPage() {
  const { templates, addTemplate, updateTemplate, deleteTemplate, showToast, clinicSettings, saveClinicSettings, activeClinicId } = useApp();
  
  const [activeTab, setActiveTab] = useState<"clinica" | "mensagens" | "equipe">("clinica");

  // --- Estado da Clínica & Operação ---
  const [administrativePhone, setAdministrativePhone] = useState(clinicSettings?.administrativePhone ?? "");
  const [inactivityDays, setInactivityDays] = useState(clinicSettings?.inactivityDays ?? 30);
  const [resources, setResources] = useState((clinicSettings?.resources ?? ["Cadeira 01", "Cadeira 02"]).join(", "));
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("18:00");
  const [savingClinic, setSavingClinic] = useState(false);

  // --- Estado de Modelos de WhatsApp ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);

  // --- Estado da Equipe ---
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("dentist");
  const [addingMember, setAddingMember] = useState(false);

  // Carregar Equipe quando a aba for ativada
  const loadTeam = async () => {
    if (!activeClinicId || !supabase) return;
    setLoadingTeam(true);
    try {
      const { data: members, error } = await supabase
        .from("clinic_members")
        .select("id, user_id, role, active")
        .eq("clinic_id", activeClinicId);

      if (error) throw error;

      // Buscar nomes dos membros da tabela profiles
      const formatted: TeamMember[] = [];
      for (const m of members || []) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, phone")
          .eq("id", m.user_id)
          .single();

        formatted.push({
          ...m,
          name: profile?.name || "Membro da Clínica",
          email: profile?.phone || m.user_id.substring(0, 8)
        });
      }
      setTeamMembers(formatted);
    } catch (err) {
      console.error("Erro ao carregar equipe:", err);
    } finally {
      setLoadingTeam(false);
    }
  };

  const handleTabChange = (tab: "clinica" | "mensagens" | "equipe") => {
    setActiveTab(tab);
    if (tab === "equipe" && teamMembers.length === 0) {
      void loadTeam();
    }
  };

  // Salvar Clínica e Operação
  const saveClinic = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingClinic(true);
    try {
      const businessHoursObj = {
        segunda_a_sexta: `${openTime} - ${closeTime}`,
        sabado: "08:00 - 12:00",
        domingo: "Fechado"
      };

      await saveClinicSettings({
        administrativePhone: administrativePhone.trim() || undefined,
        inactivityDays,
        resources: resources.split(",").map(item => item.trim()).filter(Boolean),
        businessHours: businessHoursObj,
        preferences: clinicSettings?.preferences ?? {},
        version: clinicSettings?.version
      });
      showToast("Configurações da clínica salvas com sucesso!", "success");
    } catch (error) {
      console.error(error);
      showToast("Não foi possível salvar as configurações.", "error");
    } finally {
      setSavingClinic(false);
    }
  };

  // Salvar Modelo de Mensagem
  const resetTemplateForm = () => {
    setEditingId(null);
    setTitle("");
    setBodyText("");
  };

  const handleSaveTemplate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !bodyText.trim()) return;
    setSavingTemplate(true);
    try {
      if (editingId) {
        await updateTemplate(editingId, { title: title.trim(), bodyText: bodyText.trim() });
        showToast("Modelo atualizado com sucesso!", "success");
      } else {
        await addTemplate({ title: title.trim(), bodyText: bodyText.trim(), isActive: true });
        showToast("Modelo criado com sucesso!", "success");
      }
      resetTemplateForm();
    } catch (err) {
      console.error(err);
      showToast("Erro ao salvar o modelo.", "error");
    } finally {
      setSavingTemplate(false);
    }
  };

  const insertVariable = (variable: string) => {
    setBodyText((prev) => prev + ` ${variable}`);
  };

  // Cadastrar Novo Membro na Equipe
  const handleAddTeamMember = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeClinicId || !supabase) return;
    if (!newMemberName.trim()) return;

    setAddingMember(true);
    try {
      // Simulação / Registro de convidado da clínica
      const mockUserId = `user-${Date.now()}`;
      
      // Inserir no profiles
      await supabase.from("profiles").insert({
        id: mockUserId,
        name: newMemberName.trim(),
        phone: newMemberEmail.trim()
      });

      // Inserir no clinic_members
      const { error } = await supabase.from("clinic_members").insert({
        clinic_id: activeClinicId,
        user_id: mockUserId,
        role: newMemberRole,
        active: true
      });

      if (error) throw error;

      showToast(`Membro ${newMemberName} cadastrado na equipe!`, "success");
      setNewMemberName("");
      setNewMemberEmail("");
      void loadTeam();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao cadastrar membro da equipe.";
      showToast(msg, "error");
    } finally {
      setAddingMember(false);
    }
  };

  return (
    <>
      <BackHeader title="Configurações do Sistema" backUrl="/mais" />

      {/* Navegação por Abas Organizadas */}
      <div style={styles.tabBar}>
        <button
          onClick={() => handleTabChange("clinica")}
          style={activeTab === "clinica" ? styles.tabActive : styles.tab}
        >
          🏥 Clínica
        </button>
        <button
          onClick={() => handleTabChange("mensagens")}
          style={activeTab === "mensagens" ? styles.tabActive : styles.tab}
        >
          💬 Mensagens
        </button>
        <button
          onClick={() => handleTabChange("equipe")}
          style={activeTab === "equipe" ? styles.tabActive : styles.tab}
        >
          👥 Equipe
        </button>
      </div>

      {/* ABA 1: CLÍNICA E OPERAÇÃO */}
      {activeTab === "clinica" && (
        <section className="card" style={styles.card}>
          <h2 style={styles.sectionTitle}>Dados e Parâmetros Operacionais</h2>

          <form onSubmit={saveClinic} style={styles.form}>
            <div className="form-group">
              <label htmlFor="clinic-phone" className="form-label">TELEFONE ADMINISTRATIVO / WHATSAPP</label>
              <input
                id="clinic-phone"
                className="form-control"
                placeholder="Ex: (11) 99999-8888"
                value={administrativePhone}
                onChange={(e) => setAdministrativePhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="inactive-days" className="form-label">DIAS PARA ALERTA DE INATIVIDADE DO PACIENTE</label>
              <input
                id="inactive-days"
                type="number"
                min={1}
                max={3650}
                className="form-control"
                value={inactivityDays}
                onChange={(e) => setInactivityDays(Number(e.target.value))}
                required
              />
              <small style={styles.helpText}>Pacientes sem consulta por mais de {inactivityDays} dias entram em status de alerta.</small>
            </div>

            <div className="form-group">
              <label htmlFor="resources" className="form-label">SALAS E CADEIRAS DE ATENDIMENTO</label>
              <input
                id="resources"
                className="form-control"
                placeholder="Ex: Cadeira 01, Cadeira 02, Sala de Cirurgia"
                value={resources}
                onChange={(e) => setResources(e.target.value)}
              />
              <small style={styles.helpText}>Separe os nomes dos recursos por vírgula.</small>
            </div>

            <div style={styles.rowTwo}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">HORÁRIO ABERTURA</label>
                <input
                  type="time"
                  className="form-control"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">HORÁRIO FECHAMENTO</label>
                <input
                  type="time"
                  className="form-control"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={savingClinic} style={styles.submitBtn}>
              {savingClinic ? "Salvando..." : "Salvar Parâmetros da Clínica"}
            </button>
          </form>
        </section>
      )}

      {/* ABA 2: MODELOS DE WHATSAPP */}
      {activeTab === "mensagens" && (
        <>
          <section className="card" style={styles.card}>
            <h2 style={styles.sectionTitle}>{editingId ? "Editar Modelo de Mensagem" : "Novo Modelo de Mensagem"}</h2>
            
            <form onSubmit={handleSaveTemplate} style={styles.form}>
              <div className="form-group">
                <label htmlFor="template-title" className="form-label">TÍTULO DO MODELO</label>
                <input
                  id="template-title"
                  className="form-control"
                  placeholder="Ex: Lembrete de Consulta 24h"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="template-body" className="form-label">TEXTO DA MENSAGEM</label>
                <textarea
                  id="template-body"
                  className="form-control"
                  rows={4}
                  placeholder="Digite a mensagem padrão..."
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  required
                />
              </div>

              <div style={styles.variablesSection}>
                <span style={styles.varLabel}>Variáveis dinâmicas para inserir:</span>
                <div style={styles.varPills}>
                  {["{primeiro_nome}", "{nome_completo}", "{data}", "{horario}", "{profissional}", "{clinica}"].map((v) => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => insertVariable(v)}
                      style={styles.pill}
                    >
                      + {v}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button type="submit" className="btn btn-primary" disabled={savingTemplate}>
                  {savingTemplate ? "Salvando..." : "Salvar Modelo"}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={resetTemplateForm}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </section>

          <section style={styles.templateList}>
            <h3 style={{ fontSize: "14px", fontWeight: 700 }}>Modelos Cadastrados ({templates.length})</h3>
            {templates.length === 0 && (
              <div className="card" style={{ textAlign: "center", padding: "20px" }}>
                <p>Nenhum modelo cadastrado ainda.</p>
              </div>
            )}
            {templates.map((t) => (
              <article key={t.id} className="card" style={{ opacity: t.isActive ? 1 : 0.65, display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{t.title}</strong>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: t.isActive ? "rgba(46, 204, 113, 0.15)" : "#f0f0f0", color: t.isActive ? "#27ae60" : "#7f8c8d", fontWeight: "bold" }}>
                    {t.isActive ? "ATIVO" : "INATIVO"}
                  </span>
                </div>
                <p style={{ fontSize: "12px", whiteSpace: "pre-wrap", color: "var(--text-secondary)" }}>{t.bodyText}</p>
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <button className="btn btn-secondary" style={styles.miniBtn} onClick={() => { setEditingId(t.id); setTitle(t.title); setBodyText(t.bodyText); }}>
                    Editar
                  </button>
                  <button className="btn btn-secondary" style={styles.miniBtn} onClick={() => void updateTemplate(t.id, { isActive: !t.isActive })}>
                    {t.isActive ? "Desativar" : "Ativar"}
                  </button>
                  <button className="btn btn-secondary" style={{ ...styles.miniBtn, color: "var(--error)" }} onClick={async () => {
                    if (!window.confirm(`Excluir modelo ${t.title}?`)) return;
                    try { await deleteTemplate(t.id); showToast("Modelo removido.", "success"); } catch { showToast("Erro ao remover.", "error"); }
                  }}>
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </section>
        </>
      )}

      {/* ABA 3: GESTÃO DE USUÁRIOS E EQUIPE */}
      {activeTab === "equipe" && (
        <>
          <section className="card" style={styles.card}>
            <h2 style={styles.sectionTitle}>Cadastrar Novo Membro da Equipe</h2>
            
            <form onSubmit={handleAddTeamMember} style={styles.form}>
              <div className="form-group">
                <label className="form-label">NOME COMPLETO</label>
                <input
                  className="form-control"
                  placeholder="Ex: Dra. Patricia Souza"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-MAIL OU TELEFONE DE CONTATO</label>
                <input
                  className="form-control"
                  placeholder="Ex: patricia@clinica.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">PAPEL / FUNÇÃO NA CLÍNICA</label>
                <select
                  className="form-control"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                >
                  <option value="dentist">Cirurgião-Dentista</option>
                  <option value="admin">Administrador da Clínica</option>
                  <option value="receptionist">Recepcionista / Atendimento</option>
                  <option value="assistant">Auxiliar de Saúde Bucal (ASB)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" disabled={addingMember}>
                {addingMember ? "Cadastrando..." : "Cadastrar Membro na Clínica"}
              </button>
            </form>
          </section>

          <section style={styles.templateList}>
            <h3 style={{ fontSize: "14px", fontWeight: 700 }}>Profissionais e Usuários da Clínica ({teamMembers.length})</h3>
            {loadingTeam ? (
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Carregando equipe...</p>
            ) : teamMembers.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: "20px" }}>
                <p>Nenhum outro membro cadastrado nesta clínica.</p>
              </div>
            ) : (
              teamMembers.map((m) => {
                const roleMap: Record<string, string> = {
                  admin: "Administrador",
                  dentist: "Cirurgião-Dentista",
                  receptionist: "Recepcionista",
                  assistant: "Auxiliar (ASB)"
                };
                return (
                  <article key={m.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong>{m.name}</strong>
                      <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        Função: {roleMap[m.role] || m.role} • {m.email}
                      </p>
                    </div>
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: m.active ? "rgba(46, 204, 113, 0.15)" : "#f0f0f0", color: m.active ? "#27ae60" : "#7f8c8d", fontWeight: "bold" }}>
                      {m.active ? "ATIVO" : "INATIVO"}
                    </span>
                  </article>
                );
              })
            )}
          </section>
        </>
      )}
    </>
  );
}

const styles = {
  tabBar: {
    display: "flex",
    borderBottom: "1px solid var(--border-light)",
    marginBottom: "14px",
    width: "100%",
  },
  tab: {
    flex: 1,
    padding: "10px 4px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    cursor: "pointer",
    textAlign: "center" as const,
  },
  tabActive: {
    flex: 1,
    padding: "10px 4px",
    background: "none",
    border: "none",
    borderBottom: "2px solid var(--primary)",
    fontSize: "12px",
    fontWeight: 700,
    color: "var(--primary)",
    cursor: "pointer",
    textAlign: "center" as const,
  },
  card: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
    padding: "16px",
  },
  sectionTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  helpText: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    marginTop: "2px",
  },
  rowTwo: {
    display: "flex",
    gap: "10px",
  },
  submitBtn: {
    marginTop: "6px",
    width: "100%",
  },
  variablesSection: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  varLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--text-secondary)",
  },
  varPills: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "6px",
  },
  pill: {
    padding: "4px 8px",
    borderRadius: "12px",
    backgroundColor: "rgba(20, 99, 230, 0.08)",
    color: "var(--primary)",
    fontSize: "11px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  },
  templateList: {
    marginTop: "14px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  miniBtn: {
    padding: "6px 10px",
    fontSize: "11px",
    borderRadius: "6px",
    flex: 1,
  }
};
