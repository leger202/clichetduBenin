"use client";

/**
 * Jeton de votant anonyme : généré une fois par navigateur et réutilisé.
 * Le serveur l'utilise pour garantir « un seul like par utilisateur ».
 */
const VOTER_KEY = "cliches-benin-voter";

let memoryVoter: string | null = null;

export function getVoterToken(): string {
  try {
    const existing = window.localStorage.getItem(VOTER_KEY);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    window.localStorage.setItem(VOTER_KEY, fresh);
    return fresh;
  } catch {
    // localStorage indisponible (navigation privée stricte, etc.)
    if (!memoryVoter) {
      memoryVoter =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `fallback-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    }
    return memoryVoter;
  }
}
