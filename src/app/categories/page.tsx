"use client";

import { trpc } from "@/lib/trpc/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";
import CategoryModal from "@/components/CategoryModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Folder, Tag } from "lucide-react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const {
    data: categories,
    isLoading,
    refetch,
  } = trpc.category.getAll.useQuery();

  const utils = trpc.useUtils();

  const deleteMutation = trpc.category.delete.useMutation({
    onMutate: async () => {
      toast.loading("Deleting category...", { id: "delete-category" });
    },
    onSuccess: () => {
      toast.success("Category deleted successfully!", {
        id: "delete-category",
      });
      utils.category.getAll.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete category", {
        id: "delete-category",
      });
    },
  });

  const handleEdit = (categoryId: number) => {
    setEditingCategoryId(categoryId);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCategoryId(null);
    setIsModalOpen(true);
  };

  const handleDelete = (categoryId: number, categoryName: string) => {
    setCategoryToDelete({ id: categoryId, name: categoryName });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate({ id: categoryToDelete.id });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategoryId(null);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-luxury">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Folder className="h-8 w-8 text-royal-600" />
              <h1 className="text-5xl font-serif font-bold text-royal-900">
                Categories
              </h1>
            </div>
            <p className="mt-2 text-lg text-royal-700">
              Organize your blog posts with categories
            </p>
          </div>
          <Button
            onClick={handleCreate}
            variant="luxury"
            size="lg"
            className="animate-slide-up"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Category
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-royal-600 border-r-transparent"></div>
            <p className="mt-6 text-royal-700 text-lg">Loading categories...</p>
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="card-luxury hover:scale-105 transition-all duration-300 hover:shadow-royal-xl"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">
                        {category.name}
                      </CardTitle>
                      <p className="text-sm text-royal-600">/{category.slug}</p>
                    </div>
                    <Badge variant="luxury" className="ml-2">
                      {category.postCount} posts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.description && (
                    <p className="text-royal-600 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-royal-200">
                    <Button
                      onClick={() => handleEdit(category.id)}
                      variant="ghost"
                      className="flex-1"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(category.id, category.name)}
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-luxury text-center py-16">
            <CardContent>
              <Tag className="mx-auto h-16 w-16 text-royal-400 mb-4" />
              <h3 className="text-xl font-serif font-semibold text-royal-900 mb-2">
                No categories yet
              </h3>
              <p className="text-royal-600 mb-6">
                Get started by creating your first category.
              </p>
              <Button onClick={handleCreate} variant="default" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Category
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {isModalOpen && (
        <CategoryModal
          categoryId={editingCategoryId}
          onClose={handleModalClose}
        />
      )}

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone and will affect all posts in this category.`}
        confirmText="Delete Category"
        cancelText="Cancel"
        type="danger"
        isLoading={deleteMutation.isPending}
      />

      <Footer />
    </div>
  );
}
