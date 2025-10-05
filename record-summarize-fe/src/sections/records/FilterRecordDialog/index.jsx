import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel } from '@mui/material';
import styles from './styles.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import { BootstrapAutocomplete } from '@/components/fields/BootstrapAutocomplete';
import { RecordContentTypes, SourceTypes, VideoLanguages } from '@/constants/app.constants';
import { useEffect, useMemo } from 'react';
import _ from 'lodash';

const FilterRecordDialog = ({ open, onClose, filterData }) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      record_content_type: [],
      source_type: null,
      lang: null
    },
    onSubmit: (values) => {
      onClose(values);
    }
  });

  useEffect(() => {
    const { record_content_type, source_type, lang } = filterData
    formik.setValues({
      record_content_type, source_type, lang
    });
  }, [filterData]);

  const shouldEnableFilter = useMemo(() => {
    return !_.isEqual(formik.values, formik.initialValues);
  }, [formik.values, formik.initialValues]);

  const handleReset = () => {
    formik.resetForm();
    onClose({
      record_content_type: [],
      source_type: null,
      lang: null
    });
  }

  const handleReturnNoData = () => {
    onClose(null);
  }

  return (
    <Dialog open={open} maxWidth='sm' fullWidth onClose={handleReturnNoData}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle sx={{ padding: "10px 5px", fontSize: '14px' }}>
          <IconButton onClick={handleReturnNoData} sx={{ mr: '10px' }}><CloseIcon /></IconButton>
          Lọc
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <div className={styles.form}>
            <FormControl variant="standard" fullWidth>
              <InputLabel shrink htmlFor="record_content_type" required size="small">Thể loại</InputLabel>
              <BootstrapAutocomplete
                multiple
                {...formik.getFieldProps("record_content_type")}
                placeholder="Chọn thể loại"
                value={formik.values?.record_content_type || []}
                options={RecordContentTypes || []}
                getOptionKey={(option) => option?.id}
                getOptionLabel={(option) => option.label}
                onChange={(e, value, reason) => formik.setFieldValue('record_content_type', value)}
              />
              {formik.touched?.record_content_type && formik.errors?.record_content_type && (
                <div className="text-errorColor text-[12px] mt-[2px]">{formik.errors?.record_content_type}</div>
              )}
            </FormControl>
            <FormControl variant="standard" fullWidth >
              <InputLabel shrink htmlFor="lang" size="small" required>Ngôn ngữ</InputLabel>
              <BootstrapAutocomplete
                id="lang"
                name="lang"
                placeholder="Chọn ngôn ngữ"
                value={VideoLanguages.find(x => x?.id === formik.values.lang) || null}
                options={VideoLanguages || []}
                getOptionKey={(option) => option?.id}
                getOptionLabel={(option) => option.label}
                onChange={(e, value, reason) => formik.setFieldValue('lang', value?.id)}
              />
              {formik.touched.lang && formik.errors.lang && (
                <div className="text-errorColor text-[12px] mt-[2px]">{formik.errors.lang}</div>
              )}
            </FormControl>
            <FormControl variant="standard" fullWidth >
              <InputLabel shrink htmlFor="lang" size="small" required>Nguồn video</InputLabel>
              <BootstrapAutocomplete
                {...formik.getFieldProps("source_type")}
                id="source_type"
                name="source_type"
                placeholder="Chọn nguồn video"
                value={SourceTypes.find(x => x?.id === formik.values.source_type) || null}
                options={SourceTypes || []}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option) => option.label}
                onChange={(e, value, reason) => { formik.setValues({ ...formik.values, source_type: value?.id }) }}
              />
              {formik.touched.source_type && formik.errors.source_type && (
                <div className="text-errorColor text-[12px] mt-[2px]">{formik.errors.source_type}</div>
              )}
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <div className={styles.dialogActions}>
            <Button className={styles.resetButton} variant='outlined' size='medium' type='reset' onClick={handleReset}>Xóa lọc</Button>
            <Button className={styles.filterButton} disabled={!shouldEnableFilter} disableElevation
              variant='contained' size='medium' type='submit'>Lọc</Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default FilterRecordDialog;