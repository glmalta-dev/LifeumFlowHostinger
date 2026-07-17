"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BottomNavigation } from "../navigation/BottomNavigation";
import { Toast } from "../ui/Toast";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { quickCaptureOpen, setQuickCaptureOpen, addTask, patients } = useApp();

  const [isCreatingTask, setIsCreatingTask] = React.useState(false);
  const [quickTitle, setQuickTitle] = React.useState("");
  const [quickDesc, setQuickDesc] = React.useState("");

  // Hide BottomNavigation on form sub-routes for total focus
  const hideBottomNav = 
    pathname.includes("/novo") || 
    pathname.includes("/editar") || 
    pathname.includes("/nova") ||
    pathname.match(/\/arquivos\/\w+/) ||
    pathname.match(/\/planejamento\/\w+/);

  const handleQuickAction = (route: string) => {
    setQuickCaptureOpen(false);
    router.push(route);
  };

  const handleCreateQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle) return;

    addTask({
      patientId: "pat-1", // Simulated for Carlos Silva
      patientName: "Carlos Eduardo Silva",
      title: quickTitle,
      description: quickDesc,
      dueDate: new Date().toISOString().split('T')[0],
      status: "pending",
      priority: "high"
    });

    setQuickTitle("");
    setQuickDesc("");
    setIsCreatingTask(false);
    setQuickCaptureOpen(false);
  };

  return (
    <div className="mobile-simulator">
      {/* Área de Notificação (Toast) */}
      <Toast />

      {/* Conteúdo Principal */}
      <main className="simulator-content">
        {children}
      </main>

      {/* Barra de Navegação Inferior */}
      {!hideBottomNav && <BottomNavigation />}

      {/* Overlay de Ações Rápidas (Botão "+") */}
      {quickCaptureOpen && (
        <div style={styles.overlay} onClick={() => {
          setQuickCaptureOpen(false);
          setIsCreatingTask(false);
        }}>
          <div style={styles.bottomSheet} onClick={(e) => e.stopPropagation()}>
            <div style={styles.sheetHeader}>
              <div style={styles.dragHandle} />
              <h2 style={styles.sheetTitle}>
                {isCreatingTask ? "Criar Nova Pendência" : "Ações Rápidas"}
              </h2>
            </div>
            
            {isCreatingTask ? (
              <form onSubmit={handleCreateQuickTask} style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                <div className="form-group">
                  <label className="form-label">TÍTULO DA PENDÊNCIA</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Ligar para confirmar cirurgia..."
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">DESCRIÇÃO DA AÇÃO</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    placeholder="Notas importantes sobre esta ação..."
                    value={quickDesc}
                    onChange={(e) => setQuickDesc(e.target.value)}
                  />
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: "10px" }}>
                    Salvar
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsCreatingTask(false)} 
                    className="btn btn-secondary" 
                    style={{ flex: 1, padding: "10px" }}
                  >
                    Voltar
                  </button>
                </div>
              </form>
            ) : (
              <div style={styles.actionsGrid}>
                <button 
                  onClick={() => handleQuickAction("/pacientes/novo")} 
                  style={styles.actionItem}
                >
                  <div style={{ ...styles.iconWrap, backgroundColor: "#e8f0fe", color: "var(--primary)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="19" y1="8" x2="19" y2="14"></line>
                      <line x1="16" y1="11" x2="22" y2="11"></line>
                    </svg>
                  </div>
                  <span style={styles.actionLabel}>Novo Paciente</span>
                </button>

                <button 
                  onClick={() => handleQuickAction("/pacientes/pat-1/agendamentos/editar")} 
                  style={styles.actionItem}
                >
                  <div style={{ ...styles.iconWrap, backgroundColor: "#eaf8f1", color: "var(--success)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <span style={styles.actionLabel}>Agendamento</span>
                </button>

                <button 
                  onClick={() => handleQuickAction("/pacientes/pat-1/evolucoes/nova")} 
                  style={styles.actionItem}
                >
                  <div style={{ ...styles.iconWrap, backgroundColor: "#fff4e5", color: "var(--warning)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </div>
                  <span style={styles.actionLabel}>Nova Evolução</span>
                </button>

                <button 
                  onClick={() => setIsCreatingTask(true)} 
                  style={styles.actionItem}
                >
                  <div style={{ ...styles.iconWrap, backgroundColor: "#fde8e9", color: "var(--error)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span style={styles.actionLabel}>Nova Pendência</span>
                </button>
              </div>
            )}
            
            <button onClick={() => {
              setQuickCaptureOpen(false);
              setIsCreatingTask(false);
            }} style={styles.cancelBtn}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  statusBar: {
    height: "38px",
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "var(--text-primary)",
    backgroundColor: "transparent",
    fontSize: "13px",
    fontWeight: "bold",
    zIndex: 10,
  },
  statusTime: {
    fontFamily: "var(--font-family-body)",
  },
  statusIcons: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    opacity: 0.85,
  },
  overlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10, 15, 25, 0.4)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    zIndex: 999,
    display: "flex",
    alignItems: "flex-end",
  },
  bottomSheet: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: "24px",
    borderTopRightRadius: "24px",
    padding: "16px 20px 24px 20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
    animation: "slideUp 0.25s ease-out",
  },
  sheetHeader: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "8px",
  },
  dragHandle: {
    width: "40px",
    height: "4px",
    backgroundColor: "var(--outline-variant)",
    borderRadius: "2px",
  },
  sheetTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  actionItem: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "10px",
    padding: "16px 12px",
    border: "1px solid rgba(16, 32, 68, 0.06)",
    borderRadius: "14px",
    backgroundColor: "#fafafb",
    cursor: "pointer",
    transition: "transform 0.15s, background-color 0.15s",
  },
  iconWrap: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  cancelBtn: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid var(--outline-variant)",
    backgroundColor: "#ffffff",
    color: "var(--text-secondary)",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "center" as const,
    width: "100%",
  }
};
