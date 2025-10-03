import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingButton = ({ startIcon, variant, sx, type, disabled, loading = false, children, fullWidth = false, size = 'medium', onClick }) => {
  return (
    <Button
      disableElevation
      onClick={onClick}
      fullWidth={fullWidth}
      startIcon={loading
        ? <CircularProgress
          sx={{ color: 'white' }}
          size="20px" />
        : (startIcon || null)
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

