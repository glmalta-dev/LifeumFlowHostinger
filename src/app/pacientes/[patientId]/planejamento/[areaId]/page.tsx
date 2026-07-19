"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { BackHeader } from "@/components/layout/BackHeader";
import { useApp } from "@/context/AppContext";
import type { PlanStepStatus } from "@/types";

const titles: Record<string, string> = {
  protese: "Protese Dentaria", implantodontia: "Implantodontia",
  dentistica: "Dentistica Restauradora", ortodontia: "Ortodontia"
};
const suggestedSteps: Record<string, string[]> = {
  protese: ["Moldagem diagnostica", "Planejamento estetico", "Prova clinica", "Finalizacao", "Ajuste oclusal"],
  implantodontia: ["Documentacao e tomografia", "Planejamento cirurgico", "Cirurgia", "Reabertura e acompanhamento"],
  dentistica: ["Avaliacao e diagnostico", "Controle do meio bucal", "Restauracoes", "Acabamento e revisao"],
  ortodontia: ["Documentacao ortodontica", "Planejamento", "Instalacao", "Manutencoes"]
};

export default function DetalheAreaPlanejamentoPage() {
  const { patientId, areaId } = useParams<{ patientId: string; areaId: string }>();
  const { planWorkflows, planSteps, createPlanWorkflow, addPlanStep, updatePlanStep, updatePlanWorkflow, isLoading } = useApp();
  const [newStep, setNewStep] = useState("");
  const [saving, setSaving] = useState(false);
  const areaTitle = titles[areaId] || "Planejamento Clinico";
  const workflow = planWorkflows.find(item => item.patientId === patientId && item.areaId === areaId && item.status !== "cancelled");
  const steps = workflow ? planSteps.filter(item => item.workflowId === workflow.id).sort((a, b) => a.sortOrder - b.sortOrder) : [];
  const done = steps.filter(item => item.status === "completed").length;
  const progress = steps.length ? Math.round(done / steps.length * 100) : 0;

  const startWorkflow = async () => {
    setSaving(true);
    try { await createPlanWorkflow({ patientId, areaId, name: areaTitle, status: "active" }, suggestedSteps[areaId] || []); }
    finally { setSaving(false); }
  };
  const changeStatus = async (stepId: string, status: PlanStepStatus) => {
    await updatePlanStep(stepId, { status });
    if (workflow) {
      const projected = steps.map(item => item.id === stepId ? { ...item, status } : item);
      const nextWorkflowStatus = projected.length && projected.every(item => item.status === "completed") ? "completed" : "active";
      if (workflow.status !== nextWorkflowStatus) await updatePlanWorkflow(workflow.id, { status: nextWorkflowStatus });
    }
  };
  const submitStep = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!workflow || !newStep.trim()) return;
    await addPlanStep({ workflowId: workflow.id, title: newStep.trim(), status: "pending", sortOrder: steps.length });
    setNewStep("");
  };

  if (isLoading) return <div className="card"><p>Carregando planejamento...</p></div>;
  return (
    <>
      <BackHeader title={areaTitle} backUrl={`/pacientes/${patientId}/planejamento`} />
      {!workflow ? (
        <section className="card" style={{ display: "grid", gap: 12 }}>
          <h2 style={{ fontSize: 16 }}>Planejamento ainda nao iniciado</h2>
          <p>Ao iniciar, as etapas sugeridas serao criadas como pendentes e poderao ser ajustadas.</p>
          <button className="btn btn-primary" onClick={() => void startWorkflow()} disabled={saving}>{saving ? "Iniciando..." : "Iniciar planejamento"}</button>
        </section>
      ) : (
        <>
          <section className="card">
            <div style={{ display: "flex", justifyContent: "space-between" }}><strong>{done} de {steps.length} concluidas</strong><strong style={{ color: "var(--primary)" }}>{progress}%</strong></div>
            <div style={{ height: 6, background: "rgba(16,32,68,.05)", borderRadius: 3, marginTop: 10 }}><div style={{ width: `${progress}%`, height: "100%", background: "var(--primary)", borderRadius: 3 }} /></div>
          </section>
          <div style={{ display: "grid", gap: 10 }}>
            {steps.map(step => (
              <article className="card" key={step.id} style={{ display: "grid", gap: 8 }}>
                <strong>{step.title}</strong>
                <select className="form-control" aria-label={`Status de ${step.title}`} value={step.status} onChange={event => void changeStatus(step.id, event.target.value as PlanStepStatus)}>
                  <option value="pending">Pendente</option><option value="ready">Pronta</option>
                  <option value="in_progress">Em andamento</option><option value="waiting">Aguardando</option>
                  <option value="completed">Concluida</option><option value="skipped">Ignorada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </article>
            ))}
          </div>
          <form className="card" onSubmit={submitStep} style={{ display: "flex", gap: 8 }}>
            <input className="form-control" aria-label="Nova etapa" value={newStep} onChange={event => setNewStep(event.target.value)} placeholder="Adicionar etapa" />
            <button className="btn btn-primary" disabled={!newStep.trim()}>Adicionar</button>
          </form>
        </>
      )}
    </>
  );
}
