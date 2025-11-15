import { useEffect, useState } from 'react';
import { Chip } from '@mui/material';
import _ from 'lodash';
import { getSuggestPrompts } from '@/repositories/record.repository';
import styles from './styles.module.scss';

const SuggestionPrompts = ({ recordId, onSuggestClick }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedPrompts = async () => {
      if (!recordId) return;
      try {
        setLoading(true);
        const response = await getSuggestPrompts(recordId, 5, 50);
        setSuggestions(response.suggested_prompts || []);
      } catch (error) {
        console.error('Failed to fetch suggested prompts:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedPrompts();
  }, [recordId]);

  if (loading || _.isEmpty(suggestions)) {
    return null;
  }

  return (
    <div className={styles.suggestionPromptsContainer}>
      <div className={styles.suggestionPrompts}>
        <div className='flex flex-wrap gap-2 flex-1'>
          {_.map(suggestions, (item, index) =>
            <Chip
              key={index}
              clickable
              label={item}
              variant='outlined'
              onClick={() => { onSuggestClick(item) }}
            />)}
        </div>
      </div>
    </div>
  );
};

export default SuggestionPrompts;
