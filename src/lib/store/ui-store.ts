import { create } from "zustand";

interface UIState {
  // Modal states
  isPostModalOpen: boolean;
  isCategoryModalOpen: boolean;
  editingPostId: number | null;
  editingCategoryId: number | null;
  
  // Filter states
  selectedCategoryId: number | null;
  showOnlyPublished: boolean;
  
  // Actions
  openPostModal: (postId?: number) => void;
  closePostModal: () => void;
  openCategoryModal: (categoryId?: number) => void;
  closeCategoryModal: () => void;
  setSelectedCategory: (categoryId: number | null) => void;
  setShowOnlyPublished: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isPostModalOpen: false,
  isCategoryModalOpen: false,
  editingPostId: null,
  editingCategoryId: null,
  selectedCategoryId: null,
  showOnlyPublished: true,
  
  // Actions
  openPostModal: (postId) =>
    set({ isPostModalOpen: true, editingPostId: postId || null }),
  closePostModal: () =>
    set({ isPostModalOpen: false, editingPostId: null }),
  openCategoryModal: (categoryId) =>
    set({ isCategoryModalOpen: true, editingCategoryId: categoryId || null }),
  closeCategoryModal: () =>
    set({ isCategoryModalOpen: false, editingCategoryId: null }),
  setSelectedCategory: (categoryId) =>
    set({ selectedCategoryId: categoryId }),
  setShowOnlyPublished: (show) =>
    set({ showOnlyPublished: show }),
}));
