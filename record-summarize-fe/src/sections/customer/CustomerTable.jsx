import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
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
  Typography
} from '@mui/material';
import millify from "millify";
import TuneIcon from '@mui/icons-material/Tune';
import { useState } from 'react';
import { Search } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { colors } from '@/theme/theme.global';
import { stringToColor } from '@/utils/avatar/stringToColor';
import { getInitCharOfFullName } from '@/utils/avatar/getInitCharOfFullName';
import readS3Object from '@/utils/avatar/readS3Object';
import TableLoading from '@/components/TableLoading';

export const CustomerTable = (props) => {
  const {
    totalCount = 0,
    isLoading = false,
    list = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => { },
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    offset = 0,
    limit = 10,
    selected = []
  } = props;

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

  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll(list.map((item) => item.id));
    }
  };

  const handleSelectOne = (id) => {
    if (onSelectOne) {
      onSelectOne(id);
    }
  };


  if (isLoading) {
    return <TableLoading />
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
              <Stack
                sx={{ width: '100%', backgroundColor: 'white' }}>
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
      <div className='min-w-[800] min-h-[65vh]'>
        <Table>
          <TableHead className='bg-white'>
            <TableRow sx={{ borderTop: `1px solid ${colors.borderColor}`, borderBottom: `1px solid ${colors.borderColor}` }}>
              <TableCell padding="checkbox">
                <input
                  type="checkbox"
                  checked={selected.length === list.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ngày đăng ký</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item, index) => {
              const isSelected = selected.includes(item.id);
              return (
                <TableRow
                  hover
                  component={Link}
                  to={"./list/" + item.id}
                  sx={{ textDecoration: 'none' }}
                  key={item.id}
                  selected={isSelected}>
                  <TableCell padding="checkbox">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectOne(item.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={2}>
                      <Avatar
                        sx={{
                          height: '40px',
                          width: '40px',
                          bgcolor: stringToColor(item.fullName),
                          fontSize: '13px'
                        }}
                        src={readS3Object(item.avatar)}>
                        {getInitCharOfFullName(item.fullName)}
                      </Avatar>
                      <Typography
                        sx={{ fontWeight: '500' }}
                        variant="subtitle2">
                        {item.fullName}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontWeight: '500' }}>{item.phoneNumber}</TableCell>
                  <TableCell sx={{ fontWeight: '500' }}>{item.email}</TableCell>
                  <TableCell sx={{ fontWeight: '500' }}>{item.createdAt}</TableCell>
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
  );
};

CustomerTable.propTypes = {
  totalCount: PropTypes.number,
  list: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  offset: PropTypes.number,
  limit: PropTypes.number,
  selected: PropTypes.array,
  isLoading: PropTypes.bool
};
