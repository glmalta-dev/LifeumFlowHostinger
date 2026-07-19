"use client";

import { useParams, useRouter } from "next/navigation";
import { BackHeader } from "@/components/layout/BackHeader";
import { useApp } from "@/context/AppContext";

export default function DetalhePendenciaPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const router = useRouter();
  const { tasks, completeTask } = useApp();
  const task = tasks.find((item) => item.id === taskId);

  if (!task) return <><BackHeader title="Pendência" backUrl="/hoje/pendencias" /><div className="card"><p>Pendência não encontrada.</p></div></>;
  return <>
    <BackHeader title="Detalhe da Pendência" backUrl="/hoje/pendencias" />
    <section className="card" aria-labelledby="task-title">
      <span className={`badge ${task.priority === "high" ? "badge-error" : "badge-warning"}`}>{task.priority === "high" ? "Alta prioridade" : "Prioridade normal"}</span>
      <h2 id="task-title" style={{ fontSize: 20 }}>{task.title}</h2>
      <p><strong>Paciente:</strong> {task.patientName}</p><p>{task.description}</p><p><strong>Prazo:</strong> {task.dueDate}</p>
      <button className="btn btn-secondary" onClick={() => router.push(`/pacientes/${task.patientId}/resumo`)}>Abrir paciente</button>
      {task.status === "pending" && <button className="btn btn-primary" onClick={() => { completeTask(task.id); router.push("/hoje/pendencias"); }}>Concluir pendência</button>}
    </section>
  </>;
}
