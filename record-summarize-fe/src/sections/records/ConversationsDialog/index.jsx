import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { Search } from '@mui/icons-material';
import styles from './style.module.scss';
import _ from 'lodash';
import { getConversationsByRecordId } from "@/repositories/conversation.repository";
import moment from "moment";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import "moment/locale/vi";


moment.locale("vi");
const ConversationsDialog = ({
  recordId, open,
  onClose = () => { }, onConversationClick, onCreateConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const getConverstations = () => {
    setLoading(true);
    getConversationsByRecordId(recordId)
      .then(setConversations)
      .catch((error) => { console.log(error) })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getConverstations();
  }, [open]);

  const handleClick = (conversationId) => {
    onClose();
    onConversationClick(conversationId);
  }

  const handleCreateNew = () => {
    onClose();
    onCreateConversation();
  }

  return (
    <Dialog open={open} maxWidth='sm' fullWidth onClose={onClose}>
      <DialogTitle sx={{ padding: "10px 5px", fontSize: '14px' }}>
        <IconButton onClick={onClose} sx={{ mr: '10px' }}><CloseIcon /></IconButton>
        Lịch sử
      </DialogTitle>
      <DialogContent>
        <form>
          <div className="flex gap-2">
            <TextField
              size='small'
              fullWidth
              placeholder='Tìm theo tên'
              InputProps={{
                startAdornment:
                  <InputAdornment
                    sx={{
                      backgroundColor: (theme) => theme.palette.divider,
                      borderTopLeftRadius: (theme) =>
                        theme.shape.borderRadius + "px",
                      borderBottomLeftRadius: (theme) =>
                        theme.shape.borderRadius + "px"
                    }}
                    position="start" >
                    <Search />
                  </InputAdornment>
              }}
              sx={{
                mt: '1px',
                height: '30px',
                input: {
                  fontWeight: 400,
                  color: 'black',
                  "&::placeholder": {
                    color: 'gray'
                  },
                },
              }}
              hiddenLabel
              variant="outlined"
            />
            <Button type="button" onClick={handleCreateNew} variant="outlined"
              startIcon={<DriveFileRenameOutlineIcon />}
              sx={{ width: '150px' }}>
              Tạo mới
            </Button>
          </div>
          {_.isEmpty(conversations) && loading && <div className={styles.loadingView}><CircularProgress /></div>}
          {_.isEmpty(conversations) && !loading && <div className={styles.emptyView}>Chưa có lịch sử trò chuyện nào</div>}
          {!_.isEmpty(conversations) && !loading &&
            <div className={styles.listConversations}>
              {_.map(conversations, (item) => (
                <div className={styles.conversationItem} key={item.id}
                  onClick={() => handleClick(item.id)}>
                  <div>{item.title}</div>
                  <div className={styles.datetime}>{moment(item.start_time).startOf('day').fromNow()}</div>
                </div>
              ))
              }
            </div>
          }
        </form>
      </DialogContent >
    </Dialog >
  )
}

export default ConversationsDialog;