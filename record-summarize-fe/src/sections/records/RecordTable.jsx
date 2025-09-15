import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { useState } from 'react';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { colors } from '@/theme/theme.global';
import TableLoading from '@/components/TableLoading';
import { PipelineItemTypeEnum, RecordContentType } from '@/constants/app.constants'
import ProgressBar from '@ramonak/react-progress-bar';
import styles from './record-table.module.scss';
import { readUrl } from '@/utils/readUrl';
import moment from 'moment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { deteleRecord, publishLastVRecord } from '@/repositories/record.repository';
import _ from 'lodash';
import { useSnackbar } from 'notistack';


const ActionTableCell = ({ item, onRefresh, publishable }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [publishing, setPublishing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    event.preventDefault();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePublishLastRecord = (e) => {
    e.preventDefault();
    setPublishing(true);
    publishLastVRecord(item.id)
      .then(() => {
        onRefresh();
      })
      .catch((err) => { console.log(err) })
      .finally(() => setPublishing(false));
  }

  const handleEditRecord = (e) => {
    handleClose();
    e.preventDefault();
  }

  const handleDeleteRecord = (e) => {
    handleClose();
    e.preventDefault();
    deteleRecord(item.id)
      .then(() => {
        enqueueSnackbar('Xóa tóm tắt thành công', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });
        onRefresh();
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar('Xóa tóm tắt thất bại', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });
      });
  }

  return (
    <TableCell align='right' width="10%">
      <div className='flex'>
        {item?.published
          ? <IconButton
            onClick={(e) => {
              navigate('/records/' + item.id + '/play');
              e.preventDefault();
            }}>
            <Tooltip title="Xem">
              <PlayArrowRoundedIcon sx={{ width: '30px', height: '30px' }} />
            </Tooltip>
          </IconButton>
          :
          <div>
            {!publishing
              ? <Tooltip title={publishable ? "Xuất bản" : "Bạn không thể xuất bản vì chưa hoàn thành"}>
                <IconButton onClick={handlePublishLastRecord} disabled={!publishable}>
                  <PublishOutlinedIcon />
                </IconButton>
              </Tooltip>
              : <div className={styles.loadingContainer}>
                <CircularProgress size='20px' />
              </div>
            }
          </div>
        }
        <IconButton onClick={handleClick}>
          <Tooltip title="Thêm">
            <MoreVertIcon sx={{ width: '30px' }} />
          </Tooltip>
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}>
          <div className="inside-popover">
            <ul className="menu-list">
              <li className="menu-list-item" onClick={handleEditRecord}>
                <DriveFileRenameOutlineIcon className='mr-3' />
                {'Sửa'}
              </li>
              <Divider className="my-[2px]" />
              <li className="menu-list-item red" onClick={handleDeleteRecord}>
                <DeleteOutlineIcon className='mr-3' />
                {'Xóa'}
              </li>
            </ul>
          </div>
        </Popover>
      </div>
    </TableCell>
  );
}

export const RecordTable = ({
  totalCount = 0,
  records = [],
  onPageChange = () => { },
  onRowsPerPageChange,
  offset = 0,
  limit = 10,
  isLoading,
  onRefresh,
  onChangeFilter = (filter) => { }
}) => {
  const [filter, setFilter] = useState({
    search: '',
    unpublished: false
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleChangePage = (event, newPage) => {
    onPageChange(event, newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onRowsPerPageChange(event.target.value);
  };

  const handleSearchChange = (e) => {
    setFilter({ ...filter, search: e.target.value });
  };

  const handleUnpublishedToggle = () => {
    setFilter({ ...filter, unpublished: !filter.unpublished });
  };

  const getProgressRecord = (record) => {
    const pipelines = record.pipeline_items.filter(x => x.type !== PipelineItemTypeEnum.CHATBOT_PREPARATION);
    if (_.isEmpty(pipelines)) return false;
    const errorItems = _.filter(pipelines, x => x.status === "Failed");
    const count = _.filter(pipelines, x => x.status === "Success").length
    return {
      percentage: (count / pipelines.length) * 100,
      isCompleted: count === pipelines.length,
      isFailed: !_.isEmpty(errorItems)
    };
  }

  return (
    <div className='flex flex-col'>
      <div className='flex my-[15px] justify-between'>
        <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
          <div>
            <Button
              onClick={(event) => setAnchorEl(event.currentTarget)}
              size="small"
              variant="outlined"
              startIcon={<TuneIcon />}
              fullWidth={false}>
              Lọc
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              PaperProps={{ sx: { width: '250px', padding: '10px' } }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
              <Stack sx={{ width: '100%', backgroundColor: 'white' }}>
                <Button
                  sx={{ fontSize: '14px', height: '30px', borderRadius: '4px' }}
                  variant="contained"
                  fullWidth={false}
                  onClick={handleUnpublishedToggle}>
                  Apply
                </Button>
              </Stack>
            </Popover>
            <Button
              onClick={handleUnpublishedToggle}
              sx={{
                marginLeft: '10px',
                ...(filter.unpublished && {
                  color: 'white',
                  backgroundColor: 'black',
                  "&:hover": {
                    borderColor: 'gray',
                    backgroundColor: 'gray'
                  }
                })
              }}
              variant={filter.unpublished ? "contained" : "outlined"}
              size="small"
              fullWidth={false}>
              Sản phẩm chưa phát hành
            </Button>
          </div>
          <TextField
            size='small'
            value={filter.search}
            placeholder='Tìm theo tên'
            InputProps={{
              startAdornment: <InputAdornment
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
            onChange={handleSearchChange} />
        </Stack>
      </div>
      {isLoading
        ? <div><TableLoading /></div>
        : <div>
          <div className='min-w-[800] min-h-[65vh]'>
            <Table>
              <TableHead className='bg-white'>
                <TableRow sx={{ borderTop: `1px solid ${colors.borderColor}`, borderBottom: `1px solid ${colors.borderColor}` }}>
                  <TableCell>Tiêu đề</TableCell>
                  <TableCell>Bộ sưu tập</TableCell>
                  <TableCell>Thể loại</TableCell>
                  <TableCell>Tiến trình</TableCell>
                  <TableCell align='center'>Trạng thái</TableCell>
                  <TableCell>Người tạo</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell align='right'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((item, index) => {
                  const { isCompleted, percentage, isFailed } = getProgressRecord(item);

                  return (
                    <TableRow hover key={item.id}>
                      <TableCell width="20%">
                        <Tooltip title={item.title}>
                          <Typography
                            sx={{
                              maxWidth: '250px',
                              fontWeight: 600,
                              overflow: 'hidden',
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis"
                            }} variant="subtitle2">
                            {item.title}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell width="10%">{item.collection ? item.collection.title : `-`}</TableCell>
                      <TableCell width="10%">{item.record_content_type ? RecordContentType[item.record_content_type] : '-'}</TableCell>
                      <TableCell>
                        <ProgressBar
                          barContainerClassName={styles.container}
                          bgColor={isCompleted ? '#10b981' : (isFailed ? colors.errorColor : '#EED202')}
                          labelClassName={styles.label}
                          borderRadius='0px'
                          completed={Math.round(percentage)}
                          customLabel={`${Math.round(percentage)}%`}
                        />
                      </TableCell>
                      <TableCell align='center' width="10%">{item.published ? `Đã xuất bản` : `Lưu nháp`}</TableCell>
                      <TableCell>
                        <div className='flex gap-2'>
                          <Avatar sx={{ width: '24px', height: '24px' }}
                            alt='avatar'
                            src={readUrl(item?.creator?.avatar, true)} />
                          <Typography fontSize="13px" fontWeight="500">{item?.creator?.full_name}</Typography>
                        </div>
                      </TableCell>
                      <TableCell>{moment(item.created_at).format("DD/MM/YYYY")}</TableCell>
                      <ActionTableCell publishable={isCompleted} onRefresh={onRefresh} item={item} />
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component="div"
            count={totalCount}
            page={offset}
            onPageChange={handleChangePage}
            rowsPerPage={limit}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      }
    </div >
  );
};