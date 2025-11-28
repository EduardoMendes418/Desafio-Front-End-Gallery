import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  TextField,
  InputAdornment,
  Badge,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Refresh,
  Search,
  Favorite,
  History,
  Upload,
  AccountCircle,
  Dashboard,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { HeaderProps } from "../../types";

const Header = ({
  onRefresh,
  onSearch,
  onUploadClick,
  loading,
  searchQuery,
  stats,
}: HeaderProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenu, setMobileMenu] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenu(event.currentTarget);
  };

  const handleMobileMenuClose = () => setMobileMenu(null);

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#003580",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            py: 2,
            gap: 3,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexShrink: 0,
            }}
          >
            <Dashboard sx={{ fontSize: 32, color: "white" }} />

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "white", lineHeight: 1 }}
              >
                Gallery Pro
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}
              >
                Visual Experience Platform
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              maxWidth: { xs: "100%", md: 500 },
              display: { xs: "none", sm: "block" },
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar imagens, autores, tags..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: "white",
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold">
                  {stats.total}
                </Typography>
                <Typography variant="caption">Imagens</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold">
                  {stats.favorites}
                </Typography>
                <Typography variant="caption">Favoritas</Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<Upload />}
              onClick={onUploadClick}
              sx={{
                backgroundColor: "#0071c2",
                "&:hover": { backgroundColor: "#005a9e" },
              }}
            >
              Upload
            </Button>

            <IconButton sx={{ color: "white" }}>
              <Badge badgeContent={stats.favorites} color="error">
                <Favorite />
              </Badge>
            </IconButton>

            <IconButton sx={{ color: "white" }}>
              <History />
            </IconButton>

            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={onRefresh}
              disabled={loading}
              sx={{
                backgroundColor: "#0071c2",
                "&:hover": { backgroundColor: "#005a9e" },
              }}
            >
              {loading ? "Atualizando..." : "Atualizar"}
            </Button>

            <IconButton sx={{ color: "white" }} onClick={handleMenuOpen}>
              <AccountCircle />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
              <MenuItem onClick={handleMenuClose}>Configurações</MenuItem>
              <MenuItem onClick={handleMenuClose}>Sair</MenuItem>
            </Menu>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton sx={{ color: "white" }} onClick={handleMobileMenuOpen}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Menu
            anchorEl={mobileMenu}
            open={Boolean(mobileMenu)}
            onClose={handleMobileMenuClose}
          >
            <MenuItem disableRipple>
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </MenuItem>

            <MenuItem onClick={onUploadClick}>
              <Upload sx={{ mr: 1 }} /> Upload
            </MenuItem>

            <MenuItem>
              <Favorite sx={{ mr: 1 }} /> Favoritas: {stats.favorites}
            </MenuItem>

            <MenuItem>
              <History sx={{ mr: 1 }} /> Histórico
            </MenuItem>

            <MenuItem onClick={onRefresh}>
              <Refresh sx={{ mr: 1 }} /> Atualizar
            </MenuItem>

            <MenuItem onClick={handleMenuOpen}>
              <AccountCircle sx={{ mr: 1 }} /> Conta
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
