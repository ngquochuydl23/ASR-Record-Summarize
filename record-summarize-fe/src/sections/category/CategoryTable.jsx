import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Popover,
  Select,
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
import TableLoading from '@/components/TableLoading';
import { formatNumCell } from '@/utils/format.num.cell';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import _ from 'lodash';
import IcEditRow from '@/assets/icons/IcEditRow';
import CategoryRowItem from './CategoryRowItem';
import { delCategory } from '@/repositories/category.repository';
import { useSnackbar } from 'notistack';
import CreateUpdateCategoryDrawer from './CreateUpdateCategoryDrawer';



export const CategoryTable = ({
  totalCount = 0,
  categories = [],
  labels = [],
  onDeselectAll,
  onDeselectOne,
  onOffsetChange = () => { },
  onRowsPerPageChange,
  onSelectAll,
  onSelectOne,
  offset = 0,
  limit = 10,
  selected = [],
  onReload = () => { }
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [editingItem, setEditingItem] = useState(null);
  const [expanded, setExpanded] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [filter, setFilter] = useState({
    search: '',
    unpublished: false
  });

  const handleExpandClick = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRowUpdateClick = (item) => {
    console.log(item.title);
    setEditingItem(item);
  }

  const handleDrawerClose = () => {
    setEditingItem(null);
  }

  const handleChangePage = (event, newPage) => {
    onOffsetChange(event, newPage * limit);
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
      onSelectAll(categories.map((product) => product.id));
    }
  };

  const handleSelectOne = (id) => {
    if (onSelectOne) {
      onSelectOne(id);
    }
  };

  const handleDeleteCategory = (item) => {
    delCategory(item.id)
      .then(onReload)
      .catch((err) => {
        enqueueSnackbar(err, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });
      });
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
              startAdornment:
                <InputAdornment position="start" >
                  <Search />
                </InputAdornment>
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
              {/* <TableCell padding="checkbox">
                <input
                  type="checkbox"
                  checked={selected.length === categories.length}
                  onChange={onSelectAll}
                />
              </TableCell> */}
              {_.map(labels, (label) => <TableCell>{label}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((item) => {
              const isSelected = selected.includes(item.id);
              return (
                <>
                  <CategoryRowItem
                    item={item}
                    onDeleteRow={handleDeleteCategory}
                    onUpdateRow={handleRowUpdateClick}
                    isExpanded={expanded.includes(item.id)}
                    onExpandClick={() => handleExpandClick(item.id)} />
                  {item.children?.length > 0
                    && expanded.includes(item.id)
                    && item.children.map((child) =>
                      <CategoryRowItem
                        item={child}
                        child
                        onDeleteRow={handleDeleteCategory}
                        onUpdateRow={handleRowUpdateClick} />)}
                </>
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
      <CreateUpdateCategoryDrawer
        open={Boolean(editingItem)}
        category={editingItem}
        // onCreate={getAll}
        onClose={handleDrawerClose}
      />
    </div>
  );
};