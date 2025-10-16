"use client";

import { trpc } from "@/lib/trpc/client";
import { useState, useEffect, useRef, useCallback } from "react";
import { getOrCreateUserId } from "@/lib/user-identity";
import { usePostStore } from "@/lib/store/post-store";
import { toast } from "sonner";
import { X, Eye, Edit, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import {
  calculatePostStats,
  formatReadingTime,
  formatWordCount,
} from "@/lib/utils/post-stats";
import Image from "next/image";
import { LexicalEditor, LexicalReadOnly } from "@/components/lexical";
import {
  lexicalToPlainText,
  plainTextToLexical,
  isLexicalJSON,
  getLexicalWordCount,
} from "@/lib/utils/lexical-utils";
import {
  uploadImage,
  deleteImage,
  isFirebaseStorageUrl,
  validateImageFile,
} from "@/lib/firebase";

interface PostModalProps {
  postId: number | null;
  onClose: () => void;
}

export default function PostModal({ postId, onClose }: PostModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchYRef = useRef<number | null>(null);
  const contentRef = useRef<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [isPreview, setIsPreview] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { setCreating, setUpdating } = usePostStore();
  const userId = getOrCreateUserId();

  const { data: categories } = trpc.category.getAll.useQuery();
  const { data: existingPost } = trpc.post.getById.useQuery(
    { id: postId! },
    { enabled: !!postId }
  );

  const utils = trpc.useUtils();

  const getContentStats = () => {
    if (isLexicalJSON(content)) {
      const wordCount = getLexicalWordCount(content);
      const plainText = lexicalToPlainText(content);
      const charCount = plainText.length;
      const readingTimeMinutes = Math.ceil(wordCount / 200);
      return { wordCount, charCount, readingTimeMinutes };
    }
    return calculatePostStats(content);
  };

  const stats = getContentStats();

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
      const existingContent = existingPost.content;
      if (!isLexicalJSON(existingContent)) {
        const lexicalContent = plainTextToLexical(existingContent);
        setContent(lexicalContent);
        contentRef.current = lexicalContent;
      } else {
        setContent(existingContent);
        contentRef.current = existingContent;
      }
      setExcerpt(existingPost.excerpt || "");
      setPublished(existingPost.published);
      setFeaturedImage(existingPost.featuredImage || "");
      setSelectedCategories(existingPost.categories?.map((c) => c.id) || []);
      setIsPreview(false);
    }
  }, [existingPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const finalContent = contentRef.current || content;

    if (!finalContent.trim()) {
      toast.error("Please enter some content");
      return;
    }

    try {
      if (postId) {
        await updateMutation.mutateAsync({
          id: postId,
          ownerId: userId,
          title: title.trim(),
          content: finalContent,
          excerpt: excerpt.trim() || undefined,
          featuredImage: featuredImage || undefined,
          published,
          categoryIds: selectedCategories,
        });
      } else {
        await createMutation.mutateAsync({
          title: title.trim(),
          content: finalContent,
          excerpt: excerpt.trim() || undefined,
          featuredImage: featuredImage || undefined,
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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const validationError = validateImageFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      try {
        setIsUploadingImage(true);
        toast.loading("Uploading image...", { id: "upload-image" });

        if (featuredImage && isFirebaseStorageUrl(featuredImage)) {
          await deleteImage(featuredImage).catch(() => {});
        }

        const downloadURL = await uploadImage(file, "blog-images");
        setFeaturedImage(downloadURL);

        toast.success("Image uploaded successfully!", { id: "upload-image" });
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("Failed to upload image. Please try again.", {
          id: "upload-image",
        });
      } finally {
        setIsUploadingImage(false);
      }
    },
    [featuredImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5242880,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        setIsPreview((prev) => !prev);
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-6xl h-[90vh] sm:h-[85vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-royal-lg dark:shadow-royal border border-royal-200 dark:border-royal-800 animate-slide-up"
        data-lenis-prevent
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-b border-royal-200 dark:border-royal-800">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="text-xl sm:text-2xl font-serif font-bold truncate text-royal-900 dark:text-royal-100">
                  {postId ? "Edit Post" : "Create New Post"}
                </h3>
                {/* Post Stats */}
                <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{formatWordCount(stats.wordCount)} words</span>
                  <span>•</span>
                  <span>{formatReadingTime(stats.readingTimeMinutes)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Preview Toggle */}
                <button
                  type="button"
                  onClick={() => setIsPreview(!isPreview)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isPreview
                      ? "bg-royal-700 dark:bg-royal-600 text-white"
                      : "bg-royal-100 dark:bg-royal-800/40 hover:bg-royal-200 dark:hover:bg-royal-800/60 text-royal-700 dark:text-royal-300"
                  }`}
                  title="Toggle Preview (Ctrl+P)"
                >
                  {isPreview ? (
                    <>
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline text-sm">Edit</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline text-sm">Preview</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-royal-400 dark:text-royal-500 hover:text-royal-600 dark:hover:text-royal-300 transition-colors rounded-full hover:bg-royal-100 dark:hover:bg-royal-800/30 p-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-2 sm:py-3 pr-2 sm:pr-3 modal-scroll [touch-action:pan-y]"
            data-lenis-prevent
            onWheelCapture={(e) => {
              e.stopPropagation();
              if (scrollRef.current) {
                scrollRef.current.scrollTop += e.deltaY;
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
                if (e.cancelable) e.preventDefault();
              }
            }}
            onTouchEndCapture={() => {
              touchYRef.current = null;
            }}
          >
            <style jsx global>{`
              .modal-scroll {
                scrollbar-width: thin;
                scrollbar-color: rgba(17, 24, 39, 0.35) transparent;
                -webkit-overflow-scrolling: touch;
              }
              .modal-scroll::-webkit-scrollbar {
                width: 8px;
              }
              .modal-scroll::-webkit-scrollbar-track {
                background: transparent;
              }
              .modal-scroll::-webkit-scrollbar-thumb {
                background-color: rgba(17, 24, 39, 0.35);
                border-radius: 9999px;
                border: 2px solid transparent;
                background-clip: padding-box;
              }
              .modal-scroll:hover::-webkit-scrollbar-thumb {
                background-color: rgba(17, 24, 39, 0.5);
              }
            `}</style>

            {isPreview ? (
              /* Preview Mode */
              <div className="space-y-6">
                {/* Featured Image */}
                {featuredImage && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src={featuredImage}
                      alt={title || "Post image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Title */}
                <h1 className="text-4xl font-serif font-bold">
                  {title || "Untitled Post"}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground pb-4 border-b border-border">
                  <span>{formatWordCount(stats.wordCount)} words</span>
                  <span>•</span>
                  <span>{formatReadingTime(stats.readingTimeMinutes)}</span>
                  <span>•</span>
                  <span>{published ? "Published" : "Draft"}</span>
                </div>

                {/* Excerpt */}
                {excerpt && (
                  <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4">
                    {excerpt}
                  </p>
                )}

                {/* Categories */}
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {categories
                      ?.filter((c) => selectedCategories.includes(c.id))
                      .map((cat) => (
                        <span
                          key={cat.id}
                          className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                        >
                          {cat.name}
                        </span>
                      ))}
                  </div>
                )}

                {/* Content - Preview with Lexical Read-Only */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {content ? (
                    <LexicalReadOnly content={content} />
                  ) : (
                    <p className="text-muted-foreground italic">
                      *No content yet*
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-royal-900 dark:text-royal-100">
                    Featured Image (Optional)
                  </label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isUploadingImage
                        ? "opacity-50 cursor-not-allowed"
                        : isDragActive
                        ? "border-royal-500 dark:border-royal-400 bg-royal-100/50 dark:bg-royal-800/20"
                        : "border-royal-300 dark:border-royal-700 hover:border-royal-500 dark:hover:border-royal-400 bg-royal-50/50 dark:bg-royal-900/20"
                    }`}
                  >
                    <input {...getInputProps()} disabled={isUploadingImage} />
                    {isUploadingImage ? (
                      <div className="space-y-2">
                        <div className="animate-spin mx-auto h-10 w-10 border-4 border-royal-500 dark:border-royal-400 border-t-transparent rounded-full" />
                        <p className="text-sm text-muted-foreground">
                          Uploading to Firebase Storage...
                        </p>
                      </div>
                    ) : featuredImage ? (
                      <div className="space-y-3">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-royal-100 dark:bg-royal-900">
                          <Image
                            src={featuredImage}
                            alt="Featured"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Click or drag to replace image
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {isDragActive
                            ? "Drop image here"
                            : "Click or drag image to upload"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF, WebP up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-royal-900 dark:text-royal-100">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-royal-200 dark:border-royal-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-500 dark:focus:ring-royal-400 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-royal-900 dark:text-royal-100 placeholder:text-royal-400 dark:placeholder:text-royal-500"
                    placeholder="Enter an engaging post title"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-royal-900 dark:text-royal-100">
                    Excerpt
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-royal-200 dark:border-royal-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-500 dark:focus:ring-royal-400 focus:border-transparent transition-all resize-none bg-white dark:bg-gray-800 text-royal-900 dark:text-royal-100 placeholder:text-royal-400 dark:placeholder:text-royal-500"
                    placeholder="Brief description (optional)"
                  />
                </div>

                {/* Content - Lexical Rich Text Editor */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-royal-900 dark:text-royal-100">
                    Content * (Rich Text Editor)
                  </label>
                  <LexicalEditor
                    value={content}
                    onChange={(newContent) => {
                      contentRef.current = newContent;
                      setContent(newContent);
                    }}
                    placeholder="Start writing your post..."
                    minHeight="400px"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Tip: Use the toolbar for formatting, or markdown shortcuts
                    like **bold**, *italic*, # headings
                  </p>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-royal-900 dark:text-royal-100">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories?.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border transform hover:scale-105 ${
                          selectedCategories.includes(category.id)
                            ? "bg-royal-800 dark:bg-royal-700 text-white border-royal-800 dark:border-royal-700 shadow-md"
                            : "bg-royal-100 dark:bg-royal-800/40 text-royal-800 dark:text-royal-200 border-royal-200 dark:border-royal-700 hover:bg-royal-200 dark:hover:bg-royal-800/60"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Publish Checkbox */}
                <div className="flex items-center bg-royal-50 dark:bg-royal-900/20 rounded-lg p-3 border border-royal-200 dark:border-royal-800">
                  <input
                    type="checkbox"
                    id="published"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-4 w-4 text-royal-700 dark:text-royal-400 focus:ring-royal-500 dark:focus:ring-royal-400 border-royal-300 dark:border-royal-700 rounded"
                  />
                  <label
                    htmlFor="published"
                    className="ml-2 block text-sm font-medium text-royal-900 dark:text-royal-100"
                  >
                    Publish immediately
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 bg-gradient-to-r from-royal-50 to-brown-50 dark:from-royal-950 dark:to-brown-950 px-4 sm:px-6 py-3 border-t border-royal-200 dark:border-royal-800 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border-2 border-royal-300 dark:border-royal-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-semibold text-royal-700 dark:text-royal-300 hover:bg-royal-50 dark:hover:bg-royal-800/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-500 dark:focus:ring-royal-400 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border border-transparent shadow-md px-4 py-2 bg-royal-800 dark:bg-royal-700 text-sm font-semibold text-white hover:bg-royal-900 dark:hover:bg-royal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-500 dark:focus:ring-royal-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
