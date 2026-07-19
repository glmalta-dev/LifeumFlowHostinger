"use client";

import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

const areasMeta = [
  { id: "protese", title: "Protese", color: "#1463e6" },
  { id: "implantodontia", title: "Implantodontia", color: "#00629e" },
  { id: "dentistica", title: "Dentistica", color: "#26B978" },
  { id: "ortodontia", title: "Ortodontia", color: "#737786" }
];

export default function PlanejamentoPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const router = useRouter();
  const { patients, planWorkflows, planSteps, isLoading } = useApp();
  const patient = patients.find(item => item.id === patientId);

  if (isLoading) return <div className="card"><p>Carregando planejamento...</p></div>;
  if (!patient) return <div className="card"><p>Paciente nao encontrado.</p></div>;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "4px 0" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700 }}>Plano de Tratamento</h3>
        <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>Fluxos persistidos por area clinica</span>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {areasMeta.map(area => {
          const workflow = planWorkflows.find(item => item.patientId === patientId && item.areaId === area.id && item.status !== "cancelled");
          const steps = workflow ? planSteps.filter(item => item.workflowId === workflow.id) : [];
          const done = steps.filter(item => item.status === "completed").length;
          const progress = steps.length ? Math.round(done / steps.length * 100) : 0;
          const status = !workflow ? "Nao iniciado" : workflow.status === "completed" ? "Concluido" : "Em andamento";
          return (
            <button key={area.id} type="button" onClick={() => router.push(`/pacientes/${patientId}/planejamento/${area.id}`)} style={{ background: "#fff", border: "1px solid var(--border-light)", borderRadius: 14, padding: 14, display: "grid", gap: 12, textAlign: "left", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}><i style={{ width: 8, height: 20, borderRadius: 4, background: area.color }} />{area.title}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)" }}>{status}</span>
              </div>
              <div><div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}><span>Progresso</span><strong>{done}/{steps.length} ({progress}%)</strong></div><div style={{ height: 6, background: "rgba(16,32,68,.05)", borderRadius: 3, marginTop: 6 }}><div style={{ width: `${progress}%`, height: "100%", borderRadius: 3, background: area.color }} /></div></div>
              <span style={{ borderTop: "1px solid var(--border-light)", paddingTop: 10, fontSize: 11, color: "var(--text-secondary)" }}>{workflow ? "Ver e atualizar etapas" : "Iniciar planejamento"}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
