import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Checkbox,
  ListItemText,
  Divider
} from '@mui/material';
import { Clear, FilterList } from '@mui/icons-material';
import { FilterSidebarProps } from '../../types';

const FilterSidebar = ({
  filters,
  categories,
  tags,
  onFiltersChange,
  onClearFilters
}: FilterSidebarProps): JSX.Element => {
  const hasActiveFilters = 
    filters.category !== '' || 
    filters.tags.length > 0 || 
    filters.sortBy !== 'newest';

  return (
    <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="#003580">
          <FilterList sx={{ mr: 1, fontSize: 20 }} />
          Filtros
        </Typography>
        
        {hasActiveFilters && (
          <Button
            startIcon={<Clear />}
            onClick={onClearFilters}
            size="small"
            color="inherit"
          >
            Limpar
          </Button>
        )}
      </Box>

      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel>Ordenar por</InputLabel>
        <Select
          value={filters.sortBy}
          label="Ordenar por"
          onChange={(e) => onFiltersChange({ sortBy: e.target.value as any })}
        >
          <MenuItem value="newest">Mais Recentes</MenuItem>
          <MenuItem value="oldest">Mais Antigas</MenuItem>
          <MenuItem value="popular">Mais Visualizadas</MenuItem>
          <MenuItem value="likes">Mais Curtidas</MenuItem>
        </Select>
      </FormControl>

      <Divider sx={{ my: 2 }} />
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel>Categoria</InputLabel>
        <Select
          value={filters.category}
          label="Categoria"
          onChange={(e) => onFiltersChange({ category: e.target.value })}
        >
          <MenuItem value="">
            <em>Todas as categorias</em>
          </MenuItem>
          {categories.map(category => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

  
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel>Tags</InputLabel>
        <Select
          multiple
          value={filters.tags}
          label="Tags"
          onChange={(e) => onFiltersChange({ tags: e.target.value as string[] })}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {tags.map((tag) => (
            <MenuItem key={tag} value={tag}>
              <Checkbox checked={filters.tags.indexOf(tag) > -1} />
              <ListItemText primary={tag} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>


      {hasActiveFilters && (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            backgroundColor: '#f8f9fa',
            borderColor: '#0071c2'
          }}
        >
          <Typography variant="body2" color="#003580" fontWeight="medium">
            Filtros Ativos:
          </Typography>
          {filters.category && (
            <Chip 
              label={`Categoria: ${filters.category}`} 
              size="small" 
              sx={{ mt: 1, mr: 1 }}
              onDelete={() => onFiltersChange({ category: '' })}
            />
          )}
          {filters.tags.map(tag => (
            <Chip
              key={tag}
              label={`Tag: ${tag}`}
              size="small"
              sx={{ mt: 1, mr: 1 }}
              onDelete={() => onFiltersChange({ 
                tags: filters.tags.filter(t => t !== tag) 
              })}
            />
          ))}
        </Paper>
      )}
    </Paper>
  );
};

export default FilterSidebar;