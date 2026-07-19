"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  if (!toast || !toast.message) return null;

  const isSuccess = toast.type === "success";

  return (
    <div 
      style={{
        ...styles.toastContainer,
        backgroundColor: isSuccess ? "#e6f7ed" : "#fde8e9",
        borderColor: isSuccess ? "var(--success)" : "var(--error)",
        color: isSuccess ? "#1e7e4a" : "#b91c1c"
      }}
      onClick={hideToast}
    >
      <div style={styles.content}>
        {isSuccess ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        )}
        <span style={styles.message}>{toast.message}</span>
      </div>
    </div>
  );
};

const styles = {
  toastContainer: {
    position: "absolute" as const,
    top: "20px",
    left: "16px",
    right: "16px",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    animation: "slideDown 0.3s ease",
  },
  content: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  message: {
    fontSize: "13px",
    fontWeight: 600,
  }
};
