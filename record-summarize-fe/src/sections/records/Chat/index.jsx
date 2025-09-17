import { IconButton, MenuItem, MenuList, Popover, Tooltip, Typography } from '@mui/material';
import styles from './styles.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import Composer from './Composer';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useState } from 'react';
import { AIAgentGenerating, AIAgentMessageItem, MessageItem } from './Message';
import Scrollbars from 'react-custom-scrollbars-2';
import ChatbotPreparing from './ChatbotPreparing';
import { ChatbotPreparingStateEnum } from '@/constants/app.constants';
import ChatbotFailed from './ChatbotFailed';
import WelcomeView from './WelcomeView';


const ChatView = ({ onClose, record, state = ChatbotPreparingStateEnum.PREPARING, onRetry }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [msgObject, setMsgObject] = useState(null);
  const [waiting, setWaiting] = useState(false);
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
        {state === ChatbotPreparingStateEnum.PREPARING && <ChatbotPreparing />}
        {state === ChatbotPreparingStateEnum.FAILED && <ChatbotFailed onRetry={onRetry} />}
        {state === ChatbotPreparingStateEnum.DONE &&
          <Scrollbars>
            <div className='flex flex-col-reverse bg-white'>
              {(waiting && msgObject) && <AIAgentGenerating />}
              <AIAgentMessageItem content={`Trong CSS, khi bạn dùng inline-block thì thuộc tính gap không hoạt động (chỉ áp dụng cho flex và grid).`}/>
              <MessageItem content={`Bạn muốn mình làm bản UI giống kiểu “prompt suggestions chip” như trong ảnh chatbot pizza (clickable, đẹp + hover) không?`}/>
              <WelcomeView /> {/** Check neeus ko cos lich su */}
            </div>
          </Scrollbars>
        }
      </div>
      {(state === ChatbotPreparingStateEnum.DONE) &&
        <Composer onSendMsg={(msg) => {
          setMsgObject(msg);
          setWaiting(true);
        }} />
      }
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