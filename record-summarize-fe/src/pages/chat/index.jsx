import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  Typography,
  Button,
  Divider,
  Tooltip,
  Popover,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Add as AddIcon,
  ChatBubbleOutline as ChatIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  PushPin as PushPinIcon,
  Edit as EditIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import './style.scss';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import Scrollbars from "react-custom-scrollbars-2";
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams } from "react-router-dom";
import { getConversationById, getMyConversations, createConversation, pinConversation, removePinConversation, deleteItems, updateConversationTitle } from "@/repositories/conversation.repository";
import _ from 'lodash';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import IcVideo from "@/assets/icons/IcVideo";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { usePreviewSVDialog } from "@/contexts/PreviewSummaryVContext";
import { getAllMessages, sendMsg } from "@/repositories/message.repository";
import Composer from '@/sections/records/Chat/Composer';
import WelcomeView from '@/sections/records/Chat/WelcomeView';
import SuggestionPrompts from '@/sections/records/Chat/SuggestionPrompts';
import { AIAgentMessageItem, AIAgentGenerating, ErrorAIAgentMessageItem, MessageItem } from '@/sections/records/Chat/Message';
import { v4 as uuidv4 } from 'uuid';
import Lottie from 'react-lottie';
import animationData from '@/assets/lotties/Loading.json';
import MyConversationsDialog from '@/sections/records/MyConversationsDialog';
import EditConversationTitleDialog from '@/sections/records/EditConversationTitleDialog';

const Page = () => {
  const { openPreviewDialog } = usePreviewSVDialog();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [conversationData, setConversationData] = useState(null);
  const [detail, setDetail] = useState(null);
  const [msg, setMsgs] = useState();
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [steamingData, setSteamingData] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationToEdit, setConversationToEdit] = useState(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [editTitleDialogOpen, setEditTitleDialogOpen] = useState(false);
  const scrollRef = useRef();
  const messagesEndRef = useRef(null);

  const getConverstations = () => {
    setConversationLoading(true);
    getMyConversations()
      .then(setConversationData)
      .catch((error) => {
        console.log(error);

      })
      .finally(() => setConversationLoading(false));
  }

  const handleCreateNewChat = useCallback(() => {
    setSearchParams({});
    getConverstations();
  }, [setSearchParams]);

  const handleConversationSelect = useCallback((conversationId) => {
    if (!conversationId || _.isEmpty(conversationId)) return;
    setSearchParams({ conversationId });
    getConverstations();
  }, [setSearchParams]);

  const getDetailConversation = async (conversationId) => {
    try {
      setMessagesLoading(true);
      const conversationDetail = await getConversationById(conversationId);
      const msgs = await getAllMessages(conversationId);
      setShowScrollButton(false);
      setDetail(conversationDetail);
      setMsgs(msgs);
      setMessages(msgs);
    } catch (error) {
      console.log(error);
    } finally {
      setMessagesLoading(false);
    }
  }

  const handleSubmitMsg = (message) => {
    scrollRef.current?.scrollToBottom();
    const msgPayload = {
      id: uuidv4(),
      msg_content: message.msg_content,
      web_search: message?.web_search || false,
      reply_from_id: message?.reply_from_id || null,
      attachments: [],
    }
    setWaiting(true);
    setMessages(pre => [...pre, { ...msgPayload, sender: "USER" }]);
    if (searchParams && searchParams.get("conversationId")) {
      sendMsg(searchParams.get("conversationId"), msgPayload)
        .then((msg) => scrollRef.current?.scrollToBottom())
        .catch((error) => { console.log(error); })
        .finally(() => { });
    } else {
      createConversation({ record_id: detail?.record?.id, message: msgPayload })
        .then((conversation) => {
          scrollRef.current?.scrollToBottom();
          setSearchParams({ conversationId: conversation?.id })
        })
        .catch((error) => { console.log(error); })
        .finally(() => { });
    }
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

  const scrollToBottom = () => {
    scrollRef.current?.scrollToBottom();
    setShowScrollButton(false);
  };

  const handleScroll = (values) => {
    const { top, scrollHeight, clientHeight } = values;
    const isScrollable = scrollHeight > clientHeight;
    const isScrolledUp = top < 0.9;
    setShowScrollButton(isScrollable && isScrolledUp);
  };

  const handleMenuOpen = (event, conversation) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedConversation(conversation);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedConversation(null);
  };

  const handlePinConversation = async () => {
    if (!selectedConversation?.id) return;

    const conversationId = selectedConversation.id;
    const isPinned = selectedConversation.is_pinned;

    handleMenuClose();

    try {
      if (isPinned) {
        await removePinConversation(conversationId);
      } else {
        await pinConversation(conversationId);
      }
      await getConverstations();
      if (detail?.id === conversationId) {
        const updatedDetail = await getConversationById(conversationId);
        setDetail(updatedDetail);
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleEditTitle = () => {
    setConversationToEdit(selectedConversation);
    setEditTitleDialogOpen(true);
    handleMenuClose();
  };

  const handleSaveTitle = async (conversationId, newTitle) => {
    try {
      await updateConversationTitle(conversationId, newTitle);
      await getConverstations();
      if (detail?.id === conversationId) {
        const updatedDetail = await getConversationById(conversationId);
        setDetail(updatedDetail);
      }
    } catch (error) {
      console.error('Error updating title:', error);
      throw error;
    }
  };

  const handleArchiveConversation = () => {
    console.log('Archive conversation:', selectedConversation?.id);
    handleMenuClose();
  };

  const handleDeleteCurrentConversation = async () => {
    if (!detail?.id) return;
    const conversationId = detail.id;
    try {
      await deleteItems([conversationId]);
      await getConverstations();
      setSearchParams({});
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleDeleteConversation = async () => {
    if (!selectedConversation?.id) return;

    const conversationId = selectedConversation.id;
    handleMenuClose();
    try {
      await deleteItems([conversationId]);
      await getConverstations();
      if (searchParams.get("conversationId") === conversationId) {
        setSearchParams({});
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, steamingData]);

  useEffect(() => {
    getConverstations();
    if (!_.isEmpty(searchParams.get("conversationId"))) {
      getDetailConversation(searchParams.get("conversationId"));
    } else {
      setShowScrollButton(false);
      setDetail(null);
      setMsgs(null);
      setMessages([]);
      setWaiting(false);
      setSteamingData('');
      setShowScrollButton(false);
    }
  }, [searchParams.get("conversationId")]);

  useEffect(() => {
    if (searchParams && searchParams.get("conversationId")) {
      const conversationId = searchParams.get("conversationId");
      const ws = new WebSocket(`${process.env.REACT_APP_WS_ENDPOINT}/conversations/ws/${conversationId}`);
      ws.onopen = () => console.log("[ChatPage] Connected to WebSocket");
      ws.onclose = () => console.log("[ChatPage] Disconnected from WebSocket");
      ws.onmessage = (event) => handleReceiveData(JSON.parse(event.data));
      return () => {
        ws.close();
      };
    }
  }, [searchParams]);

  const conversationItems = useMemo(() => {
    return conversationData?.items || [];
  }, [conversationData?.items]);

  const conversationListContent = useMemo(() => {
    return (
      <>
        <Scrollbars className="conversation-list">
          {conversationItems.map((conversation) => (
            <ListItem className="list-item" key={conversation?.id} disablePadding>
              <ListItemButton
                selected={searchParams?.get("conversationId") === conversation?.id}
                onClick={() => handleConversationSelect(conversation?.id)}
                className={`conversation-item ${searchParams?.get("conversationId") === conversation?.id ? 'selected' : ''}`}>
                <Box className="conversation-content">
                  {conversation?.is_pinned && (
                    <PushPinIcon
                      fontSize="small"
                      sx={{
                        mr: 1,
                        color: 'primary.main',
                        transform: 'rotate(45deg)'
                      }}
                    />
                  )}
                  <Tooltip title={conversation?.title} enterDelay={5} placement="left-end">
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      noWrap
                      textOverflow={'ellipsis'}
                      className="conversation-title">
                      {conversation.title}
                    </Typography>
                  </Tooltip>
                  <IconButton
                    edge="end"
                    size="small"
                    className="delete-btn"
                    onClick={(e) => handleMenuOpen(e, conversation)}>
                    <MoreHorizIcon fontSize="small" />
                  </IconButton>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </Scrollbars>
        <Popover
          open={Boolean(menuAnchorEl)}
          anchorEl={menuAnchorEl}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuList dense>
            <MenuItem onClick={handlePinConversation}>
              <ListItemIcon>
                <PushPinIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                {selectedConversation?.is_pinned ? 'Bỏ ghim' : 'Ghim'}
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={handleEditTitle}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Đổi tên</ListItemText>
            </MenuItem>
            {/* <MenuItem onClick={handleArchiveConversation}>
              <ListItemIcon>
                <ArchiveIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Lưu trữ</ListItemText>
            </MenuItem> */}
            <Divider />
            <MenuItem onClick={handleDeleteConversation} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Xóa</ListItemText>
            </MenuItem>
          </MenuList>
        </Popover>
      </>
    );
  }, [conversationItems, conversationLoading, searchParams, handleConversationSelect, menuAnchorEl]);

  return (
    <div className="chat-page">
      <aside className={`chat-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <Box className="sidebar-header">
          <Typography variant="h6" fontWeight={600}>Lịch sử</Typography>
          <IconButton onClick={() => setSidebarOpen(false)} size="small">
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <div className="action-groups">
          <Button
            fullWidth
            disableElevation
            variant="contained"
            startIcon={<DriveFileRenameOutlineIcon />}
            onClick={handleCreateNewChat}
            className="new-chat-btn">
            Tạo mới
          </Button>
          <Button
            fullWidth
            disableElevation
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={() => setSearchDialogOpen(true)}
            className="search-chat-btn">
            Tìm kiếm cuộc hội thoại
          </Button>
          {/* <Button
            fullWidth
            disableElevation
            variant="contained"
            startIcon={<ArchiveIcon />}
            className="archive-chat-btn">
            Cuộc hội thoại đã lưu trữ
          </Button> */}
        </div>
        <Divider />
        <Box className="sidebar-conversations">
          <div className="sidebar-conversations-title">Lịch sử trò chuyện</div>
          {conversationListContent}
        </Box>
      </aside>

      <section className="chat-main">
        {!sidebarOpen && (
          <IconButton onClick={() => setSidebarOpen(true)} className="toggle-btn" sx={{ width: 'fit-content'}}>
            <MenuIcon />
          </IconButton>
        )}
        <div className="main-content">
          {!messagesLoading && detail &&
            <div className="conversation-detail">
              <IcVideo />
              <div className="flex flex-col">
                <div className="conversation-detail-title">{detail?.title}</div>
                <div className="source-record">Nguồn video:
                  <a className="source-record-title" href={`/records/${detail?.record?.id}/play`} target="_blank" without rel="noreferrer">
                    <Tooltip title={detail?.record?.title}>{detail?.record?.title}</Tooltip>
                  </a>
                </div>
              </div>
              <div className="conversation-detail-actions">
                <Tooltip title="Xem tóm tắt video">
                  <IconButton size="medium" onClick={() => openPreviewDialog(detail?.record?.current_version_id)}>
                    <SlideshowOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xóa cuộc hội thoại">
                  <IconButton size="medium" sx={{ color: 'red' }} onClick={handleDeleteCurrentConversation}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          }
          <div className="chat-content">
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <Lottie
                  height={100}
                  width={100}
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice"
                    }
                  }} />
              </div>
            ) : (
              <Scrollbars ref={scrollRef} autoHide className="scroll-layout" onUpdate={handleScroll}>
                <div className='flex flex-col overflow-x-hidden py-[100px] '>
                  {!searchParams.get("conversationId") && _.isEmpty(messages) &&
                    <WelcomeView
                      recordId={detail?.record?.id}
                      onSuggestClick={(suggestion) => handleSubmitMsg({ msg_content: suggestion, attachments: [] })} />
                  }
                  {_.map(messages, (messageItem, index) => {
                    if (messageItem.sender === 'AI' && messageItem.agent_msg_status === 'Success') {
                      return (
                        <AIAgentMessageItem
                          key={`${messageItem?.id}-${index}`}
                          id={messageItem?.id}
                          content={messageItem.msg_content}
                          onAgree={handleAgreeAnswer}
                        />
                      )
                    }
                    if (messageItem.sender === 'AI' && messageItem.agent_msg_status === 'Failed') {
                      return (<ErrorAIAgentMessageItem key={`${messageItem?.id}-${index}`} id={messageItem?.id} />)
                    }
                    if (messageItem.sender === 'USER') {
                      return (
                        <MessageItem key={`${messageItem?.id}-${index}`} content={messageItem.msg_content} />
                      )
                    }
                    return null;
                  })}
                  {(waiting && _.isEmpty(steamingData)) && <AIAgentGenerating />}
                  {(!_.isEmpty(steamingData) && waiting) && <AIAgentMessageItem content={steamingData} />}
                  <div ref={messagesEndRef} />
                </div>
              </Scrollbars>
            )}
            {showScrollButton && (
              <IconButton
                onClick={scrollToBottom}
                className="scroll-to-bottom-btn"
                sx={{
                  position: 'absolute',
                  bottom: '120px',
                  right: 0,
                  left: 0,
                  margin: '0 auto',
                  width: 'fit-content',
                  backgroundColor: '#fff',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                  boxShadow: 3,
                  zIndex: 10,
                }}
              >
                <KeyboardArrowDownIcon />
              </IconButton>
            )}
          </div>

          {detail && (
            <>
              {searchParams.get("conversationId") && !_.isEmpty(messages) && !waiting && !messagesLoading && (
                <SuggestionPrompts
                  recordId={detail?.record?.id}
                  onSuggestClick={(suggestion) => handleSubmitMsg({ msg_content: suggestion, attachments: [] })}
                />
              )}
              <div className="chat-composer">
                <Composer disabled={waiting} onSendMsg={handleSubmitMsg} />
              </div>
            </>
          )}
        </div>
      </section>

      <MyConversationsDialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        onConversationClick={handleConversationSelect}
        onCreateConversation={handleCreateNewChat}
      />

      <EditConversationTitleDialog
        open={editTitleDialogOpen}
        onClose={() => {
          setEditTitleDialogOpen(false);
          setConversationToEdit(null);
        }}
        conversation={conversationToEdit}
        onSave={handleSaveTitle}
      />
    </div>
  );
};


export default Page;