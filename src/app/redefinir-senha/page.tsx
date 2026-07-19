"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getErrorMessage } from "@/lib/errors";

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) return setError("A senha deve ter pelo menos 8 caracteres.");
    if (password !== confirmation) return setError("As senhas não coincidem.");
    if (!supabase) return setError("Supabase não configurado.");
    setLoading(true);
    setError("");
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    } catch (caught) {
      setError(getErrorMessage(caught, "Não foi possível redefinir a senha."));
    } finally {
      setLoading(false);
    }
  };

  return <main style={styles.main}><section className="card" style={styles.card}><h1 style={styles.title}>Definir nova senha</h1><form onSubmit={submit} style={styles.form}><label htmlFor="new-password" className="form-label">NOVA SENHA</label><input id="new-password" type="password" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="new-password" /><label htmlFor="confirm-password" className="form-label">CONFIRMAR SENHA</label><input id="confirm-password" type="password" className="form-control" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required minLength={8} autoComplete="new-password" /><button className="btn btn-primary" disabled={loading}>{loading ? "Salvando..." : "Salvar nova senha"}</button></form>{error && <p role="alert" style={styles.error}>{error}</p>}</section></main>;
}

const styles = { main: { minHeight: "100dvh", display: "grid", placeItems: "center", padding: 20 }, card: { width: "100%", maxWidth: 390 }, title: { fontSize: 22, marginBottom: 18 }, form: { display: "grid", gap: 12 }, error: { color: "var(--error)", marginTop: 12 } };
