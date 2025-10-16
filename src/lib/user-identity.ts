/** localStorage-based identity helper */

const USER_ID_KEY = "coblog_user_id";

/** Generates a UUID v4 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateUserId(): string {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    // server-side: throw
    throw new Error("getOrCreateUserId can only be called in browser context");
  }

  try {
  // Try to read existing user ID
    let userId = localStorage.getItem(USER_ID_KEY);

  // Create new ID if missing
    if (!userId) {
      userId = generateUUID();
      localStorage.setItem(USER_ID_KEY, userId);
    }

    return userId;
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    // Fallback: generate a session-only ID
    return generateUUID();
  }
}

/**
 * Gets the current user ID without creating one
 * @returns {string | null} The user's ID or null if not set
 */
export function getUserId(): string | null {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return null;
  }
}

/**
 * Clears the user ID (useful for testing or "logout")
 */
export function clearUserId(): void {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(USER_ID_KEY);
    console.log("🗑️ User ID cleared");
  } catch (error) {
    console.error("Error clearing user ID:", error);
  }
}

/**
 * Hook for React components to access user ID
 */
export function useUserId() {
  if (typeof window === "undefined") {
    return null;
  }

  return getOrCreateUserId();
}
