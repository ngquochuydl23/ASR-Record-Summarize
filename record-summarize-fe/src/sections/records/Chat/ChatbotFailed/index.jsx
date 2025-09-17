import { Button } from '@mui/material';
import styles from './styles.module.scss';
import ReplayIcon from '@mui/icons-material/Replay';

const ChatbotFailed = ({ onRetry }) => {
  return (
    <div className='flex relative h-full'>
      <div className={styles.chatbotFailedView}>
        <img alt='chatbot' src='/chatbot_icon.png' className={styles.chatBot} />
        <div className={styles.title}>Chatbot khởi tạo không thành công</div>
        <Button variant='outlined' className='mt-3'
          startIcon={<ReplayIcon />}
          onClick={onRetry}>Thử lại</Button>
      </div>
    </div>
  )
}

export default ChatbotFailed;