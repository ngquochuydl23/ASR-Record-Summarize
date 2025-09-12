import { Button, CircularProgress, IconButton, Popover, Tooltip, Typography } from "@mui/material";
import styles from './styles.module.scss';
import { BootstrapInput } from "@/components/fields/BootstrapField";
import classNames from 'classnames';
import SendIcon from '@mui/icons-material/Send';
import { useCallback, useState } from "react";
import { genSuggest } from "@/repositories/record.repository";
import _ from "lodash";
import { colors } from "@/theme/theme.global";
import CloseIcon from '@mui/icons-material/Close';


const PromptView = ({ id, open, anchorEl, onClose, onAcceptResult, onDeclineResult, onPreviewResult }) => {
  const [borderRadius, setBorderRadius] = useState('30px');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [result, setResult] = useState(null);

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
    setMsg(e.target.value);
  };

  const generateSuggest = () => {
    setLoading(true);
    genSuggest(msg)
      .then((text) => {
        onPreviewResult(text);
        setResult(text);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <div className={styles.promptLayout}>
        <div className="flex gap-2 items-center">
          <IconButton onClick={result ? onDeclineResult : onClose} size="small"><CloseIcon sx={{ width: '20px' }} /></IconButton>
          <Typography variant="subtitle1" fontSize="14px" fontWeight="500">Nhập prompt để sinh gợi ý</Typography>
        </div>
        <div className={styles.composerView}>
          <BootstrapInput
            ref={elementRef}
            placeholder="Nhập prompt"
            multiline
            maxRows={6}
            value={msg}
            sx={{
              padding: 0,
              width: '100%',
              ['& .MuiInputBase-input']: {
                padding: '5px 10px',
                borderRadius,
                fontSize: '13px',
              },
            }}
            size="small"
            onChange={handleChangeText}
          />
          {loading
            ? <div className={styles.loadingContainer}>
              <CircularProgress size='20px' />
            </div>
            : <Tooltip title="Gửi tin nhắn">
              <IconButton
                onClick={generateSuggest}
                className={classNames(styles.iconBtn, styles.sendBtn)}
                disabled={loading || _.isEmpty(msg)}
              >
                <SendIcon />
              </IconButton>
            </Tooltip>
          }
        </div>
        <p className={styles.helperText}>Trợ lý AI có thể mắc sai sót, vì vậy, hãy xác minh câu trả lời và thận trọng khi sử dụng mã. Tìm hiểu thêm</p>
        {result &&
          <div className="flex justify-end mt-2">
            <Button
              onClick={() => {
                setResult(null);
                setMsg('');
                onAcceptResult(result);
                onClose();
              }}
              variant="text"
              sx={{ color: colors.successColorBg }}>Chấp nhận</Button>
            <Button
              onClick={() => {
                setResult(null);
                setMsg('');
                onDeclineResult();
                onClose();
              }}
              variant="text"
              sx={{ color: colors.errorColor }}>Loại bỏ</Button>
          </div>
        }
      </div>
    </Popover>
  )
}

export default PromptView;