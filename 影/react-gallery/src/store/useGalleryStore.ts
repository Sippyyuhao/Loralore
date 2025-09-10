import { create } from 'zustand';
import type { Image, SortOption, AppState } from '../types';

interface GalleryStore extends AppState {
  // Actions
  setImages: (images: Image[]) => void;
  addImage: (image: Image) => void;
  removeImage: (id: number) => void;
  toggleLike: (id: number) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: SortOption) => void;
  setSelectedImage: (image: Image | null) => void;
  setModalOpen: (isOpen: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  
  // Computed values
  filteredImages: Image[];
}

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  // Initial state
  images: [],
  albums: [],
  searchTerm: '',
  sortBy: 'latest',
  selectedImage: null,
  isModalOpen: false,
  isLoading: false,
  filteredImages: [],

  // Actions
  setImages: (images) => {
    set({ images });
    // Update filtered images when images change
    const state = get();
    set({ filteredImages: getFilteredImages(state) });
  },
  
  addImage: (image) => {
    set((state) => {
      const newImages = [image, ...state.images];
      const newState = { ...state, images: newImages };
      return {
        images: newImages,
        filteredImages: getFilteredImages(newState)
      };
    });
  },
  
  removeImage: (id) => {
    set((state) => {
      const newImages = state.images.filter(img => img.id !== id);
      const newState = { ...state, images: newImages };
      return {
        images: newImages,
        filteredImages: getFilteredImages(newState)
      };
    });
  },
  
  toggleLike: (id) => {
    set((state) => {
      const newImages = state.images.map(img => 
        img.id === id ? { ...img, isLiked: !img.isLiked, likes: img.isLiked ? img.likes - 1 : img.likes + 1 } : img
      );
      const newState = { ...state, images: newImages };
      return {
        images: newImages,
        filteredImages: getFilteredImages(newState)
      };
    });
  },
  
  setSearchTerm: (term) => {
    set((state) => {
      const newState = { ...state, searchTerm: term };
      return {
        searchTerm: term,
        filteredImages: getFilteredImages(newState)
      };
    });
  },
  
  setSortBy: (sort) => {
    set((state) => {
      const newState = { ...state, sortBy: sort };
      return {
        sortBy: sort,
        filteredImages: getFilteredImages(newState)
      };
    });
  },
  
  setSelectedImage: (image) => set({ selectedImage: image }),
  
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  
  setLoading: (isLoading) => set({ isLoading })
}));

// Helper function to filter and sort images
function getFilteredImages(state: { images: Image[]; searchTerm: string; sortBy: SortOption }): Image[] {
  const { images, searchTerm, sortBy } = state;
  let filtered = [...images];

  // Filter by search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(img => 
      img.title.toLowerCase().includes(term) ||
      img.description.toLowerCase().includes(term) ||
      img.photographer.toLowerCase().includes(term) ||
      img.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }

  // Sort images
  switch (sortBy) {
    case 'latest':
      filtered.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
      break;
    case 'oldest':
      filtered.sort((a, b) => a.uploadDate.getTime() - b.uploadDate.getTime());
      break;
    case 'liked':
      filtered.sort((a, b) => b.likes - a.likes);
      break;
  }

  return filtered;
}