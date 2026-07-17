"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BackHeader } from "@/components/layout/BackHeader";

export default function PendenciasPage() {
  const router = useRouter();
  const { tasks, completeTask, addTask } = useApp();
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">("medium");

  const filteredTasks = tasks.filter(t => t.status === activeTab);

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;
    
    addTask({
      patientId: "pat-1", // default Carlos Silva
      patientName: "Carlos Eduardo Silva",
      title: taskTitle,
      description: taskDesc,
      dueDate: new Date().toISOString().split('T')[0],
      status: "pending",
      priority: taskPriority
    });

    setTaskTitle("");
    setTaskDesc("");
    setTaskPriority("medium");
    setIsModalOpen(false);
  };

  return (
    <>
      <BackHeader title="Pendências" backUrl="/hoje" />

      {isModalOpen && (
        <div style={modalStyles.overlay} onClick={() => setIsModalOpen(false)}>
          <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
            <h4 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 700 }}>Nova Pendência</h4>
            <form onSubmit={handleAddNewTask} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="form-group">
                <label className="form-label">TÍTULO</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: Ligar para cobrar exames..."
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">DESCRIÇÃO</label>
                <textarea
                  rows={2}
                  className="form-control"
                  placeholder="O que precisa ser feito..."
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">PRIORIDADE</label>
                <select
                  className="form-control"
                  value={taskPriority}
                  onChange={e => setTaskPriority(e.target.value as any)}
                >
                  <option value="high">Alta Prioridade</option>
                  <option value="medium">Média Prioridade</option>
                  <option value="low">Baixa Prioridade</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: "10px" }}>Salvar</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, padding: "10px" }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button 
          onClick={() => setActiveTab("pending")} 
          style={activeTab === "pending" ? styles.tabActive : styles.tab}
        >
          Pendentes ({tasks.filter(t => t.status === "pending").length})
        </button>
        <button 
          onClick={() => setActiveTab("completed")} 
          style={activeTab === "completed" ? styles.tabActive : styles.tab}
        >
          Concluídas ({tasks.filter(t => t.status === "completed").length})
        </button>
      </div>

      {/* Task List */}
      <div style={styles.taskList}>
        {filteredTasks.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Nenhuma pendência encontrada.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} style={styles.taskCard}>
              <div style={styles.taskInfo}>
                <h3 style={styles.taskTitle}>{task.title}</h3>
                <p style={styles.taskPatient}>Paciente: {task.patientName}</p>
                <p style={styles.taskDesc}>{task.description}</p>
                <span style={{ 
                  ...styles.priorityTag, 
                  backgroundColor: task.priority === "high" ? "var(--error-bg)" : "rgba(94, 108, 134, 0.08)",
                  color: task.priority === "high" ? "var(--error)" : "var(--text-secondary)"
                }}>
                  Prioridade: {task.priority.toUpperCase()}
                </span>
              </div>
              {task.status === "pending" && (
                <button onClick={() => completeTask(task.id)} style={styles.checkBtn} title="Concluir">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={styles.floatingAddBtn}>
        + Criar Pendência
      </button>
    </>
  );
}

const styles = {
  tabContainer: {
    display: "flex",
    borderBottom: "1px solid var(--border-light)",
    width: "100%",
  },
  tab: {
    flex: 1,
    padding: "10px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    cursor: "pointer",
    textAlign: "center" as const,
  },
  tabActive: {
    flex: 1,
    padding: "10px",
    background: "none",
    border: "none",
    borderBottom: "2px solid var(--primary)",
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--primary)",
    cursor: "pointer",
    textAlign: "center" as const,
  },
  taskList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    width: "100%",
    paddingBottom: "80px",
  },
  taskCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid var(--border-light)",
    padding: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  taskInfo: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  taskTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  taskPatient: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--primary)",
  },
  taskDesc: {
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  priorityTag: {
    fontSize: "9px",
    fontWeight: "bold",
    padding: "2px 6px",
    borderRadius: "6px",
    width: "fit-content",
    marginTop: "4px",
  },
  checkBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "rgba(38, 185, 120, 0.08)",
    color: "var(--success)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "40px 20px",
    color: "var(--text-secondary)",
  },
  floatingAddBtn: {
    position: "absolute" as const,
    bottom: "20px",
    left: "20px",
    right: "20px",
    width: "calc(100% - 40px)",
    zIndex: 10,
  }
};

const modalStyles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10, 15, 25, 0.4)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modal: {
    width: "100%",
    maxWidth: "340px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "18px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    display: "flex",
    flexDirection: "column" as const,
  }
};
