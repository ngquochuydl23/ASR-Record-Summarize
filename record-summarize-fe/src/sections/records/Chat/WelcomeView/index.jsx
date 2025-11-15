import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { Chip } from '@mui/material';
import _ from 'lodash';
import { getSuggestPrompts } from '@/repositories/record.repository';

const WelcomeView = ({ recordId, onSuggestClick }) => {
  const { user } = useSelector((state) => state.user);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedPrompts = async () => {
      try {
        setLoading(true);
        const count = !recordId ? 10 : 5;
        const response = await getSuggestPrompts(recordId, count, 25);
        setSuggestions(response.suggested_prompts || []);
      } catch (error) {
        console.error('Failed to fetch suggested prompts:', error);
        setSuggestions([
          "Hãy rút ra 3 ý quan trọng nhất từ video này.",
          "Tìm câu chuyện liên quan",
          "Video này nói về những điểm chính nào?"
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedPrompts();
  }, [recordId]);

  return (
    <div className={styles.welcomeView}>
      <div className={styles.title}>
        <span>Xin chào! {user.first_name}</span>
      </div>
      <div className={styles.description}>Với EasySum, bạn có thể đặt câu hỏi, trao đổi và nhận phản hồi tự nhiên như đang trò chuyện.</div>
      <div className='flex flex-wrap gap-2 mt-3'>
        {!loading && _.map(suggestions, (item, index) =>
          <Chip 
            key={index}
            clickable 
            label={item}
            variant='outlined' 
            className='my-[2px]'
            onClick={() => { onSuggestClick(item) }}
          />)}
      </div>
    </div>
  )
}

export default WelcomeView;