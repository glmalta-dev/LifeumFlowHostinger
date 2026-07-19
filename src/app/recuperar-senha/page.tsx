"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getErrorMessage } from "@/lib/errors";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return setError("Supabase não configurado.");
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });
      if (resetError) throw resetError;
      setMessage("Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.");
    } catch (caught) {
      setError(getErrorMessage(caught, "Não foi possível solicitar a recuperação."));
    } finally {
      setLoading(false);
    }
  };

  return <main style={styles.main}><section className="card" style={styles.card}><h1 style={styles.title}>Recuperar senha</h1><p>Informe seu e-mail de acesso.</p><form onSubmit={submit} style={styles.form}><label htmlFor="recovery-email" className="form-label">E-MAIL</label><input id="recovery-email" type="email" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /><button className="btn btn-primary" disabled={loading}>{loading ? "Enviando..." : "Enviar instruções"}</button></form>{message && <p role="status" style={styles.success}>{message}</p>}{error && <p role="alert" style={styles.error}>{error}</p>}<Link href="/login">Voltar ao login</Link></section></main>;
}

const styles = { main: { minHeight: "100dvh", display: "grid", placeItems: "center", padding: 20 }, card: { width: "100%", maxWidth: 390 }, title: { fontSize: 22, marginBottom: 8 }, form: { display: "grid", gap: 12, margin: "18px 0" }, success: { color: "var(--success)", marginBottom: 12 }, error: { color: "var(--error)", marginBottom: 12 } };
