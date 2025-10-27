import CloseIcon from '@mui/icons-material/Close';
import { DialogContent, Dialog, DialogTitle, IconButton, DialogActions, Button, Backdrop, Chip, Tooltip } from '@mui/material';
import styles from './styles.module.scss';
import { getListSummaryVerionsByRecord, getSummaryVersionById, publishedSummaryVersion } from '@/repositories/summary-version.repository';
import LoadingBackdrop from '@/components/LoadingBackdrop';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import LoadingButton from '@/components/buttons/LoadingButton';
import _ from 'lodash';
import moment from 'moment';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import { usePreviewSVDialog } from '@/contexts/PreviewSummaryVContext';


const SummaryVersionDialog = ({ recordId, open, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [summaryVersions, setSummaryVersions] = useState([]);
  const { openPreviewDialog } = usePreviewSVDialog();
  const handleClose = () => {
    setSummaryVersions(null);
    onClose();
  }

  // const publish = () => {
  //   setUpdating(true);
  //   publishedSummaryVersion(recordId)
  //     .then(() => {
  //       setTimeout(() => {
  //         setSummaryVersion({ ...summaryVersion, published: true });
  //         enqueueSnackbar('Xuất bản thành công', {
  //           variant: 'success',
  //           anchorOrigin: {
  //             vertical: 'bottom',
  //             horizontal: 'right'
  //           }
  //         });
  //         setUpdating(false)
  //       }, 500);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setTimeout(() => { setUpdating(false) }, 500);
  //       enqueueSnackbar('Có lỗi xảy ra. Vui lòng thử lại', {
  //         variant: 'error',
  //         anchorOrigin: {
  //           vertical: 'bottom',
  //           horizontal: 'right'
  //         }
  //       });
  //     });
  // }

  useEffect(() => {
    if (open && recordId) {
      setLoading(true);
      getListSummaryVerionsByRecord(recordId)
        .then((response) => {
          setTimeout(() => {
            setSummaryVersions(response);
            setLoading(false)
          }, 500);
        })
        .catch((error) => {
          console.log(error);
          setSummaryVersions([]);
          enqueueSnackbar('Có lỗi xảy ra. Vui lòng thử lại', {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
        });
    }
  }, [open, recordId]);

  return (
    <>
      <LoadingBackdrop open={loading} />
      <Dialog open={(!loading && open)} maxWidth='sm' fullWidth onClose={handleClose}>
        <DialogTitle sx={{ padding: "10px 5px", gap: '20px' }}>
          <IconButton onClick={handleClose}><CloseIcon sx={{ color: '#6B7280' }} /></IconButton>
          <span className='ml-2'>Quản lý phiên bản tóm tắt</span>
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <div className={styles.summaryVersionList}>
            {!_.isEmpty(summaryVersions)
              ? _.map(summaryVersions, (item) => (
                <div className={styles.summaryVersionItem} key={item?.id}>
                  <div className='flex flex-col w-full gap-[5px]'>
                    <div className={styles.versionTitle}>{item.record?.title} <span>- {item?.title}</span></div>
                    <div className={styles.createdAt}>Ngày tạo: {item?.created_at}</div>
                  </div>
                  <div className={styles.actionBtns}>
                    {!item?.published &&
                      <Tooltip title="Xuất bản">
                        <IconButton className={styles.iconBtn} disabled={item?.published}>
                          <PublishOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    }
                    <IconButton className={styles.iconBtn} onClick={() => openPreviewDialog(item?.id, { hideBackdrop: true })}>
                      <Tooltip title="Xem trước"><SlideshowOutlinedIcon /></Tooltip>
                    </IconButton>
                  </div>
                </div>
              ))
              : (<div>Empty</div>)
            }
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SummaryVersionDialog;