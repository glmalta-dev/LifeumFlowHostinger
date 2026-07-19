"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/lib/supabaseClient";
import { isSupabaseConfigured } from "@/lib/supabaseConfig";

export default function MaisPage() {
  const router = useRouter();
  const { showToast } = useApp();
  const supabaseConfigured = isSupabaseConfigured;

  // Verificar se o Supabase está configurado (de forma simplificada verificando se há chaves ativas no build)
  const handleLogout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error("Erro ao realizar logout no Supabase:", err);
    }
    
    // Expirar o cookie de sessão real
    showToast("Sessão finalizada com sucesso!", "success");
    router.replace("/login");
    router.refresh();
  };

  const menuItems = [
    {
      id: "contatos",
      title: "Contatos e Leads (CRM)",
      subtitle: "Gestão de prospecção e novos contatos",
      url: "/contatos",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      )
    },
    {
      id: "configuracoes",
      title: "Configurações do Sistema",
      subtitle: "Personalizar preferências da clínica",
      url: "/mais/configuracoes",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      )
    },
    {
      id: "relatorios",
      title: "Relatórios e Estatísticas",
      subtitle: "Métricas de conversão de tratamentos",
      url: "/mais/relatorios",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      )
    }
  ];

  return (
    <>
      <AppHeader title="Mais Opções" />

      {/* Alerta de Configuração do Supabase (Requisito 1) */}
      <div style={{
        ...styles.supabaseAlert,
        backgroundColor: supabaseConfigured ? "var(--success-bg)" : "var(--warning-bg)",
        borderColor: supabaseConfigured ? "var(--success)" : "var(--warning)",
        color: supabaseConfigured ? "var(--success)" : "var(--warning)"
      }}>
        <div style={styles.alertHeader}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {supabaseConfigured ? (
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            ) : (
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"></path>
            )}
            {supabaseConfigured && <polyline points="22 4 12 14.01 9 11.01"></polyline>}
          </svg>
          <span style={styles.alertTitle}>
            {supabaseConfigured ? "Supabase Conectado" : "Status do Banco de Dados"}
          </span>
        </div>
        <p style={{ ...styles.alertDesc, color: "var(--text-secondary)" }}>
          {supabaseConfigured 
            ? "A sincronização real de dados clínicos com o Supabase está ativada."
            : "Configure a URL e a chave publica do Supabase para ativar a gravação em banco de dados real da clínica."}
        </p>
      </div>

      <div style={styles.menuList}>
        {menuItems.map((item) => {
          return (
              <Link href={item.url} key={item.id} style={styles.menuCard}>
                <div style={styles.iconWrap}>{item.icon}</div>
                <div style={styles.textCol}>
                  <h4 style={styles.menuTitle}>{item.title}</h4>
                  <p style={styles.menuSubtitle}>{item.subtitle}</p>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--outline-variant)" }}>
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>
            );
        })}

        {/* Botão de Logout */}
        <button onClick={handleLogout} style={styles.logoutBtn} aria-label="Sair do painel clínico">
          <div style={styles.logoutIconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          <div style={{ ...styles.textCol, textAlign: "left" }}>
            <h4 style={{ ...styles.menuTitle, color: "var(--error)" }}>Sair do Painel</h4>
            <p style={styles.menuSubtitle}>Finalizar sessão clínica de forma segura</p>
          </div>
        </button>
      </div>
    </>
  );
}

const styles = {
  supabaseAlert: {
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid",
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
    marginBottom: "16px",
  },
  alertHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "bold",
    fontSize: "12px",
  },
  alertTitle: {
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  alertDesc: {
    fontSize: "11px",
    lineHeight: "1.4",
  },
  menuList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    width: "100%",
  },
  menuCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "14px",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
    boxShadow: "var(--shadow-sm)",
    textDecoration: "none",
    color: "inherit",
    transition: "var(--transition-fast)",
  },
  iconWrap: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "rgba(20, 99, 230, 0.08)",
    color: "var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  menuSubtitle: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    marginTop: "2px",
  },
  logoutBtn: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "14px",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
    boxShadow: "var(--shadow-sm)",
    width: "100%",
    fontFamily: "inherit",
    outline: "none",
  },
  logoutIconWrap: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "var(--error-bg)",
    color: "var(--error)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  }
};
