/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { BackHeader } from "@/components/layout/BackHeader";
import { supabase } from "@/lib/supabaseClient";

export default function PerfilPage() {
  const { currentUser, showToast } = useApp();
  const email = currentUser?.email || "";
  const [name, setName] = useState(currentUser?.user_metadata?.name || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentUser?.user_metadata?.avatar_url || null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("A foto deve ter no maximo 5MB.", "error");
      return;
    }

    setUploading(true);
    try {
      const client = supabase;
      if (!client) {
        throw new Error("Cliente Supabase indisponivel.");
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${currentUser.id}/avatar_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await client.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = client.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      setAvatarUrl(publicUrl);

      // Atualiza os metadados do usuario com a nova URL da foto
      const { error: updateError } = await client.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) {
        throw updateError;
      }

      showToast("Foto de perfil atualizada com sucesso!", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao enviar a foto.";
      showToast(message, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    try {
      const client = supabase;
      if (!client) throw new Error("Cliente Supabase indisponivel.");

      const { error } = await client.auth.updateUser({
        data: { name: name.trim() },
      });

      if (error) throw error;

      showToast("Perfil atualizado com sucesso!", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao salvar perfil.";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const avatarLetter = (name.trim() || email.trim() || "D").charAt(0).toUpperCase();

  return (
    <>
      <BackHeader title="Meu Perfil" backUrl="/mais" />

      <div style={styles.container}>
        <div className="card" style={styles.card}>
          <div style={styles.avatarSection}>
            <div style={styles.avatarWrapper}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Foto de Perfil" style={styles.avatarImage} />
              ) : (
                <div style={styles.avatarPlaceholder}>{avatarLetter}</div>
              )}
            </div>

            <label htmlFor="avatar-upload" className="btn btn-secondary" style={styles.uploadBtn}>
              {uploading ? "Enviando foto..." : "Alterar Foto"}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleAvatarUpload}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </div>

          <form onSubmit={handleSaveProfile} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>E-mail de Acesso</label>
              <input
                className="form-control"
                type="email"
                value={email}
                disabled
                style={styles.disabledInput}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Nome Completo / Profissional</label>
              <input
                className="form-control"
                type="text"
                placeholder="Ex: Dr. Gabriel Malta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving || uploading} style={styles.submitBtn}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
    width: "100%",
  },
  card: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
    padding: "20px",
  },
  avatarSection: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "12px",
  },
  avatarWrapper: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    overflow: "hidden",
    boxShadow: "var(--shadow-md)",
    border: "3px solid var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f9",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--primary)",
    color: "#ffffff",
    fontSize: "36px",
    fontWeight: "bold",
  },
  uploadBtn: {
    fontSize: "12px",
    padding: "8px 16px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
  },
  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-secondary)",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "var(--text-secondary)",
    cursor: "not-allowed",
  },
  submitBtn: {
    marginTop: "8px",
    width: "100%",
  },
};
