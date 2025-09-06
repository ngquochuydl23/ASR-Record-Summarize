import {
  Button,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { colors } from '@/theme/theme.global';
import { formatNumCell } from '@/utils/format.num.cell';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import IcEditRow from '@/assets/icons/IcEditRow';
import { BootstrapSelect, BootstrapSelectOption } from '@/components/fields/BootstrapSelect';
import IcDelRow from '@/assets/icons/IcDelRow';
import { useConfirmDialog } from '@/contexts/ConfirmDialogContext';

const CategoryRowItem = ({
  item,
  child = false,
  isExpanded = false,
  onExpandClick,
  onDeleteRow = (item) => {},
  onUpdateRow= (item) => {}
}) => {
  const [status, setStatus] = useState(false);
  const confirmDialog = useConfirmDialog();

  const handleOnDeleteClick = async (item) => {
    const isConfirmed = await confirmDialog({
      title: "Xóa danh mục",
      content: "Bạn có chắc chắn muốn xóa vĩnh viên danh mục này không?",
      button: {
        cancel: {
          text: 'Hủy'
        },
        confirm: {
          text: "Xác nhận"
        }
      }
    });

    if (isConfirmed) {
      onDeleteRow(item);
    }
  }

  return (
    <TableRow
      sx={{
        ...(item.children.length > 0 && {
          borderBottom: 'none'
        })
      }}
      key={item.id}>
      {/* <TableCell padding="checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectOne(item.id)}
                        />
                      </TableCell> */}
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          {!child
            ? <Button
              sx={{ padding: 0, minWidth: '24px', color: colors.primaryColor }}
              onClick={onExpandClick}
              size="small">
              {isExpanded ? <ExpandMore /> : <ChevronRight />}
            </Button>
            : <div className='w-[24px]'></div>
          }
          <Typography variant="subtitle2">{item.title}</Typography>
        </Stack>
      </TableCell>
      <TableCell>{`-`}</TableCell>
      <TableCell>
        <BootstrapSelect
          size="small"
          startAdornment={
            <div className={status ? "text-successColorBg mr-2" : "text-errorColorBg mr-2"}>●</div>
          }
          sx={{ borderRadius: '30px', minWidth: '150px' }}
          value={status}
          onChange={(e) => { setStatus(e.target.value) }}>
          <BootstrapSelectOption value={true} defaultValue>Hoạt động</BootstrapSelectOption>
          <BootstrapSelectOption value={false}>Ngừng Hoạt Động</BootstrapSelectOption>
        </BootstrapSelect>
      </TableCell>
      <TableCell>{formatNumCell(item.products.length)}</TableCell>
      <TableCell align='right'>
        <div className='flex gap-[10px] justify-center'>
          <IconButton onClick={() => onUpdateRow(item)}>
            <IcEditRow />
          </IconButton>
          <IconButton onClick={() => handleOnDeleteClick(item)}>
            <IcDelRow />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  )
};

export default CategoryRowItem;