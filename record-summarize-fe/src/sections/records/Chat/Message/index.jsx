import { Avatar } from '@mui/material';
import styles from './styles.module.scss';
import classNames from 'classnames';


export const GroupMsg = ({ owned = false }) => {
  return (
    <div className={classNames(styles.messageItem)}>
      <Avatar
        className={styles.avatar}
        src="https://avatarngau.sbs/wp-content/uploads/2025/05/avatar-3d-1.jpg"
      />
      <div className={styles.msgWrapper}>
        <div className={styles.userName}>Hồ Trầm</div>
        <div className={styles.group}>
          <MessageItem />
          <MessageItem />
        </div>
      </div>
    </div>
  );
};

export const MessageItem = () => {
  return (
    <div className={styles.content}>
      Mới nói chuyện đây mà nắm vững giờ giấc của tui luôn gòy 😆 nói chuyện lâu tui có bao nhiêu
      tật xấu chắc Huy biết hết luôn quá 😅
    </div>
  );
};

export const NotificationMsgItem = () => {
  return (
    <div className={styles.notificationMsg}>
      <span style={{ fontWeight: 700 }}>Nguyễn Huy </span>
      {` đã tham gia cuộc họp`}
    </div>
  );
};