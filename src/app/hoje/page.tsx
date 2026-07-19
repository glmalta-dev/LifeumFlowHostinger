"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { QuickPanel } from "@/components/ui/QuickPanel";
import { buildWhatsAppUrl } from "@/lib/phone";

export default function HojePage() {
  const router = useRouter();
  const { appointments, tasks, completeTask, showToast, patients } = useApp();
  
  // States and filters
  const [activeFilter, setActiveFilter] = useState<string>("atrasados");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");

  // Calculate today string in local timezone (YYYY-MM-DD)
  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayStr();

  // Calculate metrics dynamically
  const pendingTasks = tasks.filter(t => t.status !== "completed" && t.status !== "cancelled");
  const overdueTasks = pendingTasks.filter(t => t.dueDate < todayStr);
  const todayTasks = pendingTasks.filter(t => t.dueDate === todayStr);
  const scheduleTasks = pendingTasks.filter(t => `${t.category || ""} ${t.title}`.toLowerCase().includes("agend"));
  const rescheduleTasks = pendingTasks.filter(t => `${t.category || ""} ${t.title}`.toLowerCase().match(/reagend|remarc/));
  const visibleTasks = activeFilter === "hoje" ? todayTasks
    : activeFilter === "agendar" ? scheduleTasks
    : activeFilter === "remarcar" ? rescheduleTasks
    : overdueTasks;

  const totalActionsNeeded = overdueTasks.length;
  const totalTasksCount = pendingTasks.length;

  const handleWhatsAppSimulate = (patientId: string, name: string, description: string) => {
    const patientObj = patients.find(p => p.id === patientId);
    const url = buildWhatsAppUrl(patientObj?.phone, `Ola ${name}, tudo bem? Gostaria de falar sobre a pendencia clinica: "${description}".`);
    if (!url) return showToast("Telefone do paciente invalido ou sem DDD.", "error");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleScheduleSimulate = (patientId: string) => {
    router.push(`/pacientes/${patientId}/agendamentos/editar`);
  };

  // Se não estiver montado no cliente, renderiza um esqueleto neutro para evitar erro de hidratação (React #418)
  return (
    <>
      <AppHeader title="Hoje" />

      {/* 1. Card de Atenção */}
      <section style={styles.attentionCard}>
        <div style={styles.attentionIconWrap}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--error)" }}>
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div style={styles.attentionTextWrap}>
          <div style={styles.attentionSubtitle}>Atenção necessária</div>
          <div style={styles.attentionTitle}>{totalActionsNeeded} ações atrasadas</div>
          <div style={styles.attentionCount}>{totalTasksCount} pendências no total</div>
        </div>
        <Link href="/hoje/pendencias" className="btn btn-primary" style={styles.attentionBtn}>
          Resolver agora
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </section>

      {/* 2. Categorias Rápidas */}
      <section style={styles.categoriesSection}>
        <div style={styles.categoryScroller} className="hide-scrollbar">
          {/* Atrasados */}
          <div 
            style={activeFilter === "atrasados" ? styles.categoryActiveItem : styles.categoryItem}
            onClick={() => setActiveFilter("atrasados")}
          >
            <div style={{ ...styles.categoryIconWrap, backgroundColor: "var(--error-bg)", color: "var(--error)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <span style={styles.categoryLabel}>Atrasados</span>
            <span style={{ ...styles.categoryBadge, backgroundColor: "var(--error)" }}>{overdueTasks.length}</span>
          </div>

          {/* Hoje */}
          <div 
            style={activeFilter === "hoje" ? styles.categoryActiveItem : styles.categoryItem}
            onClick={() => setActiveFilter("hoje")}
          >
            <div style={{ ...styles.categoryIconWrap, backgroundColor: "rgba(20, 99, 230, 0.08)", color: "var(--primary)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <span style={styles.categoryLabel}>Hoje</span>
            <span style={{ ...styles.categoryBadge, backgroundColor: "var(--primary)" }}>{todayTasks.length}</span>
          </div>

          {/* Agendar */}
          <div 
            style={activeFilter === "agendar" ? styles.categoryActiveItem : styles.categoryItem}
            onClick={() => setActiveFilter("agendar")}
          >
            <div style={{ ...styles.categoryIconWrap, backgroundColor: "rgba(0, 168, 204, 0.08)", color: "#00a8cc" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <line x1="12" y1="14" x2="12" y2="18"></line>
                <line x1="10" y1="16" x2="14" y2="16"></line>
              </svg>
            </div>
            <span style={styles.categoryLabel}>Agendar</span>
            <span style={{ ...styles.categoryBadge, backgroundColor: "#00a8cc" }}>{scheduleTasks.length}</span>
          </div>

          {/* Remarcar */}
          <div 
            style={activeFilter === "remarcar" ? styles.categoryActiveItem : styles.categoryItem}
            onClick={() => setActiveFilter("remarcar")}
          >
            <div style={{ ...styles.categoryIconWrap, backgroundColor: "var(--warning-bg)", color: "var(--warning)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
              </svg>
            </div>
            <span style={styles.categoryLabel}>Remarcar</span>
            <span style={{ ...styles.categoryBadge, backgroundColor: "var(--warning)" }}>{rescheduleTasks.length}</span>
          </div>
        </div>
      </section>

      {/* 3. Prioridades de Agora */}
      <section style={styles.prioritiesSection}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Prioridades de agora</h3>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button type="button" className="btn btn-secondary" aria-pressed={viewMode === "cards"} onClick={() => setViewMode("cards")} style={{ padding: "5px 8px", opacity: viewMode === "cards" ? 1 : .6 }}>Cards</button>
          <button type="button" className="btn btn-secondary" aria-pressed={viewMode === "list"} onClick={() => setViewMode("list")} style={{ padding: "5px 8px", opacity: viewMode === "list" ? 1 : .6 }}>Lista</button>
          <Link href="/hoje/pendencias" style={styles.sectionLink}>
            Ver todas
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
          </div>
        </div>

        <div style={{ ...styles.priorityList, ...(viewMode === "cards" ? { gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" } : { gridTemplateColumns: "1fr" }) }}>
          {visibleTasks.length === 0 && <div className="card"><p>Nenhuma pendencia neste filtro.</p></div>}
          {visibleTasks.slice(0, viewMode === "cards" ? 6 : 10).map((task) => {
            const isHigh = task.priority === "high";
            // Formatar data técnica 2026-07-16 -> 16/07/2026
            const formatDate = (dateStr: string) => {
              if (!dateStr) return "";
              const parts = dateStr.split("-");
              if (parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
              }
              return dateStr;
            };

            return (
              <div 
                key={task.id} 
                style={{ ...styles.priorityCard, cursor: "pointer", ...(viewMode === "list" ? { borderRadius: 8 } : {}) }}
                onClick={() => {
                  setSelectedPatientId(task.patientId);
                  setSelectedTaskId(task.id);
                  setIsPanelOpen(true);
                }}
              >
                <div style={{ ...styles.leftIndicator, backgroundColor: isHigh ? "var(--error)" : "var(--warning)" }} />
                
                <div style={styles.cardMain}>
                  <div style={styles.cardHeaderRow}>
                    <span style={{ ...styles.priorityTag, color: isHigh ? "var(--error)" : "var(--warning)" }}>
                      {isHigh ? "ALTA" : "MÉDIA"}
                    </span>
                    <span style={{ ...styles.dueLabel, color: isHigh ? "var(--error)" : "var(--text-secondary)" }}>
                      Prazo: {formatDate(task.dueDate)}
                    </span>
                  </div>

                  <h4 style={styles.patientName}>{task.patientName}</h4>
                  <p style={styles.taskDesc}>{task.description}</p>
                  
                  <div style={styles.cardActions}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsAppSimulate(task.patientId, task.patientName, task.description);
                      }} 
                      style={styles.actionBtnGreen}
                      title="Enviar mensagem"
                      aria-label={`Enviar mensagem para ${task.patientName}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScheduleSimulate(task.patientId);
                      }} 
                      style={styles.actionBtnBlue}
                      title="Agendar Consulta"
                      aria-label={`Agendar consulta para ${task.patientName}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </button>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        completeTask(task.id);
                      }} 
                      style={styles.actionBtnGray}
                      title="Concluir pendência"
                      aria-label={`Concluir pendência de ${task.patientName}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Próximos compromissos */}
      <section style={styles.prioritiesSection}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Próximos compromissos</h3>
          <Link href="/agenda" style={styles.sectionLink}>
            Ver agenda
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        </div>

        <div style={styles.appointmentsCard}>
          {appointments.filter(a => a.date >= todayStr && a.status !== "cancelado").slice(0, 2).map((app) => (
            <div key={app.id} style={styles.appointmentRow}>
              <div style={styles.appointmentTimeCol}>
                <span style={styles.appTime}>{app.time}</span>
                <span style={styles.appTypeBadge}>{app.type.toUpperCase()}</span>
              </div>
              <div style={styles.appointmentPatientCol}>
                <div style={styles.appPatientName}>{app.patientName}</div>
                <div style={styles.appDoctor}>{app.professional}</div>
              </div>
              <button 
                onClick={() => router.push(`/pacientes/${app.patientId}/resumo`)}
                style={styles.appDetailBtn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      <QuickPanel 
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        patientId={selectedPatientId}
        taskId={selectedTaskId}
      />
    </>
  );
}

const styles = {
  attentionCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "20px",
    padding: "16px",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "var(--shadow-sm)",
    gap: "12px",
    width: "100%",
  },
  attentionIconWrap: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    backgroundColor: "var(--error-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  attentionTextWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
  },
  attentionSubtitle: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--text-secondary)",
  },
  attentionTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--error)",
    marginTop: "2px",
  },
  attentionCount: {
    fontSize: "10px",
    color: "var(--text-secondary)",
    marginTop: "1px",
  },
  attentionBtn: {
    width: "auto",
    padding: "8px 12px",
    fontSize: "12px",
    borderRadius: "10px",
    flexShrink: 0,
  },
  categoriesSection: {
    width: "100%",
  },
  categoryScroller: {
    display: "flex",
    gap: "10px",
    overflowX: "auto" as const,
    paddingBottom: "4px",
  },
  categoryItem: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    minWidth: "72px",
    padding: "8px",
    borderRadius: "14px",
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    cursor: "pointer",
    position: "relative" as const,
    transition: "var(--transition-fast)",
  },
  categoryActiveItem: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    minWidth: "72px",
    padding: "8px",
    borderRadius: "14px",
    backgroundColor: "#ffffff",
    border: "2px solid var(--primary)",
    cursor: "pointer",
    position: "relative" as const,
  },
  categoryIconWrap: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "6px",
  },
  categoryLabel: {
    fontSize: "10px",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: "4px",
  },
  categoryBadge: {
    padding: "1px 5px",
    borderRadius: "8px",
    fontSize: "9px",
    fontWeight: "bold",
    color: "#ffffff",
  },
  prioritiesSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 4px",
  },
  sectionTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  sectionLink: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--primary)",
    display: "flex",
    alignItems: "center",
    gap: "2px",
    textDecoration: "none",
  },
  priorityList: {
    display: "grid",
    gap: "10px",
  },
  priorityCard: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    border: "1px solid var(--border-light)",
    boxShadow: "var(--shadow-sm)",
    display: "flex",
    overflow: "hidden",
    position: "relative" as const,
  },
  leftIndicator: {
    width: "4px",
    alignSelf: "stretch",
  },
  cardMain: {
    flex: 1,
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priorityTag: {
    fontSize: "9px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  },
  dueLabel: {
    fontSize: "10px",
  },
  patientName: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  taskDesc: {
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  cardActions: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
  actionBtnGreen: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#e8f7ed",
    color: "var(--success)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  actionBtnBlue: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "rgba(20, 99, 230, 0.08)",
    color: "var(--primary)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  actionBtnGray: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "rgba(94, 108, 134, 0.08)",
    color: "var(--text-secondary)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  appointmentsCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "14px",
    boxShadow: "var(--shadow-sm)",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  },
  appointmentRow: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderBottom: "1px solid var(--border-light)",
  },
  appointmentTimeCol: {
    width: "60px",
    display: "flex",
    flexDirection: "column" as const,
    borderLeft: "3px solid var(--primary)",
    paddingLeft: "8px",
  },
  appTime: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "var(--text-primary)",
  },
  appTypeBadge: {
    fontSize: "8px",
    fontWeight: "bold",
    color: "var(--text-secondary)",
    marginTop: "2px",
  },
  appointmentPatientCol: {
    flex: 1,
    paddingLeft: "12px",
  },
  appPatientName: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  appDoctor: {
    fontSize: "10px",
    color: "var(--text-secondary)",
  },
  appDetailBtn: {
    background: "none",
    border: "none",
    color: "var(--outline)",
    cursor: "pointer",
    padding: "4px",
  }
};
