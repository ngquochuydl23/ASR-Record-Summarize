import { IconButton, MenuItem, MenuList, Popover, Tooltip, Typography } from '@mui/material';
import styles from './styles.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import Composer from './Composer';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useState } from 'react';


const ChatView = ({ onClose }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className={styles.chatView}>
      <div className={styles.chatViewHeader}>
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant='body1' className={styles.chatViewHeaderTitle}>Trợ lý ảo AI</Typography>
        <Tooltip title="Tài liệu đính kèm">
          <IconButton>
            <FolderOpenIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Thêm">
          <IconButton onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className={styles.chatViewBody}>
        {/* <GroupMsg owned={false} /> */}
        {/* <NotificationMsgItem /> */}
      </div>
      <Composer onSendMsg={() => { }} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        elevation={5}
        sx={{
          '& .MuiPaper-root': {
            minWidth: '180px',
            borderRadius: '10px',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuList>
          <MenuItem className={styles.menuItem}>Cài đặt cuộc họp</MenuItem>
          <MenuItem className={styles.menuItem}>Mời người khác</MenuItem>
        </MenuList>
      </Popover>
    </div>
  );
};

export default ChatView;