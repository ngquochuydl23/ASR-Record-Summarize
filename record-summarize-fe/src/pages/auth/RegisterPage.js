import { Link as RouterLink, useNavigate } from "react-router-dom"
import { FormControl, InputLabel, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { BootstrapInput } from "@/components/fields/BootstrapField";
import _ from 'lodash';
import LoadingButton from "@/components/buttons/LoadingButton";
import * as Yup from "yup";
import { signUp } from "@/repositories/user.repository";
import { useSnackbar } from "notistack";

const RegisterPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    phoneNumber: Yup
      .string()
      .required('Vui lòng nhập số điện thoại'),
    email: Yup
      .string()
      .email('Email phải đúng định dạng')
      .required('Vui lòng nhập địa chỉ email'),
    lastName: Yup
      .string()
      .required('Vui lòng nhập họ'),
    firstName: Yup
      .string()
      .required('Vui lòng nhập tên'),
    password: Yup.string()
      .required('Vui lòng nhập mật khẩu')
      .min(8, 'Mật khẩu phải đủ 8 kí tự'),
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //   'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số và một ký tự đặc biệt'),

    confirmPassword: Yup.string()
      .required('Vui lòng nhập xác nhận mật khẩu')
      .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
  });

  const onSubmit = async values => {
    setLoading(true);
    signUp(values)
      .then((res) => {
        enqueueSnackbar('Đăng ký thành công', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });
        navigate('/auth/login');
      })
      .catch((error) => {
        if (!error) {
          enqueueSnackbar('Không thể kết nối đến máy chủ', {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
          return;
        }
        if (error === 'Existed.') {
          enqueueSnackbar('Số điện thoaị hoặc email đã được sử dụng.', {
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
  }

  return (
    <div className="flex flex-col">
      <Typography variant="h4" mt="100px">Tạo tài khoản</Typography>
      <div className="flex gap-2">
        <Typography variant="body2" fontWeight="400">Đã có tài khoản?</Typography>
        <Link to="/auth/login" component={RouterLink} variant="subtitle2">Đăng nhập</Link>
      </div>
      <Formik
        initialValues={{
          phoneNumber: '',
          email: '',
          lastName: '',
          firstName: '',
          password: '',
          confirmPassword: ''
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
        {({ errors, touched, dirty }) => {
          return (
            <Form className="mt-10 flex flex-col gap-4">
              <div className="flex gap-2">
                <FormControl variant="standard" fullWidth>
                  <InputLabel shrink htmlFor="lastName">Họ</InputLabel>
                  <Field
                    as={BootstrapInput}
                    name="lastName"
                    id="lastName"
                    size="small"
                    sx={{ fontSize: "14px" }}
                    fullWidth
                  />
                  {touched.lastName && errors.lastName && (
                    <div className="text-errorColor text-[12px] mt-[2px]">{errors.lastName}</div>
                  )}
                </FormControl>
                <FormControl variant="standard" fullWidth>
                  <InputLabel shrink htmlFor="firstName">Tên</InputLabel>
                  <Field
                    as={BootstrapInput}
                    name="firstName"
                    id="firstName"
                    size="small"
                    sx={{ fontSize: "14px" }}
                    fullWidth
                  />
                  {touched.firstName && errors.firstName && (
                    <div className="text-errorColor text-[12px] mt-[2px]">{errors.firstName}</div>
                  )}
                </FormControl>
              </div>
              <FormControl variant="standard" fullWidth>
                <InputLabel shrink htmlFor="phoneNumber">Số điện thoại</InputLabel>
                <Field
                  as={BootstrapInput}
                  name="phoneNumber"
                  id="phoneNumber"
                  size="small"
                  sx={{ fontSize: "14px" }}
                  fullWidth
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <div className="text-errorColor text-[12px] mt-[2px]">{errors.phoneNumber}</div>
                )}
              </FormControl>
              <FormControl variant="standard" fullWidth>
                <InputLabel shrink htmlFor="email">Địa chỉ email</InputLabel>
                <Field
                  as={BootstrapInput}
                  name="email"
                  id="email"
                  size="small"
                  sx={{ fontSize: "14px" }}
                  fullWidth
                />
                {touched.email && errors.email && (
                  <div className="text-errorColor text-[12px] mt-[2px]">{errors.email}</div>
                )}
              </FormControl>
              <FormControl variant="standard" fullWidth>
                <InputLabel shrink htmlFor="password">Mật khẩu</InputLabel>
                <Field
                  as={BootstrapInput}
                  name="password"
                  id="password"
                  size="small"
                  type="password"
                  sx={{ fontSize: "14px" }}
                  fullWidth
                />
                {touched.password && errors.password && (
                  <div className="text-errorColor text-[12px] mt-[2px]">{errors.password}</div>
                )}
              </FormControl>
              <FormControl variant="standard" fullWidth>
                <InputLabel shrink htmlFor="confirmPassword">Xác nhận mật khẩu</InputLabel>
                <Field
                  as={BootstrapInput}
                  name="confirmPassword"
                  id="confirmPassword"
                  size="small"
                  type="password"
                  sx={{ fontSize: "14px" }}
                  fullWidth
                />
                {touched.password && errors.password && (
                  <div className="text-errorColor text-[12px] mt-[2px]">{errors.password}</div>
                )}
              </FormControl>
              <LoadingButton
                sx={{ marginTop: "20px" }}
                disabled={!dirty || !_.isEmpty(errors)}
                loading={loading}
                fullWidth
                size="large"
                variant="contained"
                type="submit">
                Đăng nhập
              </LoadingButton>
            </Form>
          );
        }}
      </Formik>
      <Typography component={"div"} sx={{ color: "text.secondary", mt: 3, typography: 'caption', textAlign: 'center' }}>
        {'Khi Đăng Ký Tôi Đồng Ý Với '}
        <Link underline="always" color="text.primary">
          {` Điều Khoản Dịch Vụ `}
        </Link>
        {' và '}
        <Link underline="always" color="text.primary">Chính Sách Riêng Tư</Link>
      </Typography>
    </div>
  )
}
export default RegisterPage;