import { useSelector } from 'react-redux';
import styles from './styles.module.scss';
import { Chip } from '@mui/material';
import _ from 'lodash';
const suggestions = [
  "Hãy rút ra 3 ý quan trọng nhất từ video này.",
  "Tìm câu chuyện liên quan",
  "Video này nói về những điểm chính nào?"
]

const WelcomeView = ({ recordId, onSuggestClick }) => {
  const { user } = useSelector((state) => state.user);
  return (
    <div className={styles.welcomeView}>
      <div className={styles.title}>
        <span>Xin chào! {user.first_name}</span>
      </div>
      <div className={styles.description}>Với EasySum, bạn có thể đặt câu hỏi, trao đổi và nhận phản hồi tự nhiên như đang trò chuyện.</div>
      <div className='inline-block gap-2 mt-3'>
        {_.map(suggestions, (item) =>
          <Chip clickable label={item}
            variant='outlined' className='mx-[3px] my-[4px]'
            onClick={() => { onSuggestClick(item) }}
          />)}
      </div>
    </div>
  )
}

export default WelcomeView;