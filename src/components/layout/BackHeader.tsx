"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface BackHeaderProps {
  title: string;
  backUrl?: string; // Optional custom URL, otherwise calls router.back()
}

export const BackHeader: React.FC<BackHeaderProps> = ({ title, backUrl }) => {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <header style={styles.header}>
      <button onClick={handleBack} style={styles.backButton} aria-label="Voltar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <h1 style={styles.title}>{title}</h1>
      <div style={styles.placeholder} />
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "12px",
    borderBottom: "1px solid var(--border-light)",
    backgroundColor: "transparent",
    width: "100%",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "var(--text-primary)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px",
    borderRadius: "50%",
    backgroundColor: "rgba(16, 32, 68, 0.05)",
    transition: "background-color 0.2s",
  },
  title: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--text-primary)",
    textAlign: "center" as const,
    flex: 1,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: "0 8px",
  },
  placeholder: {
    width: "32px", /* Match the back button width to keep title perfectly centered */
  }
};
