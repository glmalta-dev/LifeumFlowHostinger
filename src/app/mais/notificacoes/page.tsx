"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/layout/AppHeader";
import { useApp } from "@/context/AppContext";
import {
  disablePushNotifications,
  enablePushNotifications,
  getPushCapability,
  PushCapability,
  sendTestPush,
} from "@/lib/pushNotifications";

const initialCapability: PushCapability = { supported: true, permission: "default", subscribed: false };

export default function NotificacoesPage() {
  const { activeClinicId, showToast } = useApp();
  const [capability, setCapability] = useState(initialCapability);
  const [busy, setBusy] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  const refresh = useCallback(async () => setCapability(await getPushCapability()), []);

  useEffect(() => {
    const environmentTimer = window.setTimeout(() => {
      setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    }, 0);
    refresh().catch(() => setCapability({ supported: false, permission: "unsupported", subscribed: false }));
    return () => window.clearTimeout(environmentTimer);
  }, [refresh]);

  const run = async (action: () => Promise<unknown>, success: string) => {
    if (!activeClinicId) return showToast("Clinica ainda nao carregada.", "error");
    setBusy(true);
    try {
      await action();
      await refresh();
      showToast(success, "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Nao foi possivel concluir.", "error");
    } finally {
      setBusy(false);
    }
  };

  const status = !capability.supported
    ? "Nao compativel"
    : capability.subscribed && capability.permission === "granted"
      ? "Ativas neste aparelho"
      : capability.permission === "denied" ? "Bloqueadas no navegador" : "Desativadas";

  return (
    <>
      <AppHeader title="Notificacoes" />

      <section className="card notification-status-card" aria-live="polite">
        <div style={styles.statusRow}>
          <div style={{ ...styles.icon, background: capability.subscribed ? "var(--success-bg)" : "rgba(20, 99, 230, 0.08)", color: capability.subscribed ? "var(--success)" : "var(--primary)" }}>
            <span aria-hidden="true">{capability.subscribed ? "✓" : "!"}</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <h2 style={styles.title}>{status}</h2>
            <p>Receba pendencias e agendamentos pelo sistema do aparelho, mesmo com o Lifeum Flow fechado.</p>
          </div>
        </div>

        {!capability.supported && <p style={styles.warning}>Este navegador nao oferece Web Push. Atualize o sistema ou use Chrome, Edge, Safari ou Firefox atual.</p>}
        {isIos && !isStandalone && <p style={styles.warning}>No iPhone/iPad, primeiro use Compartilhar → Adicionar à Tela de Inicio e abra o Lifeum Flow pelo icone instalado.</p>}
        {capability.permission === "denied" && <p style={styles.warning}>A permissao foi bloqueada. Abra as configuracoes do site no navegador e permita notificacoes.</p>}

        {capability.supported && !capability.subscribed && (
          <button className="btn btn-primary" disabled={busy || !activeClinicId || (isIos && !isStandalone)} onClick={() => run(() => enablePushNotifications(activeClinicId!), "Notificacoes ativadas neste aparelho.")}>
            {busy ? "Ativando..." : "Ativar neste aparelho"}
          </button>
        )}
        {capability.subscribed && (
          <div className="responsive-form-row" style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" disabled={busy} onClick={() => run(() => sendTestPush(activeClinicId!), "Teste enviado. Bloqueie a tela para validar a proxima entrega.")}>Enviar teste</button>
            <button className="btn btn-secondary" disabled={busy} onClick={() => run(() => disablePushNotifications(activeClinicId!), "Notificacoes desativadas neste aparelho.")}>Desativar</button>
          </div>
        )}
      </section>

      <section className="card">
        <h3 style={{ fontSize: 15 }}>Como a entrega funciona</h3>
        <p>Depois de ativar, o aparelho mantem uma inscricao segura. O Service Worker recebe o alerta em segundo plano e o sistema operacional o exibe na tela bloqueada, conforme as configuracoes de silencio e economia de bateria.</p>
        <Link href="/alertas" className="btn btn-secondary">Ver central de alertas</Link>
      </section>
    </>
  );
}

const styles = {
  statusRow: { display: "flex", gap: 12, alignItems: "flex-start" },
  icon: { width: 42, height: 42, borderRadius: 12, display: "grid", placeItems: "center", flexShrink: 0, fontSize: 20, fontWeight: 800 },
  title: { fontSize: 17, marginBottom: 4 },
  warning: { padding: 12, borderRadius: 10, background: "var(--warning-bg)", color: "var(--text-primary)", fontSize: 12 },
};
