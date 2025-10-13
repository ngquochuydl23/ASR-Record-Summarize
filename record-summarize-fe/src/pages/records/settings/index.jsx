import { Autocomplete, Breadcrumbs, Button, Chip, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, Step, StepContent, StepLabel, Stepper, styled, TextField, Tooltip, Typography } from '@mui/material';
import styles from './styles.module.scss';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from '@mui/material/Link';
import { AppRoute, PipelineItemStatusEnum, PipelineItemTypeEnum, RecordContentTypes, SourceTypeEnum, SourceTypes, VideoLanguages } from '@/constants/app.constants';
import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLoading } from '@/contexts/LoadingContextProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { updateRecordById, getRecordById, rerunWF } from '@/repositories/record.repository';
import { getLastestVersionByRecord } from '@/repositories/summary-version.repository';
import { PipelineSteps, StatusMapStrings } from './page.config';
import { useFormik } from 'formik';
import { BootstrapInput } from '@/components/fields/BootstrapField';
import { BootstrapAutocomplete } from '@/components/fields/BootstrapAutocomplete';
import { getYoutubeEmbedUrl } from '@/utils/youtube';
import readS3Object from '@/utils/avatar/readS3Object';
import ReactPlayer from 'react-player'
import * as Yup from "yup";
import { useSnackbar } from 'notistack';
import { uploadFile } from '@/repositories/storage.repository';
import _ from 'lodash';
import { colors } from '@/theme/theme.global';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import HomeIcon from '@mui/icons-material/Home';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import Scrollbars from 'react-custom-scrollbars-2';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import LoadingButton from '@/components/buttons/LoadingButton';
import IcMsWord from '@/assets/icons/IcMsWord';
import IcExcel from '@/assets/icons/IcExcel';
import IcPdf from '@/assets/icons/IcPdf';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { usePreviewSVDialog } from '@/contexts/PreviewSummaryVContext';
import ReplayIcon from '@mui/icons-material/Replay';
import moment from 'moment';
import Check from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';


const QontoStepIconRoot = styled('div')(({ theme }) => ({
  color: '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  '& .QontoStepIcon-completedIcon': {
    color: colors.successColorBg,
    zIndex: 1,
    fontSize: 24,
  },
  '& .QontoStepIcon-errorIcon': {
    color: colors.errorColor,
    zIndex: 1,
    fontSize: 24,
  },
  '& .QontoStepIcon-pendingIcon': {
    color: colors.pendingColor,
    zIndex: 1,
    fontSize: 24,
  },
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        color: '#784af4',
      },
    },
  ],
}));

function QontoStepIcon(props) {
  const { active, completed, className, error } = props;
  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {(completed && !error) && <Check className="QontoStepIcon-completedIcon" />}
      {(error && !completed) && <CloseIcon className="QontoStepIcon-errorIcon" />}
      {(!error && !completed) && <CircularProgress size='20px' />}
      {(error && completed) && <PauseOutlinedIcon className="QontoStepIcon-pendingIcon" /> /** Pending Status **/}
    </QontoStepIconRoot>
  );
}

const RecordSettingPage = () => {
  const playerRef = useRef();
  const navigate = useNavigate();
  const { openPreviewDialog } = usePreviewSVDialog();
  const { recordId } = useParams();
  const [record, setRecord] = useState(null);
  const { isLoading, showLoading, hideLoading } = useLoading();
  const [updating, setUpdating] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [videoUploading, setVideoUploading] = useState(false);
  const [youtubeChecking, setYoutubeChecking] = useState(false);
  const [lastVersion, setLastVersion] = useState(null);
  const validationSchema = Yup.object({
    title: Yup
      .string()
      .required("Tiêu đề là bắt buộc"),
    record_content_type: Yup
      .string()
      .required("Thể loại là bắt buộc"),
    url: Yup
      .string()
      .required("Video là bắt buộc"),
    lang: Yup
      .string()
      .required("Ngôn ngữ là bắt buộc"),
    youtubeLink: Yup.string()
      .when("record_content_type", {
        is: (val) => val === SourceTypeEnum.YOUTUBE,
        then: (schema) =>
          schema
            .nullable()
            .required("Youtube link là bắt buộc")
            .matches(
              /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[&?]\S*)?$/,
              "Vui lòng nhập đường dẫn Youtube hợp lệ"
            ),
        otherwise
          : (schema) => schema.nullable().notRequired(),
      }),
  });

  const { touched, errors, values, setValues, setFieldValue, setFieldError, getFieldProps, handleSubmit, validateForm } = useFormik({
    validationSchema: validationSchema,
    enableReinitialize: true,
    initialValues: {
      id: null,
      title: '',
      description: '',
      record_content_type: null,
      url: null,
      youtubeLink: null,
      attachments: [],
      emails: [],
      lang: null,
      source_type: null,
      thumnail_url: null,
    },
    onSubmit: (values, { resetForm, setFieldError }) => {
      const { id, youtubeLink, ...data } = values
      const payload = {
        ...data,
        url: data.source_type === SourceTypeEnum.LOCAL ? data.url : youtubeLink,
        thumnail_url: data.source_type === SourceTypeEnum.LOCAL ? data.thumnail_url : null,
      }
      setUpdating(true);
      updateRecordById(id, payload)
        .then((response) => {
          setRecord(response);
          setUpdating(false);
          enqueueSnackbar('Cập nhật tóm tắt thành công', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
        })
        .catch((error) => {

        })
        .finally(() => {

        });
    }
  });

  const handleUploadVideo = (e, setFieldValue, setFieldError) => {
    if (_.isEmpty(e.target.files) || !e.target.files[0]) return;
    setVideoUploading(true);
    uploadFile(e.target.files[0])
      .then(({ data }) => {
        setFieldValue('url', data.url);
      })
      .catch((error) => {
        setFieldValue('url', '');
        console.log(error);
      })
      .finally(() => setVideoUploading(false));
  }

  const handleCheckYoutube = (link) => {
    if (_.isEmpty(link)) return Promise.resolve(false);
    setYoutubeChecking(true);
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(link)}&format=json`);
          if (res.ok) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (e) {
          resolve(false);
        } finally {
          setYoutubeChecking(false);
        }
      }, 2500);
    });
  };

  const checkDiff = (original, current) => {
    const keysToCompare = [
      "title",
      "description",
      "record_content_type",
      "url",
      "attachments",
      "emails",
      "lang",
      "source_type",
      "thumnail_url",
    ];
    const diffs = {};
    keysToCompare.forEach((key) => {
      if (!_.isEqual(original[key], current[key])) {
        diffs[key] = {
          oldValue: original[key],
          newValue: current[key],
        };
      }
    });
    return diffs;
  };

  const hasDiff = (original, current) => !_.isEmpty(checkDiff(original, current));

  const getRecordDetail = async () => {
    try {
      if (!isLoading) showLoading();
      const _record = await getRecordById(recordId);
      setValues({
        id: _record?.id,
        title: _record?.title,
        description: _record?.description,
        record_content_type: _record?.record_content_type,
        url: _record?.url || null,
        youtubeLink: null,
        attachments: _record?.attachments || [],
        emails: _record?.emails || [],
        lang: _record?.lang,
        source_type: _record?.source_type || SourceTypeEnum.YOUTUBE,
        thumnail_url: _record?.thumnail_url
      });
      validateForm();
      setRecord(_record);
      hideLoading();

      const _lastestVersion = await getLastestVersionByRecord(recordId)
        .catch(() => { });
      setLastVersion(_lastestVersion);
    } catch (e) {
      console.log(e);
    } finally {
    }
  }

  const replace = (index, newAttachment, updatedAttachments) => {
    const newAttachments = updatedAttachments.map((item) => {
      if (item.idx === index) {
        return newAttachment;
      } else {
        return item;
      }
    })
    setFieldValue("attachments", newAttachments);
    return newAttachments;
  };

  const remove = (index) => {
    const updated = values.attachments.filter((_, i) => i !== index);
    setFieldValue("attachments", updated);
  };

  const handleUploadFile = (event) => {
    if (_.isEmpty(event.target.files)) return;
    const orginalIndex = values.attachments.length;
    const newFiles = _.map(event.target.files, (file, index) => ({
      filename: file.name,
      mime: file.type,
      size: file.size,
      url: null,
      originalFile: file,
      loading: true,
      state: "uploading",
      idx: orginalIndex + index
    }));
    var updatedAttachments = [...values.attachments, ...newFiles];
    setFieldValue('attachments', updatedAttachments);
    Array.from(newFiles).forEach((item) => {
      const { originalFile, idx } = item;
      uploadFile(originalFile)
        .then(({ data }) => {
          updatedAttachments = replace(idx, { ...data, loading: false, state: "success" }, updatedAttachments);
        })
        .catch((error) => {
          console.error(error);
          updatedAttachments = replace(idx, { ...updatedAttachments[idx], loading: false, state: "error" }, updatedAttachments);
        });
    });
  }

  const defaultCurrentStep = useMemo(() => {
    if (_.every(record?.pipeline_items, (item) => item?.status === PipelineItemStatusEnum.Success)) {
      return PipelineSteps[PipelineItemTypeEnum.GENERATE_SUM].index;
    }
    return PipelineSteps[record?.current_step || PipelineItemTypeEnum.CREATE_RECORD].index
  }, [record?.pipeline_items]);

  const handleWsConnected = () => {
    console.log("[RecordSettingPage] Connected to WebSocket");
  }

  const handleWsDisconnected = () => {
    console.log("[RecordSettingPage] Disconnected from WebSocket");
  }

  const pipelineItems = useMemo(() => {
    return record?.pipeline_items ?? [];
  }, [record]);

  const onReceiveMsg = (data) => {
    setRecord((prev) => ({
      ...prev,
      pipeline_items: prev.pipeline_items.map((item) => item.id === data.id ? { ...item, ...data } : item)
    }));

    if (data.type === PipelineItemTypeEnum.GENERATE_SUM && data.status === PipelineItemStatusEnum.Success) {
      getLastestVersionByRecord(recordId)
        .then((response) => setLastVersion(response))
        .catch((error) => { console.log(error); });
    }
  }

  const handleRetryStep = (stepData) => {
    rerunWF(recordId, { from_step_id: stepData?.id })
      .then(() => { })
      .catch((error) => { console.log(error); })
      .finally(() => {

      });
  }

  useEffect(() => {
    getRecordDetail();
    if (recordId && !_.some(record?.pipeline_items, (item) => item?.status === PipelineItemStatusEnum.Running)) {
      const ws = new WebSocket(`${process.env.REACT_APP_WS_ENDPOINT}/records/ws/${recordId}`);
      ws.onopen = handleWsConnected;
      ws.onclose = handleWsDisconnected;
      ws.onmessage = (event) => onReceiveMsg(JSON.parse(event.data));
      return () => {
        ws.close();
      }
    } else {
      console.log("Not Observe event");
    }
  }, [recordId]);

  useEffect(() => {
    showLoading();
  }, [])

  if (isLoading || !record) return null;
  return (
    <div className={styles.recordSettingPage}>
      <div className={styles.breadcums}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link className={styles.breadcumsItem} underline="hover" color="inherit" href="/"><HomeIcon sx={{ color: '#6B7280' }} size={20} /></Link>
          <Link className={styles.breadcumsItem} underline="hover" color="inherit" href={AppRoute.RECORDS}>Video tóm tắt</Link>
          <Link className={classNames(styles.breadcumsItem, styles.actived)} underline="hover" color="inherit" href="#">{record?.title}</Link>
        </Breadcrumbs>
      </div>
      <div className={styles.recordSettingPageInner}>
        <Scrollbars autoHide>
          <form onSubmit={handleSubmit}>
            <div className={styles.generalInfoLayout}>
              <div className={styles.formLayout}>
                <div className="flex flex-col">
                  <div className="flex flex-col gap-2">
                    <h5 className={styles.sectionTitle}>Thông tin video</h5>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel required shrink htmlFor="title">Tiêu đề</InputLabel>
                      <BootstrapInput {...getFieldProps("title")} size="small" sx={{ fontSize: "14px" }} fullWidth />
                      {touched.title && errors.title ? (
                        <div className="text-errorColor text-[12px] mt-[2px]">{errors.title}</div>
                      ) : (<div div className="text-textSecondaryColor text-[12px] mt-[2px]">
                        Give your product a short and clear title.
                        50-60 characters is the recommended length for search engines.
                      </div>)}
                    </FormControl>
                    <div className="flex gap-2">
                      <FormControl variant="standard" fullWidth >
                        <InputLabel shrink htmlFor="record_content_type" required size="small">Thể loại</InputLabel>
                        <BootstrapAutocomplete
                          {...getFieldProps("record_content_type")}
                          placeholder="Chọn thể loại"
                          value={RecordContentTypes.find(x => x?.id === values.record_content_type) || null}
                          options={RecordContentTypes || []}
                          getOptionKey={(option) => option.id}
                          getOptionLabel={(option) => option.label}
                          onChange={(e, value, reason) => setFieldValue('record_content_type', value?.id)}
                        />
                        {touched.record_content_type && errors.record_content_type && (
                          <div className="text-errorColor text-[12px] mt-[2px]">{errors.record_content_type}</div>
                        )}
                      </FormControl>
                      <FormControl variant="standard" fullWidth >
                        <InputLabel shrink htmlFor="lang" size="small" required>Ngôn ngữ</InputLabel>
                        <BootstrapAutocomplete
                          id="lang"
                          name="lang"
                          placeholder="Chọn ngôn ngữ"
                          value={VideoLanguages.find(x => x?.id === values.lang) || null}
                          options={VideoLanguages || []}
                          getOptionKey={(option) => option.id}
                          getOptionLabel={(option) => option.label}
                          onChange={(e, value, reason) => setFieldValue('lang', value.id)}
                        />
                        {touched.lang && errors.lang && (
                          <div className="text-errorColor text-[12px] mt-[2px]">{errors.lang}</div>
                        )}
                      </FormControl>
                    </div>
                    <div className="flex gap-2">
                      <FormControl variant="standard" fullWidth >
                        <InputLabel shrink htmlFor="lang" size="small" required>Nguồn video</InputLabel>
                        <BootstrapAutocomplete
                          {...getFieldProps("source_type")}
                          id="source_type"
                          name="source_type"
                          placeholder="Chọn nguồn video"
                          value={SourceTypes.find(x => x?.id === values.source_type) || null}
                          options={SourceTypes || []}
                          getOptionKey={(option) => option.id}
                          getOptionLabel={(option) => option.label}
                          onChange={(e, value, reason) => { setValues({ ...values, url: null, youtubeLink: null, source_type: value?.id || null }) }}
                        />
                        {touched.source_type && errors.source_type && (
                          <div className="text-errorColor text-[12px] mt-[2px]">{errors.source_type}</div>
                        )}
                      </FormControl>
                    </div>
                    <FormControl variant="standard" fullWidth sx={{ mt: '10px' }}>
                      <InputLabel shrink htmlFor="description">Mô tả</InputLabel>
                      <BootstrapInput
                        {...getFieldProps("description")}
                        as={BootstrapInput}
                        name="description"
                        id="description"
                        size="small"
                        placeholder="Nhập mô tả video"
                        multiline
                        rows={10}
                        sx={{
                          fontSize: "14px",
                          '& .MuiInputBase-input': {
                            borderRadius: '15px'
                          }
                        }}
                        fullWidth
                      />
                      {touched.description && errors.description && (<div className="text-errorColor text-[12px] mt-[2px]">{errors.description}</div>)}
                    </FormControl>
                  </div>
                  <FormControl variant="standard" fullWidth sx={{ mt: '10px' }}>
                    <InputLabel shrink htmlFor="lang" size="small">Chia sẻ đến</InputLabel>
                    <Autocomplete
                      {...getFieldProps("emails")}
                      id="emails"
                      sx={{ mt: '24px' }}
                      name="emails"
                      placeholder="Nhập email"
                      multiple
                      freeSolo
                      value={values.emails}
                      options={[]}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip label={option}  {...getTagProps({ index })}
                            onDelete={() => setFieldValue('emails', values.emails.filter((_, i) => i !== index))} />
                        ))
                      }
                      onChange={(e, value, reason) => setFieldValue('emails', value)}
                      renderInput={params => <TextField {...params} variant="outlined" placeholder="Nhập emails" />}
                    />
                    {touched.emails && errors.emails && (<div>{errors.emails}</div>)}
                  </FormControl>
                </div>
              </div>
              <div className={styles.videoPreview}>
                <div className="flex flex-col w-full">
                  <h5 className="font-[600] w-full mt-4">Video</h5>
                  <div className="text-textSecondaryColor text-[12px] mt-[2px] w-full">
                    Each objective must have <strong>at least 1</strong> key result to ensure progress can be tracked.
                    To maintain clarity and focus, limit each objective to <strong>no more than 5</strong> key results.
                  </div>
                  {!values.url
                    ? <div className="flex flex-col gap-2 w-full">
                      {values.source_type === 'local'
                        ? <div className={styles.mediaPlaceHolder} onClick={() => document.getElementById("media.input")?.click()}>
                          {videoUploading ? <CircularProgress /> : <OndemandVideoIcon />}
                          <div className={styles.title}>{videoUploading ? "Đang tải lên video" : "Tải lên video"}</div>
                          <div className={styles.helperText}>Video có dung lượng tối đa là 20mb.</div>
                        </div>
                        : <div className={styles.youtubePasteLink}>
                          <FormControl variant="standard" fullWidth sx={{ mt: '10px' }}>
                            <InputLabel shrink htmlFor="youtubeLink">Đường dẫn Youtube</InputLabel>
                            <BootstrapInput
                              {...getFieldProps("youtubeLink")}
                              startAdornment={<InputAdornment position="start"><YouTubeIcon sx={{ color: '#B2071D' }} /></InputAdornment>}
                              endAdornment={
                                <InputAdornment position="end">
                                  {youtubeChecking && <div className={styles.loadingContainer}><CircularProgress size='20px' /></div>}
                                  {!youtubeChecking && values.youtubeLink && !errors.youtubeLink && <CheckCircleIcon sx={{ color: colors.successColorBg }} />}
                                  {!youtubeChecking && errors.youtubeLink && <ErrorOutlineIcon sx={{ color: colors.errorColor }} />}
                                </InputAdornment>
                              }
                              onChange={(e) => {
                                setFieldValue('youtubeLink', e.target.value || null);
                                setYoutubeChecking(false);
                                if (!errors.youtubeLink) {
                                  handleCheckYoutube(e, setFieldValue, setFieldError)
                                    .then(() => setFieldValue("url", e.target.value))
                                    .catch(() => setFieldError("youtubeLink", "Không tìm thấy video"))
                                };
                              }}
                              name="youtubeLink"
                              id="youtubeLink"
                              size="small"
                              placeholder="Nhập đường dẫn Youtube"
                              fullWidth
                            />
                            {touched.youtubeLink && errors.youtubeLink && (
                              <div className="text-errorColor text-[12px] mt-[2px]">{errors.youtubeLink}</div>
                            )}
                          </FormControl>
                          {!_.isEmpty(values.youtubeLink) && !youtubeChecking && _.isEmpty(errors.youtubeLink) &&
                            <iframe
                              className={styles.ytbPreview}
                              title="Preview youtube"
                              src={getYoutubeEmbedUrl(values.youtubeLink)}
                              width="100%"
                              frameborder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowfullscreen >
                            </iframe>
                          }
                        </div>
                      }
                    </div>
                    : <div className={styles.videoPreview}>
                      <ReactPlayer ref={playerRef} width={"100%"} height={"100%"}
                        controls src={readS3Object(values?.url)} />
                    </div>
                  }
                </div>
                {values.source_type === 'local' &&
                  <div className="flex flex-col w-full mt-2">
                    <h5 className="font-[600] w-full mt-4">Hình thu nhỏ</h5>
                    <div className="text-textSecondaryColor text-[12px] mt-[2px] w-full">
                      Chọn hình thu nhỏ nổi bật để thu hút sự chú ý của người xem. <a className={styles.researchLink} href="/">Tìm hiểu thêm</a>
                    </div>
                    <div className={styles.thumbnailSelector}>
                      <div className={styles.thumbnailSelectorItem}>
                        <div className={styles.overlay}>
                          <AddPhotoAlternateOutlinedIcon />
                          Tải tệp lên
                        </div>
                      </div>
                      <div className={styles.thumbnailSelectorItem}>
                        <div className={styles.overlay}>
                          <AutoAwesomeOutlinedIcon />
                          Tạo tự động
                        </div>
                      </div>
                    </div>
                  </div>
                }
                <input id="media.input" type="file" accept="video/*" style={{ display: 'none' }}
                  onChange={(e) => handleUploadVideo(e, setFieldValue, setFieldError)} />
                <div className="flex flex-col w-full overflow-hidden mt-2">
                  <h5 className="font-[600] w-full mt-4">Tải lên tài liệu đính kèm</h5>
                  <div className="text-textSecondaryColor text-[12px] mt-[2px] w-full">
                    Each objective must have <strong>at least 1</strong> key result to ensure progress can be tracked.
                    To maintain clarity and focus, limit each objective to <strong>no more than 5</strong> key results.
                  </div>
                  <div className={styles.attachmentContainer}>
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
                        id="media.attachments" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                        style={{ display: 'none' }} onChange={handleUploadFile}>
                      </input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex gap-2 mr-[30px] mb-[30px] flex-1 justify-end'>
              <Button variant='outlined' size='medium'>Hủy</Button>
              <LoadingButton variant='contained' size='medium' loading={updating} type="submit"
                disabled={!hasDiff(record, values)
                  || _.some(values.attachments, item => item?.loading && item?.state === "uploading")
                  || !_.isEmpty(errors)} sx={{ width: '150px' }}>Cập nhật
              </LoadingButton>
            </div>
          </form>
        </Scrollbars>
        <div className={styles.workflowLayout}>
          <Stepper activeStep={defaultCurrentStep} orientation='vertical'>
            {Object.values(PipelineItemTypeEnum)
              .filter((v) => typeof v === "number")
              .map((stepId) => {
                const step = PipelineSteps[stepId];
                const log = pipelineItems.find((l) => Number(l.type) === stepId);
                const completed = record.current_step === PipelineItemTypeEnum.CHATBOT_PREPARATION && log?.status === PipelineItemStatusEnum.Success;
                return (
                  <Step key={log?.id} completed={completed} disabled={!completed}
                    className={classNames(styles.stepItem, { [styles.stepItemfailed]: log?.status === PipelineItemStatusEnum.Failed, })} >
                    <StepLabel
                      StepIconProps={{
                        completed: log?.status === PipelineItemStatusEnum.Success,
                        error: log?.status === PipelineItemStatusEnum.Failed,
                        ...(log?.status === PipelineItemStatusEnum.Pending && {
                          completed: true,
                          error: true
                        })
                      }}
                      StepIconComponent={QontoStepIcon}
                      optional={log
                        ? <span
                          className={classNames(styles.stepItemStatus, {
                            [styles.success]: log?.status === PipelineItemStatusEnum.Success,
                            [styles.failed]: log?.status === PipelineItemStatusEnum.Failed,
                            [styles.pending]: log?.status === PipelineItemStatusEnum.Pending,
                            [styles.running]: log?.status === PipelineItemStatusEnum.Running,
                            [styles.cancelled]: log?.status === PipelineItemStatusEnum.Cancelled,
                          })}
                        >
                          {StatusMapStrings[log?.status] || log?.status}
                          {log?.status === PipelineItemStatusEnum.Success && <div className={styles.finishedAtTime}>{moment(log?.finished_at).format('MMMM Do YYYY, h:mm:ss a')}</div>}
                        </span>
                        : undefined
                      }
                    >
                      {step.stepName}
                    </StepLabel>
                    <StepContent slotProps={{ transition: { unmountOnExit: false } }}>
                      {log?.error_message
                        ? <div className={styles.stepItemErrorMsg}>{log?.error_message}</div>
                        : <div className={styles.stepItemDescription}>{step.stepDescription}</div>
                      }
                      {(log?.type === PipelineItemTypeEnum.GENERATE_SUM && log?.status === PipelineItemStatusEnum.Success) &&
                        <div className={styles.previewLastSummaryButton}>
                          <div className='flex flex-col w-full overflow-hidden'>
                            <div className={styles.recordTitle}>{_.capitalize(record?.title)}</div>
                            <div className={styles.version}>Phiên bản {lastVersion?.title}<span> (Mới nhất)</span></div>
                          </div>
                          <div className='flex gap-1'>
                            <IconButton className={styles.iconBtn} onClick={() => { openPreviewDialog(lastVersion?.id) }}>
                              <Tooltip title="Xem trước"><SlideshowOutlinedIcon /></Tooltip>
                            </IconButton>
                            <Tooltip title="Xuất bản">
                              <IconButton className={styles.iconBtn} disabled={record?.current_version_id === lastVersion?.id}>
                                <PublishOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                      }
                      {log?.status === PipelineItemStatusEnum.Failed &&
                        <div className='flex mt-3'>
                          <Button variant='outlined' size='medium' startIcon={<ReplayIcon />}
                            onClick={() => handleRetryStep(log)}>
                            Thử lại
                          </Button>
                        </div>
                      }
                    </StepContent>
                  </Step>
                );
              })}
          </Stepper>
        </div>
      </div>
    </div>
  )
}

export default RecordSettingPage;