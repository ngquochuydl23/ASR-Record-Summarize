import CloseIcon from '@mui/icons-material/Close';
import { DialogContent, Dialog, DialogTitle, IconButton, Chip, Tooltip, CircularProgress } from '@mui/material';
import styles from './styles.module.scss';
import { deleteSummaryVersionById, getListSummaryVerionsByRecord, publishedSummaryVersion } from '@/repositories/summary-version.repository';
import LoadingBackdrop from '@/components/LoadingBackdrop';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import _ from 'lodash';
import moment from 'moment';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import { usePreviewSVDialog } from '@/contexts/PreviewSummaryVContext';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useSelector } from 'react-redux';
import { colors } from '@/theme/theme.global';

const SummaryVersionDialog = ({ recordId, open, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [summaryVersions, setSummaryVersions] = useState([]);
  const [publishingId, setPublishingId] = useState(null);
  const { openPreviewDialog } = usePreviewSVDialog();
  const handleClose = () => {
    setSummaryVersions(null);
    onClose();
  }

  const publish = (versionId) => {
    setPublishingId(versionId);
    publishedSummaryVersion(versionId)
      .then(() => {
        setTimeout(() => {
          setPublishingId(null);
          getVerionList();
          enqueueSnackbar('Xuất bản thành công', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => { setPublishingId(null); }, 500);
        enqueueSnackbar('Có lỗi xảy ra. Vui lòng thử lại', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });
      });
  }

  const getVerionList = () => {
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

  const deleteVersion = (versionId) => {
    deleteSummaryVersionById(versionId)
      .then((response) => {
        setTimeout(() => {
          getVerionList();
          setLoading(false);
          enqueueSnackbar('Xóa thành công', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
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

  useEffect(() => {
    if (open && recordId) {
      getVerionList();
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
                    <div className={styles.versionTitle}>
                      {item.record?.title} <span>- {item?.title}</span>
                      {item?.published && <Chip label="Hiện tại" className='ml-3' size='small'></Chip>}
                    </div>
                    <div className={styles.createdAt}>Ngày tạo: {moment(item?.created_at).format('DD/MM/YYYY')} - {user?.full_name}</div>
                  </div>
                  <div className={styles.actionBtns}>
                    {(!item?.published) &&
                      <Tooltip title="Xuất bản">
                        <IconButton className={styles.iconBtn} disabled={item?.published} onClick={() => publish(item?.id)}>
                          <PublishOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    }
                    {publishingId === item?.id && <CircularProgress size={"20px"} className='mr-3' />}
                    <IconButton className={styles.iconBtn} onClick={() => openPreviewDialog(item?.id, { hideBackdrop: true })}>
                      <Tooltip title="Xem trước"><SlideshowOutlinedIcon /></Tooltip>
                    </IconButton>
                    {summaryVersions?.length > 1 &&
                      <IconButton className={styles.iconBtn} onClick={() => deleteVersion(item?.id)}>
                        <Tooltip title="Xóa"><DeleteOutlineOutlinedIcon color={colors.errorColor} /></Tooltip>
                      </IconButton>
                    }
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