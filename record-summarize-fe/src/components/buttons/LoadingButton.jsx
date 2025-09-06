import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingButton = ({ variant, sx, type, disabled, loading, children, fullWidth = false, size = 'medium' }) => {
  return (
    <Button
      fullWidth={fullWidth}
      startIcon={loading
        ? <CircularProgress
          sx={{ color: 'white' }}
          size="20px" />
        : null
      }
      sx={sx}
      size={size}
      disabled={disabled || loading}
      variant={variant}
      type={type} >
      {children}
    </Button >
  )
}

export default LoadingButton

