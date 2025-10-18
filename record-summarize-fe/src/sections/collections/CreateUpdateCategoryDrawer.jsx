import LoadingButton from '@/components/buttons/LoadingButton';
import { BootstrapInput } from '@/components/fields/BootstrapField';
import { FormControl, InputLabel } from '@mui/material'
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from "yup";
import _ from 'lodash';
import { createCategory, getCategories, updateCategory } from '@/repositories/category.repository';
import { HttpCommonMsg } from '@/constants/app.constants';
import { useSnackbar } from 'notistack';
import { useAsyncFn } from 'react-use';
import { BootstrapAutocomplete } from '@/components/fields/BootstrapAutocomplete';
import BaseDrawer, { BaseHeaderDrawer } from '@/components/BaseDrawer';
import { generateSlug } from '@/utils/generateSlug';

const CreateUpdateCategoryDrawer = ({ open, onClose, onCreate, category }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object({
    title: Yup
      .string()
      .required("Tên danh mục là bắt buộc"),
    slug: Yup
      .string()
      .required("Đường dẫn là bắt buộc"),
    description: Yup
      .string(),
    parentId: Yup
      .string()
      .notRequired(),
  });

  const handleSubmit = async (values, { setFieldError, resetForm }) => {
    setLoading(true);
    const isEditing = !!category?.id;
    const action = isEditing ? updateCategory(category.id, values) : createCategory(values);
    action
      .then((category) => {
        enqueueSnackbar(isEditing ? 'Cập nhật thành công' : 'Tạo thành công', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });
        onClose();
        resetForm();
        onCreate(category);
      })
      .catch((err) => {
        if (err === HttpCommonMsg.EXISTED) {
          setFieldError('slug', 'Đường dẫn đã tồn tại');
          enqueueSnackbar('Đường dẫn đã tồn tại', {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [{ loading: fetchLoading, value: parentData, error }, getAll] = useAsyncFn(async () => {
    return await getCategories();
  }, []);

  const bind = (categories, values) => {
    console.log("values: " + category);
    console.log(category);
    console.log(categories);
    console.log(_.find(categories, x => x.id == values));
    return _.find(categories, x => x.id == values)?.title || '';
  }

  useEffect(() => {
    getAll();
  }, [open])

  return (
    <BaseDrawer open={open} onClose={onClose}>
      <div className='flex flex-col'>
        <Formik
          initialValues={{
            title: '',
            slug: '',
            description: '',
            parentId: null,
            ...category
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ errors, touched, dirty, setFieldValue, setFieldError, values }) => {
            return (
              <Form>
                <BaseHeaderDrawer title={category?.id ? "Cập nhật danh mục" : "Tạo danh mục"} onClose={onClose}>
                  <LoadingButton
                    disabled={!dirty || !_.isEmpty(errors)}
                    loading={loading}
                    fullWidth={false}
                    variant='contained'
                    type='submit'
                    size='medium'
                    sx={{}}>
                    {category?.id ? 'Lưu' : 'Tạo'}
                  </LoadingButton>
                </BaseHeaderDrawer>
                <FormControl
                  variant="standard"
                  fullWidth
                  onChange={(e) => {
                    setFieldValue('slug', generateSlug(e.target.value));
                  }}>
                  <InputLabel shrink htmlFor="title">Tên danh mục</InputLabel>
                  <Field
                    as={BootstrapInput}
                    name="title"
                    id="title"
                    size="small"
                    sx={{ fontSize: "14px" }}
                    fullWidth
                  />
                  {touched.title && errors.title && (
                    <div className="text-errorColor text-[12px] mt-[2px]">
                      {errors.title}
                    </div>
                  )}
                </FormControl>
                <FormControl
                  variant="standard" fullWidth sx={{ mt: '10px' }}>
                  <InputLabel shrink htmlFor="slug">Đường dẫn</InputLabel>
                  <Field
                    as={BootstrapInput}
                    name="slug"
                    id="slug"
                    size="small"
                    sx={{ fontSize: "14px" }}
                    fullWidth
                  />
                  {touched.slug && errors.slug && (
                    <div className="text-errorColor text-[12px] mt-[2px]">
                      {errors.slug}
                    </div>
                  )}
                </FormControl>
                <FormControl variant="standard" fullWidth sx={{ mt: '10px' }}>
                  <InputLabel shrink htmlFor="description">Mô tả</InputLabel>
                  <Field
                    as={BootstrapInput}
                    name="description"
                    id="description"
                    size="small"
                    sx={{ fontSize: "14px" }}
                    fullWidth
                  />
                  {touched.description && errors.description && (
                    <div className="text-errorColor text-[12px] mt-[2px]">
                      {errors.description}
                    </div>
                  )}
                </FormControl>
                <FormControl variant="standard" fullWidth sx={{ mt: '10px' }}>
                  <InputLabel shrink htmlFor="parentId" size="small">Danh mục cha</InputLabel>
                  <BootstrapAutocomplete
                    id="parentId"
                    name="parentId"
                    options={parentData?.categories || []}
                    loading={fetchLoading}
                    getOptionKey={(option) => option.id}
                    getOptionLabel={(option) => option.title}
                    value={bind(parentData?.categories || [], values.parentId)}
                    onChange={(e, value, reason) => setFieldValue('parentId', value?.id || null)}
                  />
                  {touched.parentId && errors.parentId && (
                    <div className="text-errorColor text-[12px] mt-[2px]">
                      {errors.parentId}
                    </div>
                  )}
                </FormControl>
                {/* <FormControl variant="standard" fullWidth sx={{ mt: '10px' }}>
                  <InputLabel shrink htmlFor="billboards" size="small">Biển quảng cáo</InputLabel>
                  <BootstrapAutocomplete
                    id="billboardsId"
                    name="billboardsId"
                    multiple
                    options={value.categories || []}
                    getOptionKey={(option) => option.id}
                    getOptionLabel={(option) => option.title}
                    loading={fetchLoading}
                  //onChange={(e, value, reason) => setFieldValue('parentId', value.id)}
                  />
                  {touched.wardOrVillage && errors.wardOrVillage && (
                    <div className="text-errorColor text-[12px] mt-[2px]">
                      {errors.wardOrVillage}
                    </div>
                  )}
                </FormControl> */}
              </Form>
            )
          }}
        </Formik>
      </div>
    </BaseDrawer>
  )
}

export default CreateUpdateCategoryDrawer;