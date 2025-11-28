import {
  Grid,
  Modal,
  Box,
  IconButton,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import {
  Close,
  ZoomIn,
  ZoomOut,
  Download,
  Favorite,
  Share,
  Star,
} from "@mui/icons-material";
import { useState, useMemo, useCallback, memo } from "react";
import ImageCard from "./ImageCard";
import { LoadingSpinner } from "../UI";
import { ImageGridProps, Image } from "../../types";

const modalStyles = {
  container: {
    position: "relative" as const,
    borderRadius: 4,
    boxShadow: "0 50px 100px -20px rgba(0, 0, 0, 0.8)",
    maxWidth: "95vw",
    maxHeight: "95vh",
    overflow: "hidden",
    outline: "none",
    background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  rightPanel: {
    width: { xs: "100%", md: 400 },
    padding: 4,
    background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
    borderLeft: { md: "1px solid rgba(255,255,255,0.1)" },
    display: "flex",
    flexDirection: "column" as const,
  },
} as const;

const ImageGrid = memo(function ImageGrid({
  images,
  loading,
  onImageClick,
  selectedImage,
  isModalOpen,
  onCloseModal,
  onToggleFavorite,
}: ImageGridProps) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.25, 3)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(z - 0.25, 0.5)), []);
  const handleResetZoom = useCallback(() => setZoom(1), []);


  const modalData = useMemo(() => {
    if (!selectedImage) return null;

    return {
      likes: Math.floor(Math.random() * 500) + 100,
      downloads: Math.floor(Math.random() * 200) + 50,
      rating: (Math.random() * 2 + 3).toFixed(1),
      category: ["Natureza", "Retrato", "Paisagem", "Arquitetura", "Abstrato"][
        Math.floor(Math.random() * 5)
      ],
      tags: ["premium", "profissional", "hd", "exclusivo"],
    };
  }, [selectedImage]);

  const handleDownload = useCallback(() => {
    if (!selectedImage) return;
    const link = document.createElement("a");
    link.href = selectedImage.src;
    link.download = `gallery-pro-${selectedImage.id}.jpg`;
    link.click();
  }, [selectedImage]);

  const handleShare = useCallback(() => {
    if (!navigator.share || !selectedImage) return;

    navigator.share({
      title: `Foto por ${selectedImage.author}`,
      text: "Confira esta imagem incrível da Gallery Pro!",
      url: selectedImage.src,
    });
  }, [selectedImage]);

  const imageGridItems = useMemo(() => 
    images.map((image: Image, index: number) => (
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        key={image.id}
        sx={{
          display: "flex",
          animation: `stagger 0.6s ease-out ${index * 0.1}s both`,
        }}
      >
        <ImageCard
          image={image}
          onImageClick={onImageClick}
          onToggleFavorite={onToggleFavorite}
        />
      </Grid>
    )),
    [images, onImageClick, onToggleFavorite]
  );

  const ImageModal = useMemo(() => {
    if (!isModalOpen || !selectedImage || !modalData) return null;

    return (
      <Modal
        open={isModalOpen}
        onClose={onCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(20px)",
          background: "rgba(0, 0, 0, 0.95)",
        }}
      >
        <Box sx={modalStyles.container}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            height="100%"
          >
            <MemoizedImagePreview
              zoom={zoom}
              selectedImage={selectedImage}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
              handleResetZoom={handleResetZoom}
            />
            <MemoizedImageDetails
              modalData={modalData}
              selectedImage={selectedImage}
              onCloseModal={onCloseModal}
              handleDownload={handleDownload}
              handleShare={handleShare}
            />
          </Box>
        </Box>
      </Modal>
    );
  }, [
    isModalOpen, 
    selectedImage, 
    modalData, 
    zoom, 
    onCloseModal, 
    handleZoomIn, 
    handleZoomOut, 
    handleResetZoom, 
    handleDownload, 
    handleShare
  ]);

  if (loading && images.length === 0) return <LoadingSpinner />;

  return (
    <div className="fade-in">
      {images.length === 0 && !loading && <EmptyGallery />}

      {images.length > 0 && (
        <>
          <GalleryHeader imagesCount={images.length} />
          
    
          <Grid container spacing={4}>
            {imageGridItems}
          </Grid>

          {loading && images.length > 0 && (
            <Box mt={12}>
              <LoadingSpinner />
            </Box>
          )}
        </>
      )}

      {ImageModal}
    </div>
  );
});

const EmptyGallery = memo(function EmptyGallery(): JSX.Element {
  return (
    <div className="text-center py-20">
      <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-pink-600 rounded-3xl flex items-center justify-center">
        <span className="text-4xl">📸</span>
      </div>
      <Typography
        variant="h4"
        className="text-white font-bold mb-4 tracking-wide"
      >
        Galeria Vazia
      </Typography>
      <Typography variant="body1" className="text-white/80">
        Nenhuma obra de arte encontrada para exibição
      </Typography>
    </div>
  );
});

const GalleryHeader = memo(function GalleryHeader({ 
  imagesCount 
}: { 
  imagesCount: number 
}): JSX.Element {
  
  const chipLabel = useMemo(() => 
    `${imagesCount} Obras Primas • ${Math.floor(Math.random() * 50) + 10} Artistas`,
    [imagesCount]
  );

  const chipStyles = useMemo(() => ({
    borderColor: "rgba(255,255,255,0.5)",
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
    padding: "12px 20px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
  }), []);

  return (
    <div className="text-center mb-12">
      <Typography variant="h6" className="text-white/90 mb-2 tracking-wide">
        Descubra obras incríveis de artistas talentosos
      </Typography>

      <Chip
        label={chipLabel}
        variant="outlined"
        sx={chipStyles}
      />
    </div>
  );
});


interface PreviewProps {
  zoom: number;
  selectedImage: Image;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
}

const MemoizedImagePreview = memo(function ImagePreview({
  zoom,
  selectedImage,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
}: PreviewProps): JSX.Element {

  const imageStyles = useMemo(() => ({
    transform: `scale(${zoom})`,
    transition: "transform 0.3s ease-in-out",
    maxWidth: "100%",
    maxHeight: "70vh",
    objectFit: "contain" as const,
    borderRadius: 12,
    boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
    border: "1px solid rgba(255,255,255,0.1)",
  }), [zoom]);

  const containerStyles = useMemo(() => ({
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 4,
    background: "radial-gradient(circle at center, #1a1a1a 0%, #0f0f0f 100%)",
    position: "relative" as const,
  }), []);

  const controlsStyles = useMemo(() => ({
    position: "absolute" as const,
    bottom: 24,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 1,
    bgcolor: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: 3,
    p: 1,
    border: "1px solid rgba(255,255,255,0.1)",
  }), []);

  const zoomChipStyles = useMemo(() => ({
    position: "absolute" as const,
    top: 16,
    left: 16,
    bgcolor: "rgba(0,0,0,0.8)",
    color: "white",
    fontWeight: "bold",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
  }), []);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).style.display = "none";
  }, []);

  return (
    <Box sx={containerStyles}>
      <Box textAlign="center" sx={{ position: "relative" }}>
        <img
          src={selectedImage.src}
          alt={selectedImage.alt}
          style={imageStyles}
          onError={handleImageError}
        />

        {zoom !== 1 && (
          <Chip
            label={`${Math.round(zoom * 100)}%`}
            size="small"
            sx={zoomChipStyles}
          />
        )}
      </Box>

      <Box sx={controlsStyles}>
        <IconButton onClick={handleZoomOut} sx={{ color: "white" }}>
          <ZoomOut />
        </IconButton>

        <IconButton onClick={handleResetZoom} sx={{ color: "white" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
            1:1
          </Typography>
        </IconButton>

        <IconButton onClick={handleZoomIn} sx={{ color: "white" }}>
          <ZoomIn />
        </IconButton>
      </Box>
    </Box>
  );
});

interface ImageDetailsProps {
  modalData: {
    likes: number;
    downloads: number;
    rating: string;
    category: string;
    tags: string[];
  };
  selectedImage: Image;
  onCloseModal: () => void;
  handleDownload: () => void;
  handleShare: () => void;
}

const MemoizedImageDetails = memo(function ImageDetails({
  modalData,
  selectedImage,
  onCloseModal,
  handleDownload,
  handleShare,
}: ImageDetailsProps): JSX.Element {

  const chipStyles = useMemo(() => ({
    fontWeight: "bold",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
  }), []);

  const tagStyles = useMemo(() => ({
    bgcolor: "rgba(255,255,255,0.1)",
    color: "white",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
  }), []);

  const buttonStyles = useMemo(() => ({
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  }), []);

  const iconButtonStyles = useMemo(() => ({
    color: "white", 
    bgcolor: "rgba(255,255,255,0.1)"
  }), []);


  const tagChips = useMemo(() => 
    modalData.tags.map((tag, i) => (
      <Chip
        key={i}
        label={tag}
        size="small"
        sx={tagStyles}
      />
    )),
    [modalData.tags, tagStyles]
  );

 
  const stats = useMemo(() => [
    {
      icon: <Favorite sx={{ color: "#FF6B6B" }} />,
      label: "Curtidas",
      value: modalData.likes
    },
    {
      icon: <Download sx={{ color: "#4FC3F7" }} />,
      label: "Downloads",
      value: modalData.downloads
    },
    {
      icon: <Star sx={{ color: "#FFD700" }} />,
      label: "Avaliação",
      value: modalData.rating
    }
  ], [modalData.likes, modalData.downloads, modalData.rating]);

  return (
    <Box sx={modalStyles.rightPanel}>
      <Box mb={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Chip
            label={modalData.category}
            sx={chipStyles}
          />

          <IconButton
            onClick={onCloseModal}
            sx={iconButtonStyles}
          >
            <Close />
          </IconButton>
        </Box>

        <Typography
          variant="h4"
          sx={{ color: "white", fontWeight: "bold", mb: 1 }}
        >
          {selectedImage.author}
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography
          variant="h6"
          sx={{ color: "white", mb: 3, fontWeight: "bold" }}
        >
          Estatísticas da Obra
        </Typography>

        <Box display="flex" gap={3} mb={3}>
          {stats.map((stat, index) => (
            <Stat
              key={index}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
            />
          ))}
        </Box>

        <Box display="flex" flexWrap="wrap" gap={1}>
          {tagChips}
        </Box>
      </Box>

      <Box mb={4} flex={1}>
        <Typography
          variant="h6"
          sx={{ color: "white", mb: 2, fontWeight: "bold" }}
        >
          Sobre esta Obra
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.95)", lineHeight: 1.7 }}
        >
          Esta masterpiece captura a essência da criatividade visual moderna.
          Cada detalhe foi meticulosamente trabalhado para proporcionar uma
          experiência estética única e memorável.
        </Typography>
      </Box>

      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownload}
          fullWidth
          sx={buttonStyles}
        >
          Download HD
        </Button>

        <Button
          variant="outlined"
          startIcon={<Share />}
          onClick={handleShare}
          fullWidth
          sx={{ color: "white" }}
        >
          Compartilhar
        </Button>
      </Box>
    </Box>
  );
});

interface StatProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const Stat = memo(function Stat({ icon, label, value }: StatProps): JSX.Element {
  return (
    <Box textAlign="center">
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        {icon}
        <Typography sx={{ color: "white", fontSize: "1.3rem" }}>
          {value}
        </Typography>
      </Box>
      <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>{label}</Typography>
    </Box>
  );
});

ImageGrid.displayName = 'ImageGrid';

export default ImageGrid;