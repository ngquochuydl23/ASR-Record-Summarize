import { AIAgentGenerating, AIAgentMessageItem, MessageItem } from '../Message';
import styles from './styles.module.scss';
import Lottie from 'react-lottie';
import animationData from '../../../../assets/lotties/Loading.json';

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
        <Lottie
          height={150}
          width={150}
          options={{
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice"
            }
          }} />
        <div className={styles.title}>
          Chatbot đang được khởi tạo
        </div>
      </div>
    </div>
  )
}

export default ChatbotPreparing;