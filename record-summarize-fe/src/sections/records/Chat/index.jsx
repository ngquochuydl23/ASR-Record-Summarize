import { IconButton, MenuItem, MenuList, Popover, Tooltip, Typography } from '@mui/material';
import styles from './styles.module.scss';
import Composer from './Composer';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useRef, useState } from 'react';
import { AIAgentGenerating, AIAgentMessageItem, ErrorAIAgentMessageItem, MessageItem } from './Message';
import Scrollbars from 'react-custom-scrollbars-2';
import ChatbotPreparing from './ChatbotPreparing';
import { ChatbotPreparingStateEnum } from '@/constants/app.constants';
import ChatbotFailed from './ChatbotFailed';
import WelcomeView from './WelcomeView';
import { useSearchParams } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import ConversationsDialog from '../ConversationsDialog';
import { createConversation } from '@/repositories/conversation.repository';
import _ from 'lodash';
import { getAllMessages, sendMsg } from '@/repositories/message.repository';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { v4 as uuidv4 } from 'uuid';
const ChatView = ({ record, state = ChatbotPreparingStateEnum.PREPARING, onRetry }) => {
  const scrollRef = useRef();
  const [messages, setMessages] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [steamingData, setSteamingData] = useState('');
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmitMsg = (message) => {
    scrollRef.current?.scrollToBottom();
    const msgPayload = {
      id: uuidv4(),
      msg_content: message.msg_content,
      web_search: message?.web_search || false,
      reply_from_id: message?.reply_from_id || null,
      attachments: [],
    }
    console.log(msgPayload);
    setWaiting(true);
    setMessages(pre => [...pre, { ...msgPayload, sender: "USER" }]);
    if (searchParams && searchParams.get("conversationId")) {
      sendMsg(searchParams.get("conversationId"), msgPayload)
        .then((msg) => scrollRef.current?.scrollToBottom())
        .catch((error) => { console.log(error); })
        .finally(() => { });
    } else {
      createConversation({ record_id: record?.id, message: msgPayload })
        .then((conversation) => {
          scrollRef.current?.scrollToBottom();
          setSearchParams({ conversationId: conversation?.id })
        })
        .catch((error) => { console.log(error); })
        .finally(() => { });
    }
  }

  const handleConnected = () => {
    console.log("[ChatView] Connected to WebSocket");
  }

  const handleDisconnected = () => {
    console.log("[ChatView] Disconnected from WebSocket");
  }

  const getMessagesFromConversation = (conversationId) => {
    getAllMessages(conversationId)
      .then((msgs) => setMessages(msgs))
      .catch((error) => {
        console.log(error);
      });
  }

  const handleReceiveData = (data) => {
    if (data.type === 'chunk') {
      setSteamingData(prev => (prev ?? "") + data.content);
    }
    else if (data.type === 'done') {
      setWaiting(false);
      setSteamingData('');
      setMessages(prev => [...prev, {
        msg_content: data.content,
        sender: "AI",
        agent_msg_status: data.agent_msg_status,
      }]);
    } else if (data.type === 'error') {
      console.log(data);
      setWaiting(false);
      setSteamingData('');
      setMessages(prev => [...prev, {
        msg_content: data.content,
        sender: "AI",
        agent_msg_status: data.agent_msg_status,
      }]);
    }
    setTimeout(() => { scrollRef.current?.scrollToBottom() }, 500);
  }

  useEffect(() => {
    if (searchParams && searchParams.get("conversationId")) {
      const conversationId = searchParams.get("conversationId");
      getMessagesFromConversation(conversationId);
      const ws = new WebSocket(`${process.env.REACT_APP_WS_ENDPOINT}/conversations/ws/${conversationId}`);
      ws.onopen = handleConnected;
      ws.onclose = handleDisconnected;
      ws.onmessage = (event) => handleReceiveData(JSON.parse(event.data));
      return () => {
        ws.close();
      };
    } else {
      setWaiting(false);
      setSteamingData('');
      setMessages([]);
    }
  }, [searchParams]);

  const handleAgreeAnswer = (parentId) => {
    const lastUserMsg = _.findLast(messages, (msg) => msg.sender === 'USER');
    if (lastUserMsg) {
      handleSubmitMsg({
        msg_content: 'Tôi đồng ý',
        attachments: [],
        web_search: true,
        reply_from_id: lastUserMsg.id
      });
    }
  }

  return (
    <div className={styles.chatView}>
      <div className={styles.chatViewHeader}>
        <Typography variant='body1' className={styles.chatViewHeaderTitle}>Trợ lý ảo AI</Typography>
        <Tooltip title="Tạo mới">
          <IconButton onClick={() => setSearchParams({})}><DriveFileRenameOutlineIcon /></IconButton>
        </Tooltip>
        <Tooltip title="Lịch sử trò chuyện">
          <IconButton onClick={() => setOpenHistory(true)}><HistoryIcon /></IconButton>
        </Tooltip>
        <Tooltip title="Thêm">
          <IconButton onClick={handleClick}><MoreVertIcon /></IconButton>
        </Tooltip>
      </div>
      <div className={styles.chatViewBody}>
        {state === ChatbotPreparingStateEnum.PREPARING && <ChatbotPreparing />}
        {state === ChatbotPreparingStateEnum.FAILED && <ChatbotFailed onRetry={onRetry} />}
        {state === ChatbotPreparingStateEnum.DONE &&
          <Scrollbars ref={scrollRef} autoHide>
            <div className='flex flex-col bg-white py-3'>
              {!searchParams.get("conversationId") && _.isEmpty(messages) &&
                <WelcomeView
                  recordId={record?.id}
                  onSuggestClick={(suggestion) => handleSubmitMsg({ msg_content: suggestion, attachments: [] })} />
              }
              {_.map(messages, (messageItem) => {
                if (messageItem.sender === 'AI' && messageItem.agent_msg_status === 'Success') {
                  return (
                    <AIAgentMessageItem
                      key={messageItem}
                      id={messageItem?.id}
                      content={messageItem.msg_content}
                      onAgree={handleAgreeAnswer}
                    />
                  )
                }
                if (messageItem.sender === 'AI' && messageItem.agent_msg_status === 'Failed') {
                  return (<ErrorAIAgentMessageItem id={messageItem?.id} />)
                }
                if (messageItem.sender === 'USER') {
                  return (
                    <MessageItem key={messageItem} content={messageItem.msg_content} />
                  )
                }
              })}
              {(waiting && _.isEmpty(steamingData)) && <AIAgentGenerating />}
              {(!_.isEmpty(steamingData) && waiting) && <AIAgentMessageItem content={steamingData} />}
            </div>
          </Scrollbars>
        }
      </div>
      {(state === ChatbotPreparingStateEnum.DONE) && <Composer disabled={waiting} onSendMsg={handleSubmitMsg} />}
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
      <ConversationsDialog
        recordId={record?.id}
        open={openHistory}
        onClose={() => setOpenHistory(false)}
        onConversationClick={(id) => setSearchParams({ conversationId: id })}
        onCreateConversation={() => setSearchParams({})} />
    </div>
  );
};

export default ChatView;