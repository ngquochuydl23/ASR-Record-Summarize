import { Avatar } from '@mui/material';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { CircularProgress } from '@mui/material';

export const MessageItem = ({ content }) => {
  return (
    <div className={styles.messageItem}>
      {content}
    </div>
  );
};

export const AIAgentMessageItem = ({ content }) => {
  return (
    <div className='flex gap-3 p-2 w-fit'>
      <img alt="chatbot icon" className={styles.chatbotIc} src='/chatbot_icon.png' />
      <div className='flex flex-col'>
        <div className={styles.aiAssistantTitle}>Trợ lý AI</div>
        <div className={classNames(styles.messageItem, styles.isAiResponse)}>
          {content}
        </div>
      </div>
    </div>
  )
}

export const AIAgentGenerating = () => {
  return (
    <div className='flex gap-3 p-2 w-fit'>
      <img alt="chatbot icon" className={styles.chatbotIc} src='/chatbot_icon.png' />
      <div className='flex flex-col'>
        <div className={styles.aiAssistantTitle}>Trợ lý AI</div>
        <div className="text-[#0842a0] flex items-center gap-2 font-[600] text-[13px]">
          <span><CircularProgress size={14} sx={{ color: '#666' }} /></span>
          Đang trả lời
          <span className="ml-1 flex">
            <span className={styles.dotTyping}></span>
          </span>
        </div>
      </div>
    </div>
  )
}

export const NotificationMsgItem = () => {
  return (
    <div className={styles.notificationMsg}>
      <span style={{ fontWeight: 700 }}>Nguyễn Huy </span>
      {` đã tham gia cuộc họp`}
    </div>
  );
};