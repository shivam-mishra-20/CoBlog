"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          background: "white",
          border: "1px solid rgba(139, 92, 46, 0.2)",
          boxShadow: "0 10px 40px -10px rgba(139, 92, 46, 0.3)",
          fontFamily: "var(--font-inter)",
        },
        className: "royal-toast",
      }}
    />
  );
}
