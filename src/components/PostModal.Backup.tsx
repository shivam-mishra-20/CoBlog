"use client";

import { trpc } from "@/lib/trpc/client";
import { useState, useEffect, useRef } from "react";
import { getOrCreateUserId } from "@/lib/user-identity";
import { usePostStore } from "@/lib/store/post-store";
import { toast } from "sonner";
import { X } from "lucide-react";

interface PostModalProps {
  postId: number | null;
  onClose: () => void;
}

export default function PostModal({ postId, onClose }: PostModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchYRef = useRef<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const { setCreating, setUpdating } = usePostStore();
  const userId = getOrCreateUserId();

  const { data: categories } = trpc.category.getAll.useQuery();
  const { data: existingPost } = trpc.post.getById.useQuery(
    { id: postId! },
    { enabled: !!postId }
  );

  const utils = trpc.useUtils();

  const createMutation = trpc.post.create.useMutation({
    onMutate: () => {
      setCreating(true);
      toast.loading("Creating post...", { id: "create-post" });
    },
    onSuccess: () => {
      setCreating(false);
      toast.success("Post created successfully!", { id: "create-post" });
      utils.post.getByOwner.invalidate({ ownerId: userId });
      utils.post.getAll.invalidate();
      onClose();
    },
    onError: (err) => {
      setCreating(false);
      toast.error(err.message || "Failed to create post", {
        id: "create-post",
      });
    },
  });

  const updateMutation = trpc.post.update.useMutation({
    onMutate: () => {
      setUpdating(true);
      toast.loading("Updating post...", { id: "update-post" });
    },
    onSuccess: () => {
      setUpdating(false);
      toast.success("Post updated successfully!", { id: "update-post" });
      utils.post.getByOwner.invalidate({ ownerId: userId });
      utils.post.getAll.invalidate();
      utils.post.getById.invalidate({ id: postId! });
      onClose();
    },
    onError: (err) => {
      setUpdating(false);
      toast.error(err.message || "Failed to update post", {
        id: "update-post",
      });
    },
  });

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setContent(existingPost.content);
      setExcerpt(existingPost.excerpt || "");
      setPublished(existingPost.published);
      setSelectedCategories(existingPost.categories?.map((c) => c.id) || []);
    }
  }, [existingPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (postId) {
        await updateMutation.mutateAsync({
          id: postId,
          ownerId: userId,
          title,
          content,
          excerpt: excerpt || undefined,
          published,
          categoryIds: selectedCategories,
        });
      } else {
        await createMutation.mutateAsync({
          title,
          content,
          excerpt: excerpt || undefined,
          published,
          categoryIds: selectedCategories,
          ownerId: userId,
        });
      }
    } catch (err) {
      console.error("Error saving post:", err);
    }
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-royal-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container*/}
      <div
        className="relative w-full max-w-4xl h-[90vh] sm:h-[85vh] flex flex-col bg-white rounded-2xl shadow-royal-2xl border border-royal-200 animate-slide-up"
        data-lenis-prevent
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header*/}
          <div className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-b border-royal-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-royal-900 truncate">
                {postId ? "Edit Post" : "Create New Post"}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-royal-400 hover:text-royal-600 transition-colors rounded-full hover:bg-royal-100 p-2 ml-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Area (visible slim scrollbar + wheel/touch pan) */}
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-2 sm:py-3 pr-2 sm:pr-3 modal-scroll [touch-action:pan-y]"
            data-lenis-prevent
            onWheelCapture={(e) => {
              e.stopPropagation();
              // Force scroll within the modal body even if a global smoother is active
              if (scrollRef.current) {
                scrollRef.current.scrollTop += e.deltaY;
                // Only call preventDefault when the event is cancelable (not passive)
                if (e.cancelable) e.preventDefault();
              }
            }}
            onTouchStartCapture={(e) => {
              touchYRef.current = e.touches?.[0]?.clientY ?? null;
            }}
            onTouchMoveCapture={(e) => {
              e.stopPropagation();
              const currentY = e.touches?.[0]?.clientY;
              if (scrollRef.current && typeof currentY === "number") {
                const prevY = touchYRef.current ?? currentY;
                const dy = prevY - currentY;
                scrollRef.current.scrollTop += dy;
                touchYRef.current = currentY;
                // Only call preventDefault when the event is cancelable (not passive)
                if (e.cancelable) e.preventDefault();
              }
            }}
            onTouchEndCapture={() => {
              touchYRef.current = null;
            }}
          >
            {/* Slim scrollbar styling (Firefox + WebKit) */}
            <style jsx global>{`
              .modal-scroll {
                scrollbar-width: thin; /* Firefox */
                scrollbar-color: rgba(17, 24, 39, 0.35) transparent; /* thumb, track */
                -webkit-overflow-scrolling: touch; /* iOS momentum */
              }
              .modal-scroll::-webkit-scrollbar {
                width: 8px;
              }
              .modal-scroll::-webkit-scrollbar-track {
                background: transparent;
              }
              .modal-scroll::-webkit-scrollbar-thumb {
                background-color: rgba(17, 24, 39, 0.35); /* neutral-900/35 */
                border-radius: 9999px;
                border: 2px solid transparent; /* creates padding */
                background-clip: padding-box;
              }
              .modal-scroll:hover::-webkit-scrollbar-thumb {
                background-color: rgba(17, 24, 39, 0.5);
              }
            `}</style>
            <div className="space-y-2 sm:space-y-3">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-royal-900 mb-1 sm:mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-royal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent transition-all text-royal-900 text-sm sm:text-base"
                  placeholder="Enter an engaging post title"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-royal-900 mb-1 sm:mb-2">
                  Excerpt
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-royal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent transition-all text-royal-900 resize-none text-sm sm:text-base"
                  placeholder="Brief description (optional)"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-royal-900 mb-1 sm:mb-2">
                  Content * (Markdown supported)
                </label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-royal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent transition-all font-mono text-xs sm:text-sm text-royal-900 resize-none"
                  placeholder="Write your post content in Markdown..."
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-royal-900 mb-1.5">
                  Categories
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                  {categories?.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium transition-all transform hover:scale-105 ${
                        selectedCategories.includes(category.id)
                          ? "bg-royal-600 text-white shadow-royal"
                          : "bg-royal-100 text-royal-700 hover:bg-royal-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center bg-royal-50 rounded-lg p-2 sm:p-3 border border-royal-200">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 text-royal-600 focus:ring-royal-500 border-royal-300 rounded"
                />
                <label
                  htmlFor="published"
                  className="ml-2 block text-xs font-medium text-royal-900"
                >
                  Publish immediately
                </label>
              </div>
            </div>
          </div>

          {/* Footer*/}
          <div className="flex-shrink-0 bg-gradient-to-r from-royal-50 to-brown-50 px-4 sm:px-6 py-2 sm:py-3 border-t border-royal-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border-2 border-royal-300 shadow-sm px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-xs font-semibold text-royal-700 hover:bg-royal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-500 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border border-transparent shadow-royal px-3 sm:px-4 py-1.5 sm:py-2 bg-royal-900 text-xs font-semibold text-white hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : postId
                ? "Update Post"
                : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
