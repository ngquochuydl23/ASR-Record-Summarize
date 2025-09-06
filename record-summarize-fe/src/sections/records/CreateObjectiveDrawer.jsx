import BaseDrawer, { BaseHeaderDrawer } from "@/components/BaseDrawer";
import LoadingButton from "@/components/buttons/LoadingButton";
import { BootstrapInput } from "@/components/fields/BootstrapField";
import { Button, FormControl, InputLabel } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useSnackbar } from "notistack";
import { useState } from "react";
import * as Yup from "yup";
import _ from 'lodash';
import { generateSlug } from "@/utils/generateSlug";
import { BootstrapAutocomplete } from "@/components/fields/BootstrapAutocomplete";
import IcWizard from "@/assets/icons/IcWizard";

const usersInOrg = [
  {
    id: 'a6bf6b62-4cda-43e4-b634-b0634bba3989',
    label: "Nguyễn Quốc Huy",
  },
  {
    id: '4e0725fc-b1db-48b9-8be9-21bd2e9a7862',
    label: "Nguyễn Xuân Sang (Admin)",
  }
]

const CreateObjectiveDrawer = ({ open, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
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
    keyResults: Yup
      .array()
  });

  const handleSubmit = async (values, { setFieldError, resetForm }) => {
    setLoading(true);
  }

  const generateContent = async () => {
    setGenerating(true);
  }

  return (
    <BaseDrawer
      open={open}
      onClose={onClose}
      PaperProps={{ width: '1000px' }}>
      <Formik
        initialValues={{
          title: '',
          slug: '',
          description: '',
          parentId: null
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ values, errors, touched, dirty, setFieldValue, setFieldError }) => {
          return (
            <Form>
              <BaseHeaderDrawer title="Tạo tóm tắt" onClose={onClose}>
                <LoadingButton
                  disabled={!dirty || !_.isEmpty(errors)}
                  loading={loading}
                  fullWidth={false}
                  variant='contained'
                  type='submit'
                  size='medium'
                  sx={{}}>
                  Tạo
                </LoadingButton>
              </BaseHeaderDrawer>
              <div className="flex flex-col">
                <div className="flex flex-col gap-2 mt-4">
                  <h5 className="mb-2 font-[600]">Objective information</h5>
                  <div className="flex gap-2">
                    <FormControl
                      variant="standard"
                      fullWidth
                      onChange={(e) => {
                        setFieldValue('slug', generateSlug(e.target.value));
                        setFieldError('slug', 'Đường dẫn đã tồn tại');
                      }}>
                      <InputLabel required shrink htmlFor="title">Objective name</InputLabel>
                      <Field
                        as={BootstrapInput}
                        name="title"
                        id="title"
                        size="small"
                        sx={{ fontSize: "14px" }}
                        fullWidth
                      />
                      {touched.title && errors.title ? (
                        <div className="text-errorColor text-[12px] mt-[2px]">
                          {errors.title}
                        </div>
                      ) : (<div div className="text-textSecondaryColor text-[12px] mt-[2px]">
                        Give your product a short and clear title.
                        50-60 characters is the recommended length for search engines.
                      </div>)}
                    </FormControl>
                    <Button
                      onClick={generateContent}
                      startIcon={<IcWizard />}
                      variant="outlined"
                      sx={{ width: '180px', marginTop: '24px' }}>
                      AI helper
                    </Button>
                  </div>
                  <FormControl
                    variant="standard" fullWidth sx={{ mt: '10px' }}>
                    <InputLabel shrink required htmlFor="slug">Slug</InputLabel>
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
                  <FormControl variant="standard" fullWidth >
                    <InputLabel shrink htmlFor="parentId" size="small">Supporters</InputLabel>
                    <BootstrapAutocomplete
                      // id="parentId"
                      // name="parentId"
                      multiple
                      options={usersInOrg || []}
                      getOptionKey={(option) => option.id}
                      getOptionLabel={(option) => option.label}
                    // loading={fetchLoading}
                    // onChange={(e, value, reason) => setFieldValue('parentId', value.id)}
                    />
                    {touched.wardOrVillage && errors.wardOrVillage && (
                      <div className="text-errorColor text-[12px] mt-[2px]">
                        {errors.wardOrVillage}
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
                </div>
                <h5 className="font-[600] w-full mt-4">Key Results</h5>
                <div className="text-textSecondaryColor text-[12px] mt-[2px] w-full">
                  Each objective must have <strong>at least 1</strong> key result to ensure progress can be tracked.<br />
                  To maintain clarity and focus, limit each objective to <strong>no more than 5</strong> key results.
                </div>
                <div className="flex flex-col gap-6 mt-4">
                  {_.map(values.keyResults, (keyResult) => (
                    <div>alo</div>
                  ))}
                </div>
                <Button variant="outlined" color="primary">Add key result</Button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </BaseDrawer >
  )
}

export default CreateObjectiveDrawer;