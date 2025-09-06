import { Link as RouterLink, useNavigate } from "react-router-dom"
import { Typography, Link, FormControl, InputLabel, Button } from "@mui/material";
import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { BootstrapInput } from "@/components/fields/BootstrapField";
import LoadingButton from "@/components/buttons/LoadingButton";
import _ from 'lodash';
import { login } from "@/repositories/user.repository";
import { AppRoute } from "@/constants/app.constants";
import { setLoading, setUser } from "@/redux/slices/userSlice";
import IcGoogleSSO from "@/assets/icons/IcGoogleSSO";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    phoneOrEmail: Yup
      .string()
      .required('Vui lòng nhập số điện thoại hoặc email'),
    password: Yup.string()
      .required('Vui lòng nhập mật khẩu')
  });

  const onSubmit = async values => {
    setSubmitting(true);
    login(values)
      .then(({ token, user }) => {

        console.log(token);
        localStorage.setItem("accessToken", token);
        dispatch(setUser(user));
        navigate(user.storeInit ? AppRoute.DASHBOARD : AppRoute.INIT_STORE);
        enqueueSnackbar('Đăng nhập thành công', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });

      })
      .catch(error => {
        console.log(error);
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

        if (error === 'Password is incorrect.') {
          enqueueSnackbar('Sai mật khẩu', {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
        } else if (error === 'User not found.') {
          enqueueSnackbar('User không tồn tại trên hệ thống', {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
        } else if (error === 'Account has not been verified.') {
          enqueueSnackbar('Tài khoản chưa được xác thực qua email', {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
        } else {
          enqueueSnackbar(error, {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_ENDPOINT}/auth/google/login-redirect`
  }

  return (
    <div className="flex flex-col mt-[100px]">
      <Typography variant="h4" mt="100px">Đăng nhập</Typography>
      <div className="flex gap-2">
        <Typography variant="body2" fontWeight="400">Người mới?</Typography>
        <Link to="/auth/register" component={RouterLink} variant="subtitle2">Tạo Tài Khoản</Link>
      </div>
      <Formik
        initialValues={{ phoneOrEmail: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
        {({ errors, touched, dirty }) => {
          return (
            <Form className="mt-10">
              <FormControl variant="standard" fullWidth>
                <InputLabel shrink htmlFor="name">Số điện thoại hoặc email</InputLabel>
                <Field
                  as={BootstrapInput}
                  name="phoneOrEmail"
                  id="phoneOrEmail"
                  size="small"
                  sx={{ fontSize: "14px" }}
                  fullWidth
                />
                {touched.phoneOrEmail && errors.phoneOrEmail && (
                  <div className="text-errorColor text-[12px] mt-[2px]">{errors.phoneOrEmail}</div>
                )}
              </FormControl>
              <FormControl variant="standard" fullWidth sx={{ mt: "10px" }}>
                <InputLabel shrink htmlFor="fullName">Mật khẩu</InputLabel>
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
              <LoadingButton
                sx={{ marginTop: "20px" }}
                disabled={!dirty || !_.isEmpty(errors)}
                loading={submitting}
                fullWidth
                size="large"
                variant="contained"
                type="submit">
                Đăng nhập
              </LoadingButton>
              <Button
                onClick={handleGoogleLogin}
                sx={{ marginTop: "20px" }}
                startIcon={<IcGoogleSSO />}
                variant='outlined'
                fullWidth size="large"
                type="button">
                Tiếp tục với Google
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  )
}
export default Login;