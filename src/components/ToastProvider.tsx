"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function ToastProvider() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors
      closeButton
      duration={4000}
      theme={isDark ? "dark" : "light"}
      toastOptions={{
        style: {
          background: isDark ? "rgb(28, 25, 23)" : "rgb(255, 255, 255)",
          color: isDark ? "rgb(250, 245, 240)" : "rgb(28, 25, 23)",
          border: isDark
            ? "1px solid rgba(168, 137, 104, 0.3)"
            : "1px solid rgba(120, 94, 71, 0.2)",
          boxShadow: isDark
            ? "0 10px 40px -10px rgba(0, 0, 0, 0.5)"
            : "0 10px 40px -10px rgba(120, 94, 71, 0.3)",
          fontFamily: "var(--font-inter)",
        },
        className: "royal-toast",
      }}
    />
  );
}
