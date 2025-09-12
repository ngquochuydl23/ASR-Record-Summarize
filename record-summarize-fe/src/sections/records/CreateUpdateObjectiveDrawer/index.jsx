import BaseDrawer, { BaseHeaderDrawer } from "@/components/BaseDrawer";
import LoadingButton from "@/components/buttons/LoadingButton";
import { BootstrapInput } from "@/components/fields/BootstrapField";
import { Button, CircularProgress, FormControl, IconButton, InputLabel, Tooltip } from "@mui/material";
import { Field, FieldArray, Form, Formik } from "formik";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import * as Yup from "yup";
import _ from 'lodash';
import { BootstrapAutocomplete } from "@/components/fields/BootstrapAutocomplete";
import IcWizard from "@/assets/icons/IcWizard";
import styles from './styles.module.scss';
import PromptView from "../Prompts";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { colors } from "@/theme/theme.global";
import IcMsWord from "@/assets/icons/IcMsWord";
import IcPdf from "@/assets/icons/IcPdf";
import { uploadFile } from "@/repositories/storage.repository";
import IcExcel from "@/assets/icons/IcExcel";
import readS3Object from "@/utils/avatar/readS3Object";
import ReactPlayer from 'react-player'
import { createRecord } from "@/repositories/record.repository";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "@/constants/app.constants";

const recordContentTypes = [
  {
    id: 'Meeting',
    label: "Cuộc họp",
  },
  {
    id: 'Lecture-Class',
    label: "Bài giảng / Lớp học",
  },
  {
    id: 'Tutorial-Training',
    label: "Hướng dẫn / Đào tạo",
  },
  {
    id: 'Interview',
    label: "Phỏng vấn",
  },
  {
    id: 'Talkshow',
    label: "Talkshow",
  },
  {
    id: 'News',
    label: "Tin tức",
  },
  {
    id: 'Documentary',
    label: "Phim tài liệu",
  },
  {
    id: 'Entertainment',
    label: "Giải trí",
  }
]

const CreateObjectiveDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const playerRef = useRef();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const validationSchema = Yup.object({
    title: Yup
      .string()
      .required("Tiêu đề là bắt buộc"),
    record_content_type: Yup
      .string()
      .required("Thể loại là bắt buộc"),
    url: Yup
      .string()
      .required("Video là bắt buộc")
  });

  const handleSubmit = async (values, { setFieldError, resetForm }) => {
    createRecord(values)
      .then((response) => {
        navigate(AppRoute.RECORDS);
        enqueueSnackbar('Tạo tóm tắt thành công', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });
        onClose();
        resetForm();
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar('Tạo tóm tắt thất bại', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });
      })
      .finally(() => setLoading(false))
  }

  const handleUploadVideo = (e, setFieldValue, setFieldError) => {
    if (_.isEmpty(e.target.files) || !e.target.files[0]) return;
    setVideoUploading(true);
    uploadFile(e.target.files[0])
      .then(({ data }) => {
        setFieldValue('url', data.url);
        console.log(data);
      })
      .catch((error) => {
        setFieldValue('url', '');
        console.log(error);
      })
      .finally(() => setVideoUploading(false));
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const openPrompt = Boolean(anchorEl);
  const id = openPrompt ? 'simple-popover' : undefined;

  return (
    <BaseDrawer paperProps={{ width: '50vw' }} open={open} onClose={onClose}>
      <Formik
        initialValues={{
          title: '',
          description: '',
          record_content_type: null,
          url: '',
          attachments: [],
          emails: []
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ values, errors, touched, dirty, setFieldValue, validateField, setFieldError }) => {
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
                  <h5 className="mb-2 font-[600]">Thông tin video</h5>
                  <div className="flex gap-2">
                    <FormControl variant="standard" fullWidth>
                      <InputLabel required shrink htmlFor="title">Tiêu đề</InputLabel>
                      <Field
                        as={BootstrapInput}
                        name="title"
                        id="title"
                        size="small"
                        sx={{ fontSize: "14px" }}
                        fullWidth
                      />
                      {touched.title && errors.title ? (
                        <div className="text-errorColor text-[12px] mt-[2px]">{errors.title}</div>
                      ) : (<div div className="text-textSecondaryColor text-[12px] mt-[2px]">
                        Give your product a short and clear title.
                        50-60 characters is the recommended length for search engines.
                      </div>)}
                    </FormControl>
                    <Button
                      onClick={handleClick}
                      startIcon={<IcWizard />}
                      variant="outlined"
                      sx={{ width: '140px', marginTop: '24px' }}>
                      Trợ lý AI
                    </Button>
                    <PromptView
                      id={id}
                      open={openPrompt}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      onDeclineResult={() => {
                        setFieldValue('title', '');
                        setFieldValue('description', '');
                        setFieldValue('record_content_type', '');
                      }}
                      onPreviewResult={(response) => {
                        setFieldValue('title', response.title);
                        setFieldValue('description', response.description);
                        setFieldValue('record_content_type', response.record_content_type);
                      }}
                      onAcceptResult={(response) => {
                        setFieldValue('title', response.title);
                        setFieldValue('description', response.description);
                        setFieldValue('record_content_type', response.record_content_type);
                      }} />
                  </div>
                  <FormControl variant="standard" fullWidth >
                    <InputLabel shrink htmlFor="parentId" size="small">Thể loại</InputLabel>
                    <BootstrapAutocomplete
                      id="record_content_type"
                      name="record_content_type"
                      placeholder="Chọn thể loại"
                      value={recordContentTypes.find(x => x.id === values.record_content_type)}
                      options={recordContentTypes || []}
                      getOptionKey={(option) => option.id}
                      getOptionLabel={(option) => option.label}
                      onChange={(e, value, reason) => setFieldValue('record_content_type', value.id)}
                    />
                    {touched.wardOrVillage && errors.wardOrVillage && (
                      <div className="text-errorColor text-[12px] mt-[2px]">{errors.wardOrVillage}</div>
                    )}
                  </FormControl>
                  <FormControl variant="standard" fullWidth sx={{ mt: '10px' }}>
                    <InputLabel shrink htmlFor="description">Mô tả</InputLabel>
                    <Field
                      as={BootstrapInput}
                      name="description"
                      id="description"
                      size="small"
                      multiline
                      rows={10}
                      sx={{ fontSize: "14px" }}
                      fullWidth
                    />
                    {touched.description && errors.description && (
                      <div className="text-errorColor text-[12px] mt-[2px]">{errors.description}</div>
                    )}
                  </FormControl>
                </div>
                <input id="media.input" type="file" accept="video/*" style={{ display: 'none' }}
                  onChange={(e) => handleUploadVideo(e, setFieldValue, setFieldError)} />
                <div className={styles.gridMedia} >
                  <div className="flex flex-col w-full">
                    <h5 className="font-[600] w-full mt-4">Video</h5>
                    <div className="text-textSecondaryColor text-[12px] mt-[2px] w-full">
                      Each objective must have <strong>at least 1</strong> key result to ensure progress can be tracked.
                      To maintain clarity and focus, limit each objective to <strong>no more than 5</strong> key results.
                    </div>
                    {!values.url
                      ? <div className="flex flex-col gap-2 w-full">
                        {/*
                      
                      
                        For youtube field


                       */}
                        <div className={styles.mediaPlaceHolder} onClick={() => document.getElementById("media.input")?.click()}>
                          {videoUploading ? <CircularProgress /> : <OndemandVideoIcon />}
                          <div className={styles.title}>{videoUploading ? "Đang tải lên video" : "Tải lên video"}</div>
                          <div className={styles.helperText}>Video có dung lượng tối đa là 20mb.</div>
                        </div>
                      </div>
                      : <div className={styles.videoPreview}>
                        <ReactPlayer
                          ref={playerRef}
                          width={"100%"}
                          height={"100%"}
                          controls
                          src={readS3Object(values?.url)} />
                      </div>
                    }
                  </div>
                  <div className="flex flex-col w-full overflow-hidden">
                    <h5 className="font-[600] w-full mt-4">Tải lên tài liệu đính kèm</h5>
                    <div className="text-textSecondaryColor text-[12px] mt-[2px] w-full">
                      Each objective must have <strong>at least 1</strong> key result to ensure progress can be tracked.
                      To maintain clarity and focus, limit each objective to <strong>no more than 5</strong> key results.
                    </div>
                    <div className={styles.attachmentContainer}>
                      <FieldArray name="attachments">
                        {({ push, remove, replace }) => {
                          const handleUploadFile = (event) => {
                            if (_.isEmpty(event.target.files)) return;
                            Array.from(event.target.files).forEach((file, idx) => {
                              const index = values.attachments.length + idx;
                              push({
                                filename: file.name,
                                mime: file.type,
                                size: file.size,
                                url: null,
                                loading: true,
                                state: "uploading",
                              });
                              uploadFile(file)
                                .then(({ data }) => {
                                  console.log(index);
                                  replace(index, { ...data, loading: false, state: 'success' });
                                })
                                .catch((error) => {
                                  console.log(error);
                                  replace(index, { ...values.attachments[index], loading: false, state: 'error' });
                                });
                            });
                          }
                          return (
                            <div className={styles.attachments}>
                              {values.attachments.map((attachment, index) => {
                                const isTxt = attachment?.mime === "text/plain"
                                const isExcel = attachment?.mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                const isDocx = attachment?.mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || attachment?.mime === "application/msword";
                                const isPdf = attachment?.mime === "application/pdf";
                                return (
                                  <div className={styles.attachmentItem} key={index}>
                                    {isDocx && <IcMsWord />}
                                    {isPdf && <IcPdf />}
                                    {isExcel && <IcExcel />}
                                    <div className="flex flex-col overflow-hidden w-full">
                                      <div className={styles.titleWrapper}>
                                        <Tooltip title={attachment?.filename}>
                                          <span className={styles.title}>{attachment?.filename}</span>
                                        </Tooltip>
                                      </div>
                                      {isDocx && <div className={styles.mime}>{'application/docx'}</div>}
                                      {isPdf && <div className={styles.mime}>{'application/pdf'}</div>}
                                      {isExcel && <div className={styles.mime}>{'application/sheet'}</div>}
                                    </div>
                                    {attachment.loading &&
                                      <div className={styles.loadingContainer}>
                                        <CircularProgress size='20px' />
                                      </div>
                                    }
                                    {(!attachment.loading && attachment.state === 'success') &&
                                      <IconButton onClick={() => remove(index)}>
                                        <DeleteOutlineIcon sx={{ color: colors.errorColor }} />
                                      </IconButton>
                                    }
                                  </div>
                                );
                              })}
                              <Button variant="outlined" className="mt-4" type="button" onClick={() => { document.getElementById('media.attachments')?.click() }}>
                                Thêm tệp đính kèm
                              </Button>
                              <input
                                id="media.attachments"
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                                style={{ display: 'none' }}
                                onChange={handleUploadFile}></input>
                            </div>
                          )
                        }}
                      </FieldArray>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>
    </BaseDrawer >
  )
}

export default CreateObjectiveDrawer;