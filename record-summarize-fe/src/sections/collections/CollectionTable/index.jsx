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
  Typography,
  Skeleton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { useMemo, useState } from 'react';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { colors } from '@/theme/theme.global';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSnackbar } from 'notistack';
import { delCategory } from '@/repositories/category.repository';
import { useConfirmDialog } from '@/contexts/ConfirmDialogContext';
import TableSortLabel from '@mui/material/TableSortLabel';

// Skeleton component for loading state
const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton variant="text" width="60%" height={20} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width="30%" height={20} />
    </TableCell>
    <TableCell>
      <div className='flex gap-2'>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width="80%" height={20} />
      </div>
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width="40%" height={20} />
    </TableCell>
    <TableCell align='right'>
      <Skeleton variant="circular" width={30} height={30} />
    </TableCell>
  </TableRow>
);

const ActionTableCell = ({ item, onRefresh, onEdit }) => {
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirmDialog();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    event.preventDefault();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    onEdit(item);
  };

  const handleDelete = async () => {
    handleClose();
    const ok = await confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bộ sưu tập này? Hành động không thể hoàn tác.',
      button: { confirm: { text: 'Xóa' }, cancel: { text: 'Hủy' } }
    });
    if (!ok) return;
    try {
      await delCategory(item.id);
      enqueueSnackbar('Xóa danh mục thành công', {
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
      });
      onRefresh();
    } catch (err) {
      enqueueSnackbar(err?.message || 'Xóa thất bại', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
      });
    }
  };

  return (
    <TableCell align='right' width="10%">
      <IconButton onClick={handleClick}>
        <Tooltip title="Thao tác">
          <MoreVertIcon sx={{ width: '30px', height: '30px' }} />
        </Tooltip>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <DriveFileRenameOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sửa</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xóa</ListItemText>
        </MenuItem>
      </Menu>
    </TableCell>
  );
}

export const CollectionTable = ({
  totalCount = 0,
  collections = [],
  onPageChange = () => { },
  onRowsPerPageChange,
  page = 0,
  limit = 10,
  isLoading,
  onRefresh,
  onChangeFilter = (filter) => { },
  onSearchChange = () => { },
  onRequestEdit = () => { },
  onSortChange = () => { },
  sort = { orderBy: null, order: 'asc' }
}) => {
  const [filter, setFilter] = useState({
    search: '',
    unpublished: false,
    title: '',
    creator: ''
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
    const searchValue = e.target.value;
    setFilter({ ...filter, search: searchValue });
    onSearchChange(searchValue);
  };

  const handleUnpublishedToggle = () => {
    setFilter({ ...filter, unpublished: !filter.unpublished });
  };

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
              <Stack sx={{ width: '100%', backgroundColor: 'white' }} spacing={1}>
                <TextField
                  size='small'
                  label='Tiêu đề'
                  value={filter.title}
                  onChange={(e) => setFilter({ ...filter, title: e.target.value })}
                />
                <TextField
                  size='small'
                  label='Người tạo'
                  value={filter.creator}
                  onChange={(e) => setFilter({ ...filter, creator: e.target.value })}
                />
                <div className='flex gap-2 justify-end mt-1'>
                  <Button size='small' onClick={() => setFilter({ ...filter, title: '', creator: '' })}>Xóa</Button>
                  <Button
                    sx={{ fontSize: '14px', height: '30px', borderRadius: '4px' }}
                    variant="contained"
                    fullWidth={false}
                    onClick={() => { onChangeFilter({ title: filter.title, creator: filter.creator }); setAnchorEl(null); }}>
                    Áp dụng
                  </Button>
                </div>
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
            placeholder='Tìm kiếm ...'
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
      <div className='min-w-[800] min-h-[65vh]'>
        <Table>
          <TableHead className='bg-white'>
            <TableRow sx={{ borderTop: `1px solid ${colors.borderColor}`, borderBottom: `1px solid ${colors.borderColor}` }}>
              <TableCell sortDirection={sort.orderBy === 'title' ? sort.order : false}>
                <TableSortLabel
                  active={sort.orderBy === 'title'}
                  direction={sort.orderBy === 'title' ? sort.order : 'asc'}
                  onClick={() => onSortChange('title')}
                >
                  Tiêu đề
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sort.orderBy === 'record_count' ? sort.order : false}>
                <TableSortLabel
                  active={sort.orderBy === 'record_count'}
                  direction={sort.orderBy === 'record_count' ? sort.order : 'asc'}
                  onClick={() => onSortChange('record_count')}
                >
                  Số video
                </TableSortLabel>
              </TableCell>
              <TableCell>Người tạo</TableCell>
              <TableCell>Chia sẻ</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              // Show skeleton rows while loading
              Array.from({ length: limit }).map((_, index) => (
                <SkeletonRow key={`skeleton-${index}`} />
              ))
            ) : (
              // Show actual data
              collections.map((item, index) => {
                return (
                  <TableRow hover key={item.id}>
                    <TableCell width="15%">
                      <Tooltip title={item.title}>
                        <Typography
                          sx={{
                            maxWidth: '200px',
                            fontWeight: 600,
                            overflow: 'hidden',
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis"
                          }} variant="subtitle2">
                          {item.title}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{item.record_count || 0}</TableCell>
                    <TableCell>
                      <div className='flex gap-2'>
                        <Avatar sx={{ width: '24px', height: '24px' }}
                          alt='avatar'
                          src={item?.creator?.avatar} />
                        <Typography fontSize="13px" fontWeight="500">{item?.creator?.full_name}</Typography>
                      </div>
                    </TableCell>
                    <TableCell align='center' width="10%">
                      {item.parent ? 'Có' : 'Không'}
                    </TableCell>
                    <ActionTableCell item={item} onRefresh={onRefresh} onEdit={onRequestEdit} />
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={limit}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div >
  );
};