import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required('Tiêu đề không được để trống')
    .min(1, 'Tiêu đề phải có ít nhất 1 ký tự')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
});

const EditConversationTitleDialog = ({ open, onClose, conversation, onSave }) => {
  const [loading, setLoading] = useState(false);
  console.log(conversation);
  const formik = useFormik({
    initialValues: {
      title: '',
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await onSave(conversation.id, values.title.trim());
        formik.resetForm();
        onClose();
      } catch (error) {
        console.error('Error saving title:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (conversation && open) {
      formik.resetForm({
        values: { title: conversation?.title || '' }
      });
    }
  }, [conversation, open]);

  const handleClose = () => {
    if (!loading) {
      formik.resetForm();
      onClose();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      formik.handleSubmit();
    }
  };

  const isDirty = formik.values.title !== (conversation?.title || '');
  const isInvalid = !formik.isValid || Boolean(formik.errors.title);
  const isSaveDisabled = loading || !isDirty || (formik.touched.title && isInvalid);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Đổi tên cuộc hội thoại
        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={loading}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          name="title"
          label="Tiêu đề"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onKeyPress={handleKeyPress}
          disabled={loading}
          placeholder="Nhập tiêu đề mới..."
          variant="outlined"
          margin="normal"
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          disabled={isSaveDisabled}
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditConversationTitleDialog;
