import { IconButton, MenuItem, MenuList, Popover, Tooltip, Typography } from '@mui/material';
import styles from './styles.module.scss';
import Composer from './Composer';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useEffect, useState } from 'react';
import { AIAgentGenerating, AIAgentMessageItem, MessageItem } from './Message';
import Scrollbars from 'react-custom-scrollbars-2';
import ChatbotPreparing from './ChatbotPreparing';
import { ChatbotPreparingStateEnum } from '@/constants/app.constants';
import ChatbotFailed from './ChatbotFailed';
import WelcomeView from './WelcomeView';
import { useSearchParams } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';


const ChatView = ({ onClose, record, state = ChatbotPreparingStateEnum.PREPARING, onRetry }) => {
  const [searchParams] = useSearchParams();
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

  const handleSubmitMsg = (payload) => {
    setMsgObject(payload);
    setWaiting(true);
  }

  useEffect(() => {
    if (searchParams) {
      console.log("Current query:", searchParams.get("roomId"));
    }
  }, [searchParams]);

  return (
    <div className={styles.chatView}>
      <div className={styles.chatViewHeader}>
        <Typography variant='body1' className={styles.chatViewHeaderTitle}>Trợ lý ảo AI</Typography>
        <Tooltip title="Lịch sử trò chuyện">
          <IconButton>
            <HistoryIcon />
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
            <div className='flex flex-col bg-white py-3'>
              {!searchParams.get("roomId") && <WelcomeView />}
              <MessageItem content={`Bạn muốn mình làm bản UI giống kiểu “prompt suggestions chip” như trong ảnh chatbot pizza (clickable, đẹp + hover) không?`} />
              <AIAgentMessageItem content={`Trong CSS, khi bạn dùng inline-block thì thuộc tính gap không hoạt động (chỉ áp dụng cho flex và grid).`} />
              {msgObject && <MessageItem content={msgObject?.msgContent} />}
              {(waiting && msgObject) && <AIAgentGenerating />}
            </div>
          </Scrollbars>
        }
      </div>
      {(state === ChatbotPreparingStateEnum.DONE) &&
        <Composer disabled={waiting} onSendMsg={handleSubmitMsg} />
      }
      <Popover
        id={id} open={open}
        anchorEl={anchorEl} onClose={handleClose}
        elevation={5}
        sx={{
          '& .MuiPaper-root': {
            minWidth: '180px',
            borderRadius: '10px',
          },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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