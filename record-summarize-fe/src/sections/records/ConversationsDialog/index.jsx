import { deleteItems, getConversationsByRecordId } from "@/repositories/conversation.repository";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { Search } from '@mui/icons-material';
import { colors } from "@/theme/theme.global";
import moment from "moment";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import styles from './style.module.scss';
import LoadingButton from "@/components/buttons/LoadingButton";
import _, { debounce } from "lodash";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";

moment.locale("vi");
const ConversationsDialog = ({
  recordId, open,
  onClose = () => { }, onConversationClick, onCreateConversation
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [filter, setFilter] = useState({
    s: '',
    page: 1,
    limit: 10
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    total: 0,
    page: 0,
    limit: 0,
    items: []
  });
  const appliedFilter = useMemo(() => ({
    s: filter.s,
    page: filter.page,
    limit: filter.limit,
  }), [filter.s, filter.page, filter.limit]);

  const handleSearchChange = useCallback(debounce((e) => { setFilter({ ...filter, s: e.target.value }) }, 300), []);

  const getConverstations = () => {
    setLoading(true);
    getConversationsByRecordId(recordId, filter)
      .then(setData)
      .catch((error) => {
        console.log(error);
        enqueueSnackbar('Có lỗi xảy ra. Vui lòng thử lại', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setSelectedRows([]);
    getConverstations();
  }, [appliedFilter]);

  useEffect(() => {
    setFilter({
      s: '',
      page: 1,
      limit: 10
    });
    setSelectedRows([]);
    if (open) {
      getConverstations();
    }
  }, [open]);

  const handleClick = (conversationId) => {
    onClose();
    onConversationClick(conversationId);
  }

  const handleCreateNew = () => {
    onClose();
    onCreateConversation();
  }

  const handleSelectedAll = (event) => {
    setSelectedRows(event.target.checked ? data?.items?.map(x => x.id) : []);
  }

  const handleSelectOne = (event, item) => {
    var newList = [];
    if (event.target.checked) {
      newList = [...selectedRows, item?.id];
    } else {
      newList = selectedRows.filter(x => x !== item?.id);
    }
    setSelectedRows(newList);
  }

  const handleDeleteItems = () => {
    if (_.isEmpty(selectedRows)) return;
    deleteItems(selectedRows)
      .then((response) => {
        getConverstations();
        setSelectedRows([]);
        enqueueSnackbar(`Đã xóa ${selectedRows.length} đoạn hội thoại.`, {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar('Có lỗi xảy ra. Vui lòng thử lại', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });
      });
  }

  return (
    <form>
      <Dialog open={open} maxWidth='sm' fullWidth onClose={onClose}>
        <DialogTitle sx={{ padding: "10px 5px", fontSize: '14px' }}>
          <IconButton onClick={onClose} sx={{ mr: '10px' }}><CloseIcon /></IconButton>
          Lịch sử
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <div className="flex gap-2">
            <TextField
              onChange={handleSearchChange}
              size='small' fullWidth placeholder='Tìm theo tên'
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
              sx={{ width: '130px' }}>
              Tạo mới
            </Button>
          </div>
          <Table className={styles.tableView} stickyHeader sx={{ mt: '20px' }}>
            <TableHead className='bg-white'>
              <TableRow sx={{ borderTop: `1px solid ${colors.borderColor}`, borderBottom: `1px solid ${colors.borderColor}` }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selectedRows.length > 0 && selectedRows < data?.items?.length}
                    checked={data?.items?.length > 0 && selectedRows?.length === data?.items?.length}
                    onChange={handleSelectedAll}
                    inputProps={{ 'aria-label': 'select all desserts', }}
                  />
                </TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Thời gian tạo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items?.map((item, index) => {
                const selected = Boolean(selectedRows.find(x => x === item?.id));
                return (
                  <TableRow hover key={item.id}>
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" onChange={(e) => handleSelectOne(e, item)} checked={selected} inputProps={{}} />
                    </TableCell>
                    <TableCell>
                      <div className={styles.conversationName} onClick={() => handleClick(item.id)}>{item?.title}</div>
                    </TableCell>
                    <TableCell>{moment(item.created_at).startOf('day').fromNow()}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </DialogContent >
        <DialogActions className={styles.dialogAction}>
          <div className="flex flex-col gap-2 w-full">
            <TablePagination
              className={styles.tablePagination}
              count={data?.total}
              labelRowsPerPage="Số bản ghi/trang"
              labelDisplayedRows={({ from, to, count, page }) => `${from} - ${to} trên ${count !== -1 ? count : `hơn ${to}`}`}
              page={data?.page - 1}
              onPageChange={(e, page) => setFilter({ ...filter, page })}
              rowsPerPage={data?.limit}
              rowsPerPageOptions={[10, 20, 50, 100, { value: -1, label: 'Tất cả' }]}
            //   onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <div className="flex w-full justify-end p-[15px]">
              <LoadingButton variant="contained" disabled={_.isEmpty(selectedRows)}
                startIcon={<DeleteOutlineIcon />} onClick={handleDeleteItems}
                sx={{
                  backgroundColor: '#FF6B6B',
                  ['&:hover']: {
                    backgroundColor: '#FF6B6B',
                  }
                }}>
                Xóa {selectedRows.length > 0 ? `(${selectedRows.length})` : ''} cuộc trò chuyện
              </LoadingButton>
            </div>
          </div>
        </DialogActions>
      </Dialog >
    </form >
  )
}

export default ConversationsDialog;