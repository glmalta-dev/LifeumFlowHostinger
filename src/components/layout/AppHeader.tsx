"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

interface AppHeaderProps {
  title: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const { tasks } = useApp();
  const pendingHigh = tasks.filter(t => t.status === "pending" && t.priority === "high").length;

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    return new Date().toLocaleDateString('pt-BR', options);
  };

  return (
    <header style={styles.header}>
      <div style={styles.topRow}>
        <div style={styles.profileArea}>
          <div style={styles.avatar}>G</div>
          <div>
            <div style={styles.welcome}>Olá, Gabriel</div>
            <div style={styles.date}>{getFormattedDate()}</div>
          </div>
        </div>
        <Link href="/alertas" style={styles.notificationBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {pendingHigh > 0 && (
            <span style={styles.badge}>{pendingHigh}</span>
          )}
        </Link>
      </div>
      <h1 style={styles.title}>{title}</h1>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid var(--border-light)"
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileArea: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--primary) 0%, #004cba 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
    boxShadow: "0 2px 5px rgba(20, 99, 230, 0.15)"
  },
  welcome: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-secondary)",
  },
  date: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    textTransform: "capitalize" as const
  },
  notificationBtn: {
    position: "relative" as const,
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "rgba(16, 32, 68, 0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-primary)",
    cursor: "pointer",
  },
  badge: {
    position: "absolute" as const,
    top: "0",
    right: "0",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    backgroundColor: "var(--error)",
    color: "#fff",
    fontSize: "9px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid var(--bg-app)"
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "var(--text-primary)",
    fontFamily: "var(--font-family-title)"
  }
};
