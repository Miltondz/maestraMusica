/**
 * Translates raw Convex/auth errors into clear, user-facing Spanish messages.
 *
 * Convex surfaces server errors to the client as strings like:
 *   "[CONVEX A(auth:signIn)] [Request ID: abc] Server Error
 *    Uncaught Error: InvalidSecret
 *      Called by client"
 *
 * We never want to show that raw text. This maps known error signatures to
 * friendly messages and falls back to a generic one.
 */

interface ErrorRule {
  /** Substring (case-insensitive) to look for in the raw error message. */
  match: string;
  /** Friendly Spanish message to show the user. */
  message: string;
}

// Order matters: first match wins. Put more specific rules first.
const RULES: ErrorRule[] = [
  // --- Auth ---
  { match: "InvalidSecret", message: "Correo o contraseña incorrectos." },
  { match: "InvalidAccountId", message: "Correo o contraseña incorrectos." },
  { match: "Invalid password", message: "La contraseña no cumple los requisitos (mínimo 8 caracteres)." },
  { match: "already exists", message: "Ya existe una cuenta con este correo." },
  { match: "Account already", message: "Ya existe una cuenta con este correo." },
  { match: "Unauthenticated", message: "Tu sesión expiró. Inicia sesión de nuevo." },
  { match: "Could not find public function", message: "Servicio no disponible temporalmente. Intenta de nuevo en unos minutos." },

  // --- Network ---
  { match: "Failed to fetch", message: "No hay conexión con el servidor. Revisa tu internet e intenta de nuevo." },
  { match: "NetworkError", message: "No hay conexión con el servidor. Revisa tu internet e intenta de nuevo." },
];

/**
 * Returns a clean Spanish message for any caught error.
 *
 * App-thrown errors that are already in Spanish (e.g. "Este horario ya no está
 * disponible.") are passed through unchanged. Raw Convex framework noise is
 * stripped and mapped, or replaced with `fallback`.
 */
export function getFriendlyError(
  err: unknown,
  fallback = "Ocurrió un error. Por favor, inténtalo de nuevo."
): string {
  const raw = err instanceof Error ? err.message : typeof err === "string" ? err : "";
  if (!raw) return fallback;

  // Match against known framework/auth error signatures.
  for (const rule of RULES) {
    if (raw.toLowerCase().includes(rule.match.toLowerCase())) {
      return rule.message;
    }
  }

  // App-thrown errors are already user-friendly Spanish. Detect them by the
  // absence of Convex framework noise and return the clean tail.
  if (raw.includes("[CONVEX") || raw.includes("Request ID") || raw.includes("Server Error")) {
    // Try to extract the "Uncaught Error: <msg>" tail; if it's a known-clean
    // app message, show it; otherwise use the fallback.
    const m = raw.match(/Uncaught Error:\s*(.+?)(?:\n|$)/);
    const tail = m?.[1]?.trim();
    if (tail && /[áéíóúñ¿¡ ]/i.test(tail) && tail.length < 200) {
      return tail; // looks like a human Spanish sentence thrown by our code
    }
    return fallback;
  }

  // No framework noise — assume it's already a clean app message.
  return raw;
}
