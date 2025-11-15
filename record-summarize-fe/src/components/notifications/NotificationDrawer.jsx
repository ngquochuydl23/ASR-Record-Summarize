import { Typography } from '@mui/material'
import BaseDrawer from '../BaseDrawer';
import { NotificationItem } from './NotificationItem';

const NotificationDrawer = ({ open, onClose }) => {
  return (
    <BaseDrawer open={open} onClose={onClose}>
      <div className='flex flex-row justify-between'>
        <Typography variant='h5'>Thông báo</Typography>
      </div>
      <div className='flex flex-col gap-2'>

      </div>
    </BaseDrawer>
  )
}

export default NotificationDrawer;