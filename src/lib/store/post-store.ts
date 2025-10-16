import { create } from "zustand";

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

interface PostStore {
  // Modal state
  isModalOpen: boolean;
  editingPostId: number | null;
  
  // Category modal state
  isCategoryModalOpen: boolean;
  editingCategoryId: number | null;
  
  // Loading states
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Optimistic updates
  optimisticPosts: Post[];
  
  // Actions for post modal
  openCreateModal: () => void;
  openEditModal: (postId: number) => void;
  closeModal: () => void;
  
  // Actions for category modal
  openCreateCategoryModal: () => void;
  openEditCategoryModal: (categoryId: number) => void;
  closeCategoryModal: () => void;
  
  // Loading actions
  setCreating: (value: boolean) => void;
  setUpdating: (value: boolean) => void;
  setDeleting: (value: boolean) => void;
  
  // Optimistic update actions
  addOptimisticPost: (post: Post) => void;
  removeOptimisticPost: (postId: number) => void;
  updateOptimisticPost: (postId: number, updates: Partial<Post>) => void;
  clearOptimisticPosts: () => void;
}

export const usePostStore = create<PostStore>((set) => ({
  // Initial state
  isModalOpen: false,
  editingPostId: null,
  isCategoryModalOpen: false,
  editingCategoryId: null,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  optimisticPosts: [],
  
  // Post modal actions
  openCreateModal: () => set({ isModalOpen: true, editingPostId: null }),
  openEditModal: (postId) => set({ isModalOpen: true, editingPostId: postId }),
  closeModal: () => set({ isModalOpen: false, editingPostId: null }),
  
  // Category modal actions
  openCreateCategoryModal: () => set({ isCategoryModalOpen: true, editingCategoryId: null }),
  openEditCategoryModal: (categoryId) => set({ isCategoryModalOpen: true, editingCategoryId: categoryId }),
  closeCategoryModal: () => set({ isCategoryModalOpen: false, editingCategoryId: null }),
  
  // Loading actions
  setCreating: (value) => set({ isCreating: value }),
  setUpdating: (value) => set({ isUpdating: value }),
  setDeleting: (value) => set({ isDeleting: value }),
  
  // Optimistic update actions
  addOptimisticPost: (post) =>
    set((state) => ({
      optimisticPosts: [...state.optimisticPosts, post],
    })),
  removeOptimisticPost: (postId) =>
    set((state) => ({
      optimisticPosts: state.optimisticPosts.filter((p) => p.id !== postId),
    })),
  updateOptimisticPost: (postId, updates) =>
    set((state) => ({
      optimisticPosts: state.optimisticPosts.map((p) =>
        p.id === postId ? { ...p, ...updates } : p
      ),
    })),
  clearOptimisticPosts: () => set({ optimisticPosts: [] }),
}));
