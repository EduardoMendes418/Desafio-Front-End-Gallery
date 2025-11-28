// page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Container, Box, Fab, Grid, Typography } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import Header from './components/Layout/Header';
import FilterSidebar from './components/Layout/FilterSidebar';
import ImageGrid from './components/Gallery/ImageGrid';
import UploadModal from './components/Gallery/UploadModal';
import { useGalleryStore } from './store';


export default function Home(): JSX.Element {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    images,
    filteredImages,
    loading,
    selectedImage,
    isModalOpen,
    filters,
    categories,
    tags,
    fetchImages,
    setSelectedImage,
    closeModal,
    toggleFavorite,
    updateFilters,
    clearFilters,
    searchImages,
    addImage,
    getImageStats
  } = useGalleryStore();

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  useEffect(() => {
    if (images.length === 0) {
      fetchImages();
    }
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchImages, images.length]);

  const handleRefresh = () => fetchImages(8);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const stats = getImageStats();


  if (!isClient) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Header 
          onRefresh={handleRefresh}
          onSearch={searchImages}
          onUploadClick={() => setUploadModalOpen(true)}
          loading={loading}
          searchQuery={filters.searchQuery}
          stats={{ total: 0, favorites: 0 }}
        />
        <Container maxWidth="xl" sx={{ py: 4, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography>Carregando...</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header 
        onRefresh={handleRefresh}
        onSearch={searchImages}
        onUploadClick={() => setUploadModalOpen(true)}
        loading={loading}
        searchQuery={filters.searchQuery}
        stats={stats}
      />
      
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4, 
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Grid container spacing={3} sx={{ flex: 1 }}>
          {/* Sidebar de Filtros */}
          <Grid item xs={12} lg={3}>
            <FilterSidebar
              filters={filters}
              categories={categories}
              tags={tags}
              onFiltersChange={updateFilters}
              onClearFilters={clearFilters}
            />
          </Grid>

          {/* Conteúdo Principal */}
          <Grid item xs={12} lg={9}>
            <ImageGrid
              images={filteredImages}
              loading={loading}
              onImageClick={setSelectedImage}
              selectedImage={selectedImage}
              isModalOpen={isModalOpen}
              onCloseModal={closeModal}
              onToggleFavorite={toggleFavorite}
            />
          </Grid>
        </Grid>

        {/* Footer com Estatísticas */}
        <Box 
          component="footer"
          sx={{
            mt: 6,
            pt: 4,
            pb: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            color="#003580" 
            gutterBottom
          >
            Gallery Pro Platform
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            Sistema avançado de gerenciamento de imagens • 
            Total: {stats.total} imagens •
            {stats.totalLikes} curtidas •
            {stats.totalViews} visualizações
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ mt: 1, display: 'block' }}
          >
            Desenvolvido com Next.js, Material-UI e TypeScript
          </Typography>
        </Box>
      </Container>

      {/* Botão Voltar ao Topo */}
      {showScrollTop && (
        <Fab
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            backgroundColor: '#003580',
            color: 'white',
            '&:hover': {
              backgroundColor: '#005a9e',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease'
          }}
          size="medium"
        >
          <KeyboardArrowUp />
        </Fab>
      )}

      {/* Modal de Upload */}
      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={addImage}
      />
    </Box>
  );
}