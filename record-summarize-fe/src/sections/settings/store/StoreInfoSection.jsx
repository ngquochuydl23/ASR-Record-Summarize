import LoadingButton from '@/components/buttons/LoadingButton';
import DashboardCard from '@/components/card/DashboardCard';
import { BootstrapInput } from '@/components/fields/BootstrapField';
import { FormControl, InputLabel } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useSelector } from 'react-redux';
import * as Yup from "yup";
import _ from 'lodash';
import { BootstrapAutocomplete } from '@/components/fields/BootstrapAutocomplete';
import { useState } from 'react';

const StoreInfoSection = () => {
  const { store } = useSelector((state) => state.store);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    name: Yup
      .string()
      .required("Tên cửa hàng là bắt buộc"),
    fullName: Yup
      .string()
      .required("Tên đầy đủ dẫn là bắt buộc"),
    email: Yup
      .string()
      .email()
      .required("Email là bắt buộc"),
    hotlines: Yup
      .array()
      .of(Yup
        .string()
        .matches(
          /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
          "Số điện thoại không hợp lệ"
        ))
      .min(1, "Phải có ít nhất một số điện thoại"),
  });

  const handleSubmit = async (values, { setFieldError, resetForm }) => {

  }

  return (
    <DashboardCard>
      <Formik
        initialValues={store}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ errors, touched, dirty, setFieldValue, setFieldError }) => {
          return (
            <Form className='flex flex-col items-end gap-2'>
              <FormControl variant="standard" fullWidth>
                <InputLabel shrink htmlFor="name">Tên cửa hàng</InputLabel>
                <Field
                  as={BootstrapInput}
                  name="name"
                  id="name"
                  size="small"
                  sx={{ fontSize: "14px" }}
                  fullWidth
                />
                {touched.name && errors.name && (
                  <div className="text-errorColor text-[12px] mt-[2px]">
                    {errors.name}
                  </div>
                )}
              </FormControl>
              <FormControl variant="standard" fullWidth>
                <InputLabel shrink htmlFor="fullName">Tên công ty</InputLabel>
                <Field
                  as={BootstrapInput}
                  name="fullName"
                  id="fullName"
                  size="small"
                  sx={{ fontSize: "14px" }}
                  fullWidth
                />
                {touched.fullName && errors.fullName && (
                  <div className="text-errorColor text-[12px] mt-[2px]">
                    {errors.slug}
                  </div>
                )}
              </FormControl>
              <FormControl variant="standard" fullWidth>
                <InputLabel shrink htmlFor="email">Email</InputLabel>
                <Field
                  as={BootstrapInput}
                  name="email"
                  id="email"
                  size="small"
                  sx={{ fontSize: "14px" }}
                  fullWidth
                />
                {touched.email && errors.email && (
                  <div className="text-errorColor text-[12px] mt-[2px]">
                    {errors.email}
                  </div>
                )}
              </FormControl>
              <FormControl variant="standard" fullWidth>
                <InputLabel shrink htmlFor="hotlines" size="small">Hotlines</InputLabel>
                <BootstrapAutocomplete
                  id="hotlines"
                  name="hotlines"
                  freeSolo
                  multiple
                  getOptionKey={(option) => option}
                  getOptionLabel={(option) => option}
                  onChange={(e, value, reason) => {
                    console.log(value);
                    setFieldValue("hotlines", value);
                  }}
                />
                {touched.hotlines && errors.hotlines && (
                  <div className="text-errorColor text-[12px] mt-[2px]">
                    {errors.hotlines}
                  </div>
                )}
              </FormControl>
              <LoadingButton
                sx={{ marginTop: "20px", minWidth: '100px' }}
                disabled={!dirty || !_.isEmpty(errors)}
                loading={loading}
                fullWidth={false}
                size="large"
                variant="contained"
                type="submit">
                Tạo
              </LoadingButton>
            </Form>
          )
        }}
      </Formik>
    </DashboardCard>
  )
}

export default StoreInfoSection;