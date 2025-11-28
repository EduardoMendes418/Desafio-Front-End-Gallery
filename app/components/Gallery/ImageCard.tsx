import {
  Card,
  CardMedia,
  CardActionArea,
  Box,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Visibility,
  Share,
} from "@mui/icons-material";
import { useState, useCallback, memo } from "react";
import { ImageCardProps } from "@/app/types";

const ImageCard = memo(({
  image,
  onImageClick,
  onToggleFavorite,
  showActions = true,
}: ImageCardProps): JSX.Element => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = useCallback(() => {
    onImageClick(image);
  }, [onImageClick, image]);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(image.id);
  }, [onToggleFavorite, image.id]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => setImageError(true), []);

  return (
    <Card
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        borderRadius: 2,
        boxShadow: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <Box sx={{ position: "relative", aspectRatio: "1/1" }}>
          <CardMedia
            component="img"
            image={image.thumbnail}
            alt={image.alt}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />

          {isHovered && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "rgba(0, 53, 128, 0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffff",
                transition: "all 0.3s ease",
                p: 2,
              }}
            >
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {image.author}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {image.category}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  <Chip
                    label={`${image.likes} likes`}
                    size="small"
                    color="primary"
                  />
                  <Chip
                    label={`${image.views} views`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
          )}

          {showActions && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                gap: 0.5,
                opacity: isHovered ? 1 : 0.7,
                transition: "opacity 0.3s ease",
              }}
            >
              <IconButton
                component="div"
                size="small"
                onClick={handleFavoriteClick}
                sx={{
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "grey.100" },
                }}
              >
                {image.isFavorite ? (
                  <Favorite sx={{ color: "red" }} />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>

              <IconButton
                component="div"
                size="small"
                sx={{
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "grey.100" },
                }}
              >
                <Share />
              </IconButton>
            </Box>
          )}

          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              display: "flex",
              gap: 0.5,
              flexWrap: "wrap",
            }}
          >
            {image.tags.slice(0, 2).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  backgroundColor: "white",
                  fontSize: "0.6rem",
                  height: 20,
                }}
              />
            ))}
          </Box>

          {!imageLoaded && !imageError && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="textSecondary">Carregando...</Typography>
            </Box>
          )}

          {imageError && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "#ffebee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: 2,
              }}
            >
              <Typography color="error">Erro ao carregar imagem</Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              mb: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="#003580"
              noWrap
            >
              {image.author}
            </Typography>
            {image.isFavorite && (
              <Favorite sx={{ fontSize: 16, color: "red" }} />
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="textSecondary" >
              {image.category}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Favorite sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption">{image.likes}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Visibility sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption">{image.views}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
});

ImageCard.displayName = 'ImageCard';

export default ImageCard;