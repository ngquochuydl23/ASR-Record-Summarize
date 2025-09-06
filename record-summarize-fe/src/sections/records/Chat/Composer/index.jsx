import { IconButton, Tooltip } from '@mui/material';
import styles from './styles.module.scss';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import { useCallback, useRef, useState } from 'react';
import classNames from 'classnames';
import { BootstrapInput } from '@/components/fields/BootstrapField';


const Composer = ({ onSendMsg }) => {
  const [borderRadius, setBorderRadius] = useState('30px');
  const [msg, setMsg] = useState();

  const inputRef = useRef(null);

  const elementRef = useCallback((node) => {
    if (!node) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setBorderRadius(entry.contentRect.height > 50 ? '15px' : '30px');
      }
    });
    resizeObserver.observe(node);
  }, []);

  const handleChangeText = (e) => {
    setMsg({
      ...msg,
      id: null,
      content: e.target.value,
      mimetype: null,
      url: null,
      msgType: 'normal',
    });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files) {
    }
  };

  const handleSendMsg = () => {
    if (!msg) return;
    onSendMsg(msg);
  };

  return (
    <div className={styles.composerView}>
      <Tooltip title="Tệp đính kèm">
        <IconButton className={styles.iconBtn} onClick={() => inputRef?.current?.click()}>
          <AttachFileIcon />
        </IconButton>
      </Tooltip>
      <BootstrapInput
        ref={elementRef}
        placeholder="Soạn tin nhắn"
        multiline
        maxRows={6}
        sx={{
          padding: 0,
          width: '100%',
          ['& .MuiInputBase-input']: {
            padding: '5px 10px',
            borderRadius,
            fontSize: '14px',
          },
        }}
        size="small"
        onChange={handleChangeText}
      />
      <input
        multiple
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.jpeg,.png,.webp"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Tooltip title="Gửi tin nhắn">
        <IconButton
          className={classNames(styles.iconBtn, styles.sendBtn)}
          disabled
          onClick={handleSendMsg}
        >
          <SendIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default Composer;