"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "./ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const iconColors = {
    danger: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  };

  const buttonVariants = {
    danger: "destructive" as const,
    warning: "default" as const,
    info: "default" as const,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-royal-lg dark:shadow-royal border border-royal-200 dark:border-royal-800 animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-royal-200 dark:border-royal-800">
          <div className="flex items-center gap-3">
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                type === "danger"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : type === "warning"
                  ? "bg-yellow-100 dark:bg-yellow-900/30"
                  : "bg-blue-100 dark:bg-blue-900/30"
              }`}
            >
              <AlertTriangle
                className={`h-6 w-6 ${iconColors[type]} dark:opacity-90`}
              />
            </div>
            <h3 className="text-xl font-serif font-bold text-royal-900 dark:text-royal-100">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-royal-400 dark:text-royal-500 hover:text-royal-600 dark:hover:text-royal-300 transition-colors rounded-full hover:bg-royal-100 dark:hover:bg-royal-800/30 p-2"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-royal-700 dark:text-royal-300 leading-relaxed">
            {message}
          </p>
        </div>
        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 p-6 pt-0">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            variant={buttonVariants[type]}
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
