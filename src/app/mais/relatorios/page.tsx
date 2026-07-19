"use client";

import { BackHeader } from "@/components/layout/BackHeader";
import { useApp } from "@/context/AppContext";

export default function RelatoriosPage() {
  const { patients, appointments, tasks, leads } = useApp();
  const metrics: [string, number][] = [
    ["Pacientes ativos", patients.filter(p => p.status === "active").length],
    ["Agendamentos", appointments.filter(a => a.status !== "cancelado").length],
    ["Pendências abertas", tasks.filter(t => t.status === "pending").length],
    ["Leads em andamento", leads.filter(l => l.status !== "arquivado").length],
  ];
  return <><BackHeader title="Relatórios e Estatísticas" backUrl="/mais" /><div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>{metrics.map(([label, value]) => <section className="card" key={label} style={{ minWidth: 0 }}><strong style={{ fontSize: 26, color: "var(--primary)" }}>{value}</strong><p>{label}</p></section>)}</div><section className="card"><h2 style={{ fontSize: 16 }}>Visão operacional</h2><p>Os indicadores refletem os dados atualmente carregados no sistema.</p></section></>;
}
