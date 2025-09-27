import { Typography } from '@mui/material';
import styles from './styles.module.scss';

const StagingLabelView = () => {
  return (
    <div className={styles.staggingLabelView}>
      <Typography variant='body2' fontWeight="500">
        Bạn đang ở môi trường thử nghiệm (không có GPU).
        Vui lòng dùng <span><a href="https://easysum.pgonevn.com">Production</a></span> để trải nghiệm tốc độ GPU nhanh hơn.
      </Typography>
    </div>
  )
}

export default StagingLabelView;