export interface Image {
  size: any;
  date: any;
  id: number;
  src: string;
  title: string;
  description: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
  uploadDate: Date;
  photographer: string;
  camera: string;
  lens: string;
  settings: string;
  width?: number;
  height?: number;
}

export interface Album {
  id: number;
  name: string;
  coverImage?: string;
  images: Image[];
  createdAt: Date;
  updatedAt: Date;
}

export type SortOption = 'latest' | 'oldest' | 'liked';

export interface AppState {
  images: Image[];
  albums: Album[];
  searchTerm: string;
  sortBy: SortOption;
  selectedImage: Image | null;
  isModalOpen: boolean;
  isLoading: boolean;
}

export interface GalleryItemProps {
  image: Image;
  onClick: (image: Image) => void;
  onLike: (id: number) => void;
}

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onUpload: () => void;
}

export interface ImageModalProps {
  image: Image | null;
  isOpen: boolean;
  onClose: () => void;
}