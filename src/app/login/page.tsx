"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/lib/supabaseClient";
import { getErrorMessage } from "@/lib/errors";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    void supabase?.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/hoje");
    });
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      showToast("Preencha e-mail e senha.", "error");
      return;
    }
    if (!supabase) {
      showToast("Conexão com o Supabase não configurada.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error || !data.session) {
        showToast(error?.message || "E-mail ou senha incorretos.", "error");
        return;
      }
      showToast("Login realizado com sucesso!", "success");
      router.replace("/hoje");
      router.refresh();
    } catch (error) {
      showToast(getErrorMessage(error, "Erro ao realizar login."), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.brandBlock}>
        <h1 style={styles.brandTitle}>Lifeum Flow</h1>
        <p style={styles.brandSubtitle}>Gestão Ativa Odontológica</p>
      </div>
      <form onSubmit={handleSubmit} style={styles.form} aria-busy={isLoading}>
        <div className="form-group" style={styles.formGroup}>
          <label htmlFor="login-email" className="form-label" style={styles.label}>E-MAIL CLÍNICO</label>
          <input id="login-email" name="email" type="email" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" style={styles.input} />
        </div>
        <div className="form-group" style={styles.formGroup}>
          <label htmlFor="login-password" className="form-label" style={styles.label}>SENHA DE ACESSO</label>
          <input id="login-password" name="password" type="password" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" style={styles.input} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading} style={styles.button}>{isLoading ? "Acessando..." : "Entrar no Painel"}</button>
        <Link href="/recuperar-senha" style={styles.recoveryLink}>Esqueci minha senha</Link>
      </form>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", width: "100%", minHeight: "100dvh", padding: "24px", gap: "32px", backgroundColor: "var(--bg-app)" },
  brandBlock: { textAlign: "center" as const },
  brandTitle: { fontSize: "28px", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-family-title)", letterSpacing: "-0.5px" },
  brandSubtitle: { fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" },
  form: { display: "flex", flexDirection: "column" as const, width: "100%", maxWidth: "390px", gap: "16px" },
  formGroup: { display: "flex", flexDirection: "column" as const, gap: "6px" },
  label: { fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.5px" },
  input: { width: "100%", padding: "12px 14px", border: "1px solid var(--outline-variant)", borderRadius: "12px", fontSize: "14px", color: "var(--text-primary)", backgroundColor: "#ffffff", outline: "none" },
  button: { padding: "14px", fontSize: "14px", fontWeight: 700, borderRadius: "12px", marginTop: "8px" },
  recoveryLink: { textAlign: "center" as const, color: "var(--primary)", fontSize: "12px", fontWeight: 600, textDecoration: "none" },
};
