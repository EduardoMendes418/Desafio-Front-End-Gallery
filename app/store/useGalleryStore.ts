import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GalleryState, Image, GalleryFilters } from '../types';

const DEFAULT_IMAGE_COUNT = 12;
const HISTORY_LIMIT = 10;
const STORAGE_NAME = 'gallery-storage';

const DEFAULT_FILTERS: GalleryFilters = {
  category: '',
  tags: [],
  author: '',
  sortBy: 'newest', 
  searchQuery: ''
};

const IMAGE_CONFIG = {
  categories: ['Natureza', 'Cidades', 'Pessoas'] as const,
  tags: ['premium', 'nova', 'popular'] as const,
  baseUrl: 'https://picsum.photos/seed/picsum',
  sizes: {
    main: '800/600',
    thumbnail: '300/300'
  }
} as const;

const sortImages = (images: Image[], sortBy: GalleryFilters['sortBy']): Image[] => {
  const sorted = [...images];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'oldest':
      return sorted.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case 'popular':
      return sorted.sort((a, b) => b.views - a.views);
    case 'likes':
      return sorted.sort((a, b) => b.likes - a.likes);
    default:
      return sorted;
  }
};

const generateImage = (id: number): Image => {
  const randomCategory = IMAGE_CONFIG.categories[
    Math.floor(Math.random() * IMAGE_CONFIG.categories.length)
  ];
  const randomTag = IMAGE_CONFIG.tags[
    Math.floor(Math.random() * IMAGE_CONFIG.tags.length)
  ];

  return {
    id,
    src: `${IMAGE_CONFIG.baseUrl}${id}/${IMAGE_CONFIG.sizes.main}`,
    thumbnail: `${IMAGE_CONFIG.baseUrl}${id}/${IMAGE_CONFIG.sizes.thumbnail}`,
    author: `Fotógrafo ${id}`,
    alt: `Imagem premium ${id}`,
    tags: [randomTag],
    category: randomCategory,
    likes: Math.floor(Math.random() * 1000),
    views: Math.floor(Math.random() * 5000),
    isFavorite: false,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    resolution: '800x600',
    size: `${Math.floor(Math.random() * 5000) + 1000} KB`
  };
};

const matchesSearchQuery = (image: Image, query: string): boolean => {
  const lowerQuery = query.toLowerCase();
  return (
    image.author.toLowerCase().includes(lowerQuery) ||
    image.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    image.category.toLowerCase().includes(lowerQuery)
  );
};

const matchesFilters = (image: Image, filters: GalleryFilters): boolean => {
  const matchesCategory = !filters.category || image.category === filters.category;
  const matchesTags = filters.tags.length === 0 || 
    filters.tags.some(tag => image.tags.includes(tag));
  const matchesAuthor = !filters.author || image.author === filters.author;
  const matchesSearch = !filters.searchQuery || matchesSearchQuery(image, filters.searchQuery);

  return matchesCategory && matchesTags && matchesAuthor && matchesSearch;
};

const applyFiltersAndSorting = (
  images: Image[], 
  filters: GalleryFilters
): Image[] => {
  const filtered = images.filter(image => matchesFilters(image, filters));
  return sortImages(filtered, filters.sortBy);
};

const getNextImageId = (images: Image[]): number => {
  return images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : 1;
};

const updateImageInArray = (
  images: Image[], 
  imageId: number, 
  updates: Partial<Image>
): Image[] => {
  return images.map(img => 
    img.id === imageId ? { ...img, ...updates } : img
  );
};

const addToHistory = (history: Image[], image: Image): Image[] => {
  const filteredHistory = history.filter(img => img.id !== image.id);
  return [image, ...filteredHistory].slice(0, HISTORY_LIMIT);
};

const useGalleryStore = create<GalleryState>()(
  persist(
    (set, get) => ({
      images: [],
      filteredImages: [],
      favorites: [],
      history: [],
      loading: false,
      error: null,
      selectedImage: null,
      isModalOpen: false,
      filters: DEFAULT_FILTERS, 
      categories: ['Natureza', 'Cidades', 'Pessoas', 'Arte', 'Tecnologia', 'Animais'],
      tags: ['premium', 'nova', 'popular', 'destacada', 'exclusiva'],

      fetchImages: async (count = DEFAULT_IMAGE_COUNT): Promise<void> => {
        set({ loading: true, error: null });
        
        try {
          const images = Array.from({ length: count }, (_, index) => 
            generateImage(index + 1)
          );
          
          const { filters } = get();
          const filteredImages = applyFiltersAndSorting(images, filters);
          
          set({ images, filteredImages, loading: false });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Erro ao carregar imagens' 
          });
        }
      },

      setSelectedImage: (image: Image): void => {
        const state = get();
        const newHistory = addToHistory(state.history, image);
        const updatedImages = updateImageInArray(
          state.images, 
          image.id, 
          { views: image.views + 1 }
        );

        const filteredImages = applyFiltersAndSorting(updatedImages, state.filters);

        set({ 
          selectedImage: image, 
          isModalOpen: true,
          history: newHistory,
          images: updatedImages,
          filteredImages
        });
      },

      closeModal: (): void => {
        set({ isModalOpen: false, selectedImage: null });
      },

      toggleFavorite: (imageId: number): void => {
        const state = get();
        
        const updatedImages = state.images.map(image => {
          if (image.id !== imageId) return image;
          
          const isFavorite = !image.isFavorite;
          return {
            ...image,
            isFavorite,
            likes: isFavorite ? image.likes + 1 : image.likes - 1
          };
        });

        const updatedFavorites = updatedImages.filter(img => img.isFavorite);
        const filteredImages = applyFiltersAndSorting(updatedImages, state.filters);

        set({ 
          images: updatedImages,
          filteredImages,
          favorites: updatedFavorites
        });
      },

      addToHistory: (image: Image): void => {
        const state = get();
        const newHistory = addToHistory(state.history, image);
        set({ history: newHistory });
      },

      updateFilters: (newFilters: Partial<GalleryFilters>): void => {
        const state = get();
        const updatedFilters = { ...state.filters, ...newFilters };
        const filteredImages = applyFiltersAndSorting(state.images, updatedFilters);

        set({ 
          filters: updatedFilters,
          filteredImages
        });
      },

      clearFilters: (): void => {
        const state = get();
        set({ 
          filters: DEFAULT_FILTERS, 
          filteredImages: state.images
        });
      },

      searchImages: (query: string): void => {
        get().updateFilters({ searchQuery: query });
      },

      addImage: (imageData: Omit<Image, 'id'>): void => {
        const state = get();
        const newImage: Image = {
          ...imageData,
          id: getNextImageId(state.images)
        };

        const updatedImages = [newImage, ...state.images];
        const filteredImages = applyFiltersAndSorting(updatedImages, state.filters);
        
        set({ 
          images: updatedImages,
          filteredImages
        });
      },

      deleteImage: (imageId: number): void => {
        const state = get();
        const updatedImages = state.images.filter(img => img.id !== imageId);
        const updatedFavorites = state.favorites.filter(img => img.id !== imageId);
        const filteredImages = applyFiltersAndSorting(updatedImages, state.filters);
        
        set({ 
          images: updatedImages,
          filteredImages,
          favorites: updatedFavorites
        });
      },

      updateImage: (imageId: number, updates: Partial<Image>): void => {
        const state = get();
        const updatedImages = updateImageInArray(state.images, imageId, updates);
        const filteredImages = applyFiltersAndSorting(updatedImages, state.filters);
        
        set({ 
          images: updatedImages,
          filteredImages
        });
      },

      getImageStats: () => {
        const { images, favorites } = get();
        return {
          total: images.length,
          favorites: favorites.length,
          categories: new Set(images.map(img => img.category)).size,
          totalViews: images.reduce((sum, img) => sum + img.views, 0),
          totalLikes: images.reduce((sum, img) => sum + img.likes, 0)
        };
      }
    }),
    {
      name: STORAGE_NAME,
      partialize: (state) => ({ 
        images: state.images,
        favorites: state.favorites,
        history: state.history
      })
    }
  )
);

export default useGalleryStore;