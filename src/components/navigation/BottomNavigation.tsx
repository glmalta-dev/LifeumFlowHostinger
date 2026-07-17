"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const { setQuickCaptureOpen } = useApp();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <nav style={styles.navBar}>
      {/* 1. Hoje */}
      <Link href="/hoje" style={isActive("/hoje") ? styles.activeTab : styles.tab}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span style={styles.label}>Hoje</span>
      </Link>

      {/* 2. Pacientes */}
      <Link href="/pacientes" style={isActive("/pacientes") && !pathname.includes("/novo") ? styles.activeTab : styles.tab}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span style={styles.label}>Pacientes</span>
      </Link>

      {/* 3. Botão central "+" de Captura Rápida */}
      <button onClick={() => setQuickCaptureOpen(true)} style={styles.plusButton} aria-label="Captura Rápida">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      {/* 4. Fluxos */}
      <Link href="/fluxos" style={isActive("/fluxos") ? styles.activeTab : styles.tab}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z"></path>
          <path d="M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z"></path>
          <path d="M15 6H9"></path>
          <path d="M15 18H9"></path>
        </svg>
        <span style={styles.label}>Fluxos</span>
      </Link>

      {/* 5. Mais */}
      <Link href="/mais" style={isActive("/mais") || isActive("/contatos") || isActive("/alertas") ? styles.activeTab : styles.tab}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="19" cy="12" r="1"></circle>
          <circle cx="5" cy="12" r="1"></circle>
        </svg>
        <span style={styles.label}>Mais</span>
      </Link>
    </nav>
  );
};

const styles = {
  navBar: {
    position: "absolute" as const,
    bottom: "0",
    left: "0",
    right: "0",
    height: "76px",
    background: "var(--surface-glass)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderTop: "1px solid var(--border-light)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "0 10px 12px 10px",
    zIndex: 100,
    borderBottomLeftRadius: "40px", /* Match the mockup simulator boundaries */
    borderBottomRightRadius: "40px",
  },
  tab: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "4px",
    textDecoration: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: 500,
    transition: "color 0.2s",
    flex: 1,
  },
  activeTab: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "4px",
    textDecoration: "none",
    color: "var(--primary)",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: 600,
    flex: 1,
  },
  label: {
    fontSize: "10px",
  },
  plusButton: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--primary) 0%, #004cba 100%)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(20, 99, 230, 0.35)",
    cursor: "pointer",
    transform: "translateY(-14px)",
    zIndex: 110,
    transition: "transform 0.2s",
  }
};
