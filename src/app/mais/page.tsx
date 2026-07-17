"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { AppHeader } from "@/components/layout/AppHeader";

export default function MaisPage() {
  const router = useRouter();
  const { showToast } = useApp();

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
      action: () => showToast("Carregando relatório operacional simulado...", "success"),
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

      <div style={styles.menuList}>
        {menuItems.map((item) => {
          if (item.url) {
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
          } else {
            return (
              <div onClick={item.action} key={item.id} style={styles.menuCard}>
                <div style={styles.iconWrap}>{item.icon}</div>
                <div style={styles.textCol}>
                  <h4 style={styles.menuTitle}>{item.title}</h4>
                  <p style={styles.menuSubtitle}>{item.subtitle}</p>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--outline-variant)" }}>
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            );
          }
        })}
      </div>
    </>
  );
}

const styles = {
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
  }
};
