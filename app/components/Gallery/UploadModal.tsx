import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper
} from '@mui/material';
import { Close, CloudUpload } from '@mui/icons-material';
import { useState } from 'react';
import { UploadModalProps } from '../../types';

const UploadModal = ({ open, onClose, onUpload }: UploadModalProps): JSX.Element => {
  const [formData, setFormData] = useState({
    author: '',
    alt: '',
    category: '',
    tags: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newImage = {
      src: `https://picsum.photos/seed/upload${Date.now()}/800/600`,
      thumbnail: `https://picsum.photos/seed/upload${Date.now()}/300/300`,
      author: formData.author || 'Usuário',
      alt: formData.alt || 'Imagem enviada',
      tags: formData.tags,
      category: formData.category || 'Geral',
      likes: 0,
      views: 0,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      resolution: '800x600',
      size: '2500 KB'
    };

    onUpload(newImage);
    setFormData({ author: '', alt: '', category: '', tags: [] });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" color="#003580">
            <CloudUpload sx={{ mr: 1, fontSize: 24 }} />
            Upload de Imagem
          </Typography>
          <Button onClick={onClose} sx={{ minWidth: 'auto' }}>
            <Close />
          </Button>
        </Box>

        <Paper variant="outlined" sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            Arraste e solte uma imagem aqui ou
          </Typography>
          <Button variant="contained" component="label">
            Selecionar Arquivo
            <input type="file" hidden accept="image/*" />
          </Button>
        </Paper>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Autor"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Descrição"
            value={formData.alt}
            onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
            sx={{ mb: 2 }}
            multiline
            rows={2}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={formData.category}
              label="Categoria"
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              <MenuItem value="Natureza">Natureza</MenuItem>
              <MenuItem value="Cidades">Cidades</MenuItem>
              <MenuItem value="Pessoas">Pessoas</MenuItem>
              <MenuItem value="Arte">Arte</MenuItem>
              <MenuItem value="Tecnologia">Tecnologia</MenuItem>
              <MenuItem value="Geral">Geral</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={formData.tags}
              label="Tags"
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value as string[] }))}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {['premium', 'nova', 'popular', 'destacada', 'exclusiva'].map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={onClose} variant="outlined">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#003580' }}>
              Enviar Imagem
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default UploadModal;