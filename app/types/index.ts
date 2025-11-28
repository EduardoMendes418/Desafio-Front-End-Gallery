// types.ts
export interface Image {
  id: number;
  src: string;
  thumbnail: string;
  author: string;
  alt: string;
  tags: string[];
  category: string;
  likes: number;
  views: number;
  isFavorite: boolean;
  createdAt: string;
  resolution: string;
  size: string;
}

export interface GalleryFilters {
  category: string;
  tags: string[];
  author: string;
  sortBy: 'newest' | 'oldest' | 'popular' | 'likes';
  searchQuery: string;
}

export interface GalleryState {
  images: Image[];
  filteredImages: Image[];
  favorites: Image[];
  history: Image[];
  loading: boolean;
  error: string | null;
  selectedImage: Image | null;
  isModalOpen: boolean;
  filters: GalleryFilters;
  categories: string[];
  tags: string[];
  
  fetchImages: (count?: number) => Promise<void>;
  setSelectedImage: (image: Image) => void;
  closeModal: () => void;
  toggleFavorite: (imageId: number) => void;
  addToHistory: (image: Image) => void;
  updateFilters: (filters: Partial<GalleryFilters>) => void;
  clearFilters: () => void;
  searchImages: (query: string) => void;
  addImage: (image: Omit<Image, 'id'>) => void;
  deleteImage: (imageId: number) => void;
  updateImage: (imageId: number, updates: Partial<Image>) => void;
  getImageStats: () => {
    total: number;
    favorites: number;
    categories: number;
    totalViews: number;
    totalLikes: number;
  };
}

export interface ImageCardProps {
  image: Image;
  onImageClick: (image: Image) => void;
  onToggleFavorite: (imageId: number) => void;
  showActions?: boolean;
}

export interface ImageGridProps {
  images: Image[];
  loading: boolean;
  onImageClick: (image: Image) => void;
  selectedImage: Image | null;
  isModalOpen: boolean;
  onCloseModal: () => void;
  onToggleFavorite: (imageId: number) => void;
}

export interface HeaderProps {
  onRefresh: () => void;
  onSearch: (query: string) => void;
  onUploadClick: () => void;
  loading: boolean;
  searchQuery: string;
  stats: {
    total: number;
    favorites: number;
  };
}

export interface FilterSidebarProps {
  filters: GalleryFilters;
  categories: string[];
  tags: string[];
  onFiltersChange: (filters: Partial<GalleryFilters>) => void;
  onClearFilters: () => void;
}

export interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (image: Omit<Image, 'id'>) => void;
}