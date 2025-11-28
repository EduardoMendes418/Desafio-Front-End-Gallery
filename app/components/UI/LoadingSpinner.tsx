import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = (): JSX.Element => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="200px"
    flexDirection="column"
    gap={2}
  >
    <CircularProgress />
    <span className="text-gray-600 text-sm">Carregando imagens...</span>
  </Box>
);

export default LoadingSpinner;