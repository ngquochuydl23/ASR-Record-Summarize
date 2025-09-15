import { CircularProgress } from '@mui/material';
import { AIAgentGenerating, AIAgentMessageItem, MessageItem } from '../Message';
import styles from './styles.module.scss';


const ChatbotPreparing = () => {
  return (
    <div className='flex relative h-full'>
      <div className='flex flex-col relative'>
        <AIAgentMessageItem
          content={`The question of whether androids dream of electric sheep is the title and central theme of the science fiction novel  Do Androids Dream of Electric Sheep? by Philip K. Dick.
                    The book explores a world where androids are indistinguishable from humans except for a lack of empathy. The story follows Rick Deckard, a bounty hunter who tracks down rogue androids.
                    The title refers to the  empathy test used to distinguish between humans and androids.`} />
        <MessageItem content={`
                    The book explores a world where androids are indistinguishable from humans except for a lack of empathy. The story follows Rick Deckard, a bounty hunter who tracks down rogue androids.
                    The title refers to the  empathy test used to distinguish between humans and androids. `} />
        <AIAgentGenerating />
      </div>
      <div className={styles.preparingView}>
        <img alt='chatbot' src='/chatbot_icon.png' className={styles.chatBot} />
        <div className={styles.title}>
          <span><CircularProgress size={20} /></span>
          Chatbot đang được khởi tạo
        </div>
      </div>
    </div>
  )
}

export default ChatbotPreparing;