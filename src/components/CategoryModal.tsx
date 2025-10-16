"use client";

import { trpc } from "@/lib/trpc/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

interface CategoryModalProps {
  categoryId: number | null;
  onClose: () => void;
}

export default function CategoryModal({
  categoryId,
  onClose,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: existingCategory } = trpc.category.getById.useQuery(
    { id: categoryId! },
    { enabled: !!categoryId }
  );

  const utils = trpc.useUtils();

  const createMutation = trpc.category.create.useMutation({
    onMutate: () => {
      toast.loading("Creating category...", { id: "create-category" });
    },
    onSuccess: () => {
      toast.success("Category created successfully!", {
        id: "create-category",
      });
      utils.category.getAll.invalidate();
      onClose();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create category", {
        id: "create-category",
      });
    },
  });

  const updateMutation = trpc.category.update.useMutation({
    onMutate: () => {
      toast.loading("Updating category...", { id: "update-category" });
    },
    onSuccess: () => {
      toast.success("Category updated successfully!", {
        id: "update-category",
      });
      utils.category.getAll.invalidate();
      utils.category.getById.invalidate({ id: categoryId! });
      onClose();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update category", {
        id: "update-category",
      });
    },
  });

  useEffect(() => {
    if (existingCategory) {
      setName(existingCategory.name);
      setDescription(existingCategory.description || "");
    }
  }, [existingCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (categoryId) {
        await updateMutation.mutateAsync({
          id: categoryId,
          name,
          description: description || undefined,
        });
      } else {
        await createMutation.mutateAsync({
          name,
          description: description || undefined,
        });
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-royal-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container - Responsive */}
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-royal-2xl border border-royal-200 animate-slide-up">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header - Fixed */}
          <div className="flex-shrink-0 bg-gradient-to-r from-royal-50 to-brown-50 px-4 sm:px-6 py-4 sm:py-5 border-b border-royal-200 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-royal-900">
                {categoryId ? "Edit Category" : "Create New Category"}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-royal-400 hover:text-royal-600 transition-colors rounded-full hover:bg-royal-100 p-2"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Area with Hidden Scrollbar */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 scrollbar-hide">
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-royal-900 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-royal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent transition-all text-royal-900 text-sm sm:text-base"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-royal-900 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-royal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent transition-all text-royal-900 resize-none text-sm sm:text-base"
                  placeholder="Brief description (optional)"
                />
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="flex-shrink-0 bg-gradient-to-r from-royal-50 to-brown-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-royal-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border-2 border-royal-300 shadow-sm px-4 sm:px-6 py-2 sm:py-3 bg-white text-sm sm:text-base font-semibold text-royal-700 hover:bg-royal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-500 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border border-transparent shadow-royal px-4 sm:px-6 py-2 sm:py-3 bg-royal-900 text-sm sm:text-base font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : categoryId
                ? "Update Category"
                : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
