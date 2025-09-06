import { Drawer, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BaseDrawer = ({ open, onClose, children, paperProps }) => {
  return (
    <Drawer
      anchor={'right'}
      open={open}
      sx={{
        '.MuiDrawer-paper': {
          margin: '10px',
          height: ' calc(100vh - 20px)',
          width: '600px',
          padding: '20px',
          borderRadius: '10px',
          ...paperProps
        }
      }}
      PaperProps={{ margin: '20px' }}
      onClose={onClose} >
      {children}
    </Drawer>
  )
}

export const BaseHeaderDrawer = ({
  title,
  children,
  enableCloseButton = true,
  onClose = () => { }
}) => {
  return (
    <div className='flex flex-row justify-between'>
      <Typography variant='h5' ml="48px">{title}</Typography>
      {children}
      {enableCloseButton &&
        <div className='absolute'>
          <IconButton size='small' onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      }
    </div>
  )
}

export default BaseDrawer;