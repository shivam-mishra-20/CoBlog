"use client";

import { trpc } from "@/lib/trpc/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PostModal from "@/components/PostModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, BookOpen, LayoutDashboard } from "lucide-react";
import { getOrCreateUserId } from "@/lib/user-identity";
import Link from "next/link";
import Image from "next/image";
import { usePostStore } from "@/lib/store/post-store";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [userId, setUserId] = useState<string>("");
  const {
    isModalOpen,
    editingPostId,
    openCreateModal,
    openEditModal,
    closeModal,
    setDeleting,
  } = usePostStore();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);

  // Get userId on client
  useEffect(() => {
    setUserId(getOrCreateUserId());
  }, []);

  const {
    data: posts,
    isLoading,
    refetch,
  } = trpc.post.getByOwner.useQuery(
    { ownerId: userId },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      enabled: !!userId,
    }
  );

  const utils = trpc.useUtils();

  const deleteMutation = trpc.post.delete.useMutation({
    onMutate: async ({ id }) => {
      setDeleting(true);
      // pause refetch
      await utils.post.getByOwner.cancel();

      // snapshot
      const previousPosts = utils.post.getByOwner.getData({ ownerId: userId });

      // optimistic update
      utils.post.getByOwner.setData({ ownerId: userId }, (old) =>
        old?.filter((post) => post.id !== id)
      );

      toast.loading("Deleting post...", { id: "delete-post" });

      return { previousPosts };
    },
    onSuccess: () => {
      setDeleting(false);
      toast.success("Post deleted successfully!", { id: "delete-post" });
    },
    onError: (err, variables, context) => {
      setDeleting(false);
      // rollback on error
      if (context?.previousPosts) {
        utils.post.getByOwner.setData(
          { ownerId: userId },
          context.previousPosts
        );
      }
      toast.error(err.message || "Failed to delete post", {
        id: "delete-post",
      });
    },
    onSettled: () => {
      // ensure sync with server
      utils.post.getByOwner.invalidate({ ownerId: userId });
    },
  });

  const handleEdit = (postId: number) => {
    openEditModal(postId);
  };

  const handleCreate = () => {
    openCreateModal();
  };

  const handleDelete = (postId: number, postTitle: string) => {
    setPostToDelete({ id: postId, title: postTitle });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      deleteMutation.mutate({ id: postToDelete.id, ownerId: userId });
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const handleModalClose = () => {
    closeModal();
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-50 via-cream-50 to-brown-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div className="animate-fade-in">
            <h1 className="flex items-center text-5xl font-serif font-bold text-royal-900 dark:text-royal-100 gap-3">
              <LayoutDashboard className="h-10 w-10 text-royal-700 dark:text-royal-400" />
              <span>
                My{" "}
                <span className="bg-gradient-to-r from-royal-700 via-royal-600 to-brown-700 dark:from-royal-400 dark:via-royal-300 dark:to-brown-400 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </span>
            </h1>
            <p className="mt-2 text-lg text-royal-700 dark:text-royal-300">
              Manage your blog posts and content
            </p>
          </div>
          <Button
            onClick={handleCreate}
            variant="luxury"
            size="lg"
            className="animate-slide-up"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Post
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-royal-600 border-r-transparent"></div>
            <p className="mt-6 text-royal-700 text-lg">Loading posts...</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="card-luxury hover:scale-105 transition-all duration-300 hover:shadow-royal-lg"
              >
                <CardContent className="p-6 space-y-4">
                  {post.featuredImage && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant={post.published ? "default" : "secondary"}
                      className={
                        post.published
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }
                    >
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-royal-900 line-clamp-2">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-royal-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map((cat) => (
                        <Badge key={cat.id} variant="luxury">
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="text-sm text-royal-600 pt-2 border-t border-royal-200">
                    Created: {new Date(post.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2 pt-2">
                    {post.published && (
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <BookOpen className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    )}
                    <Button
                      onClick={() => handleEdit(post.id)}
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(post.id, post.title)}
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
              <BookOpen className="mx-auto h-16 w-16 text-royal-400 mb-4" />
              <h3 className="text-xl font-serif font-semibold text-royal-900 mb-2">
                No posts yet
              </h3>
              <p className="text-royal-600 mb-6">
                Start sharing your thoughts by creating your first post!
              </p>
              <Button onClick={handleCreate} variant="default" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {isModalOpen && (
        <PostModal postId={editingPostId} onClose={handleModalClose} />
      )}

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Post"
        cancelText="Cancel"
        type="danger"
        isLoading={deleteMutation.isPending}
      />

      <Footer />
    </div>
  );
}
