import BaseDrawer, { BaseHeaderDrawer } from "@/components/BaseDrawer";
import LoadingButton from "@/components/buttons/LoadingButton";
import { BootstrapInput } from "@/components/fields/BootstrapField";
import {
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Tooltip,
} from "@mui/material";
import { Field, FieldArray, Form, Formik } from "formik";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import * as Yup from "yup";
import _ from "lodash";
import { BootstrapAutocomplete } from "@/components/fields/BootstrapAutocomplete";
import IcWizard from "@/assets/icons/IcWizard";
import styles from "./styles.module.scss";
import PromptView from "../Prompts";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { colors } from "@/theme/theme.global";
import IcMsWord from "@/assets/icons/IcMsWord";
import IcPdf from "@/assets/icons/IcPdf";
import { uploadFile } from "@/repositories/storage.repository";
import IcExcel from "@/assets/icons/IcExcel";
import readS3Object from "@/utils/avatar/readS3Object";
import ReactPlayer from "react-player";
import { createRecord } from "@/repositories/record.repository";
import { useNavigate } from "react-router-dom";
import {
  AppRoute,
  RecordContentTypes,
  SourceTypes,
  VideoLanguages,
} from "@/constants/app.constants";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { getYoutubeEmbedUrl } from "@/utils/youtube";

const CreateObjectiveDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const playerRef = useRef();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [youtubeChecking, setYoutubeChecking] = useState(false);
  const validationSchema = Yup.object({
    title: Yup.string().required("Tiêu đề là bắt buộc"),
    record_content_type: Yup.string().required("Thể loại là bắt buộc"),
    url: Yup.string().required("Video là bắt buộc"),
    lang: Yup.string().required("Ngôn ngữ là bắt buộc"),
    youtubeLink: Yup.string()
      .matches(
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[&?]\S*)?$/,
        "Vui lòng nhập đường dẫn Youtube hợp lệ"
      )
      .optional(),
  });

  const handleSubmit = async (values, { setFieldError, resetForm }) => {
    const { youtubeLink, ...data } = values;
    const payload = {
      ...data,
      url: data.source_type === "local" ? data.url : youtubeLink,
    };
    createRecord(payload)
      .then((response) => {
        navigate(AppRoute.RECORDS);
        enqueueSnackbar("Tạo tóm tắt thành công", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        onClose(response);
        resetForm();
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar("Tạo tóm tắt thất bại", {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      })
      .finally(() => setLoading(false));
  };

  const handleUploadVideo = (e, setFieldValue, setFieldError) => {
    if (_.isEmpty(e.target.files) || !e.target.files[0]) return;
    setVideoUploading(true);
    uploadFile(e.target.files[0])
      .then(({ data }) => {
        setFieldValue("url", data.url);
        console.log(data);
      })
      .catch((error) => {
        setFieldValue("url", "");
        console.log(error);
      })
      .finally(() => setVideoUploading(false));
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const openPrompt = Boolean(anchorEl);
  const id = openPrompt ? "simple-popover" : undefined;

  const handleCheckYoutube = (link) => {
    if (_.isEmpty(link)) return Promise.resolve(false);
    setYoutubeChecking(true);
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const res = await fetch(
            `https://www.youtube.com/oembed?url=${encodeURIComponent(
              link
            )}&format=json`
          );
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

  return (
    <BaseDrawer paperProps={{ width: "50vw" }} open={open} onClose={onClose}>
      <Formik
        initialValues={{
          title: "",
          description: "",
          record_content_type: null,
          url: "",
          youtubeLink: "",
          attachments: [],
          emails: [],
          lang: null,
          source_type: "youtube",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          dirty,
          setFieldValue,
          validateField,
          setFieldError,
        }) => {
          return (
            <Form>
              <BaseHeaderDrawer title="Tạo tóm tắt" onClose={onClose}>
                <LoadingButton
                  disabled={!dirty || !_.isEmpty(errors)}
                  loading={loading}
                  fullWidth={false}
                  variant="contained"
                  type="submit"
                  size="medium"
                  sx={{}}
                >
                  Tạo
                </LoadingButton>
              </BaseHeaderDrawer>
              <div className="flex flex-col">
                <div className="flex flex-col gap-2 mt-4">
                  <h5 className="mb-2 font-[600]">Thông tin video</h5>
                  <div className="flex gap-2">
                    <FormControl variant="standard" fullWidth>
                      <InputLabel required shrink htmlFor="title">
                        Tiêu đề
                      </InputLabel>
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
                      ) : (
                        <div className="text-textSecondaryColor text-[12px] mt-[2px] italic">
                          Nhập tiêu đề ngắn gọn, rõ ràng cho video (khuyến nghị
                          50-60 ký tự).
                        </div>
                      )}
                    </FormControl>
                    <Button
                      onClick={handleClick}
                      startIcon={<IcWizard />}
                      variant="outlined"
                      sx={{ width: "140px", marginTop: "24px" }}
                    >
                      Trợ lý AI
                    </Button>
                    <PromptView
                      id={id}
                      open={openPrompt}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      onDeclineResult={() => {
                        setFieldValue("title", "");
                        setFieldValue("description", "");
                        setFieldValue("record_content_type", "");
                      }}
                      onPreviewResult={(response) => {
                        setFieldValue("title", response.title);
                        setFieldValue("description", response.description);
                        setFieldValue(
                          "record_content_type",
                          response.record_content_type
                        );
                      }}
                      onAcceptResult={(response) => {
                        setFieldValue("title", response.title);
                        setFieldValue("description", response.description);
                        setFieldValue(
                          "record_content_type",
                          response.record_content_type
                        );
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <FormControl variant="standard" fullWidth>
                      <InputLabel
                        shrink
                        htmlFor="record_content_type"
                        required
                        size="small"
                      >
                        Thể loại
                      </InputLabel>
                      <BootstrapAutocomplete
                        id="record_content_type"
                        name="record_content_type"
                        placeholder="Chọn thể loại"
                        value={RecordContentTypes.find(
                          (x) => x.id === values.record_content_type
                        )}
                        options={RecordContentTypes || []}
                        getOptionKey={(option) => option.id}
                        getOptionLabel={(option) => option.label}
                        onChange={(e, value, reason) =>
                          setFieldValue("record_content_type", value.id)
                        }
                      />
                      {touched.record_content_type &&
                        errors.record_content_type && (
                          <div className="text-errorColor text-[12px] mt-[2px]">
                            {errors.record_content_type}
                          </div>
                        )}
                    </FormControl>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel shrink htmlFor="lang" size="small" required>
                        Ngôn ngữ
                      </InputLabel>
                      <BootstrapAutocomplete
                        id="lang"
                        name="lang"
                        placeholder="Chọn ngôn ngữ"
                        value={VideoLanguages.find((x) => x.id === values.lang)}
                        options={VideoLanguages || []}
                        getOptionKey={(option) => option.id}
                        getOptionLabel={(option) => option.label}
                        onChange={(e, value, reason) =>
                          setFieldValue("lang", value.id)
                        }
                      />
                      {touched.lang && errors.lang && (
                        <div className="text-errorColor text-[12px] mt-[2px]">
                          {errors.lang}
                        </div>
                      )}
                    </FormControl>
                  </div>
                  <div className="flex gap-2">
                    <FormControl variant="standard" fullWidth>
                      <InputLabel
                        shrink
                        htmlFor="source_type"
                        size="small"
                        required
                      >
                        Nguồn video
                      </InputLabel>
                      <BootstrapAutocomplete
                        id="source_type"
                        name="source_type"
                        placeholder="Chọn nguồn video"
                        value={SourceTypes.find(
                          (x) => x.id === values.source_type
                        )}
                        options={SourceTypes || []}
                        getOptionKey={(option) => option.id}
                        getOptionLabel={(option) => option.label}
                        onChange={(e, value, reason) => {
                          setFieldValue("url", "");
                          setFieldValue("youtubeLink", "");
                          setFieldValue("source_type", value.id);
                        }}
                      />
                      {touched.source_type && errors.source_type && (
                        <div className="text-errorColor text-[12px] mt-[2px]">
                          {errors.source_type}
                        </div>
                      )}
                    </FormControl>
                  </div>
                  <FormControl variant="standard" fullWidth sx={{ mt: "10px" }}>
                    <InputLabel shrink htmlFor="description">
                      Mô tả
                    </InputLabel>
                    <Field
                      as={BootstrapInput}
                      name="description"
                      id="description"
                      size="small"
                      placeholder="Nhập mô tả video"
                      multiline
                      rows={5}
                      sx={{
                        fontSize: "14px",
                        "& .MuiInputBase-input": {
                          borderRadius: "15px",
                        },
                      }}
                      fullWidth
                    />
                    {touched.description && errors.description && (
                      <div className="text-errorColor text-[12px] mt-[2px]">
                        {errors.description}
                      </div>
                    )}
                    {!touched.description && !errors.description && (
                      <div className="text-textSecondaryColor text-[12px] mt-[2px] italic">
                        Cung cấp mô tả chi tiết về nội dung video.
                      </div>
                    )}
                  </FormControl>
                </div>
                <FormControl variant="standard" fullWidth sx={{ mt: "10px" }}>
                  <InputLabel shrink htmlFor="emails" size="small">
                    Chia sẻ đến
                  </InputLabel>
                  <Autocomplete
                    id="emails"
                    sx={{ mt: "24px" }}
                    name="emails"
                    placeholder="Nhập email"
                    multiple
                    freeSolo
                    value={values.emails}
                    options={[]}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          onDelete={() =>
                            setFieldValue(
                              "emails",
                              values.emails.filter((_, i) => i !== index)
                            )
                          }
                        />
                      ))
                    }
                    onChange={(e, value, reason) =>
                      setFieldValue("emails", value)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Nhập email"
                      />
                    )}
                  />
                  {touched.emails && errors.emails && (
                    <div className="text-errorColor text-[12px] mt-[2px]">
                      {errors.emails}
                    </div>
                  )}
                  {!touched.emails && !errors.emails && (
                    <div className="text-textSecondaryColor text-[12px] mt-[2px] italic">
                      Nhập địa chỉ email của người muốn chia sẻ.
                    </div>
                  )}
                </FormControl>
                <input
                  id="media.input"
                  type="file"
                  accept="video/*"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    handleUploadVideo(e, setFieldValue, setFieldError)
                  }
                />
                <div className={styles.gridMedia}>
                  <div className="flex flex-col w-full">
                    <h5 className="font-[600] w-full mt-4">Video</h5>
                    <div className="text-textSecondaryColor text-[12px] mt-[2px] w-full italic">
                      Liên kết video muốn tóm tắt.
                    </div>
                    {!values.url ? (
                      <div className="flex flex-col gap-2 w-full">
                        {values.source_type === "local" ? (
                          <div
                            className={styles.mediaPlaceHolder}
                            onClick={() =>
                              document.getElementById("media.input")?.click()
                            }
                          >
                            {videoUploading ? (
                              <CircularProgress />
                            ) : (
                              <OndemandVideoIcon />
                            )}
                            <div className={styles.title}>
                              {videoUploading
                                ? "Đang tải lên video"
                                : "Tải lên video"}
                            </div>
                            <div className={styles.helperText}>
                              Video có dung lượng tối đa là 20MB.
                            </div>
                          </div>
                        ) : (
                          <div className={styles.youtubePasteLink}>
                            <FormControl
                              variant="standard"
                              fullWidth
                              sx={{ mt: "10px" }}
                            >
                              <InputLabel shrink htmlFor="youtubeLink">
                                Đường dẫn Youtube
                              </InputLabel>
                              <Field
                                startAdornment={
                                  <InputAdornment position="start">
                                    <YouTubeIcon sx={{ color: "#B2071D" }} />
                                  </InputAdornment>
                                }
                                endAdornment={
                                  <InputAdornment position="end">
                                    {youtubeChecking && (
                                      <div className={styles.loadingContainer}>
                                        <CircularProgress size="20px" />
                                      </div>
                                    )}
                                    {!youtubeChecking &&
                                      values.youtubeLink &&
                                      !errors.youtubeLink && (
                                        <CheckCircleIcon
                                          sx={{ color: colors.successColorBg }}
                                        />
                                      )}
                                    {!youtubeChecking && errors.youtubeLink && (
                                      <ErrorOutlineIcon
                                        sx={{ color: colors.errorColor }}
                                      />
                                    )}
                                  </InputAdornment>
                                }
                                as={BootstrapInput}
                                onChange={(e) => {
                                  setFieldValue("youtubeLink", e.target.value);
                                  setYoutubeChecking(false);
                                  if (!errors.youtubeLink) {
                                    handleCheckYoutube(
                                      e,
                                      setFieldValue,
                                      setFieldError
                                    )
                                      .then(() =>
                                        setFieldValue("url", e.target.value)
                                      )
                                      .catch(() =>
                                        setFieldError(
                                          "youtubeLink",
                                          "Không tìm thấy video"
                                        )
                                      );
                                  }
                                }}
                                name="youtubeLink"
                                id="youtubeLink"
                                size="small"
                                placeholder="Nhập đường dẫn Youtube"
                                fullWidth
                              />
                              {touched.youtubeLink && errors.youtubeLink && (
                                <div className="text-errorColor text-[12px] mt-[2px]">
                                  {errors.youtubeLink}
                                </div>
                              )}
                            </FormControl>
                            {!_.isEmpty(values.youtubeLink) &&
                              !youtubeChecking &&
                              _.isEmpty(errors.youtubeLink) && (
                                <iframe
                                  className={styles.ytbPreview}
                                  title="Preview youtube"
                                  src={getYoutubeEmbedUrl(values.youtubeLink)}
                                  width="100%"
                                  frameborder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowfullscreen
                                ></iframe>
                              )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={styles.videoPreview}>
                        <ReactPlayer
                          ref={playerRef}
                          width={"100%"}
                          height={"100%"}
                          controls
                          src={readS3Object(values?.url)}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col w-full overflow-hidden">
                    <h5 className="font-[600] w-full mt-4">
                      Tải lên tài liệu đính kèm
                    </h5>
                    <div className="text-textSecondaryColor text-[12px] mt-[2px] w-full italic">
                      Tải lên tài liệu đính kèm (pdf, doc, xls, ppt, txt) muốn
                      tóm tắt.
                    </div>
                    <div className={styles.attachmentContainer}>
                      <FieldArray name="attachments">
                        {({ push, remove, replace }) => {
                          const handleUploadFile = (event) => {
                            if (_.isEmpty(event.target.files)) return;
                            Array.from(event.target.files).forEach(
                              (file, idx) => {
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
                                    replace(index, {
                                      ...data,
                                      loading: false,
                                      state: "success",
                                    });
                                  })
                                  .catch((error) => {
                                    console.log(error);
                                    replace(index, {
                                      ...values.attachments[index],
                                      loading: false,
                                      state: "error",
                                    });
                                  });
                              }
                            );
                          };
                          return (
                            <div className={styles.attachments}>
                              {values.attachments.map((attachment, index) => {
                                const isTxt = attachment?.mime === "text/plain";
                                const isExcel =
                                  attachment?.mime ===
                                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                                const isDocx =
                                  attachment?.mime ===
                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                                  attachment?.mime === "application/msword";
                                const isPdf =
                                  attachment?.mime === "application/pdf";
                                return (
                                  <div
                                    className={styles.attachmentItem}
                                    key={index}
                                  >
                                    {isDocx && <IcMsWord />}
                                    {isPdf && <IcPdf />}
                                    {isExcel && <IcExcel />}
                                    <div className="flex flex-col overflow-hidden w-full">
                                      <div className={styles.titleWrapper}>
                                        <Tooltip title={attachment?.filename}>
                                          <span className={styles.title}>
                                            {attachment?.filename}
                                          </span>
                                        </Tooltip>
                                      </div>
                                      {isDocx && (
                                        <div className={styles.mime}>
                                          {"application/docx"}
                                        </div>
                                      )}
                                      {isPdf && (
                                        <div className={styles.mime}>
                                          {"application/pdf"}
                                        </div>
                                      )}
                                      {isExcel && (
                                        <div className={styles.mime}>
                                          {"application/sheet"}
                                        </div>
                                      )}
                                    </div>
                                    {attachment.loading && (
                                      <div className={styles.loadingContainer}>
                                        <CircularProgress size="20px" />
                                      </div>
                                    )}
                                    {!attachment.loading &&
                                      attachment.state === "success" && (
                                        <IconButton
                                          onClick={() => remove(index)}
                                        >
                                          <DeleteOutlineIcon
                                            sx={{ color: colors.errorColor }}
                                          />
                                        </IconButton>
                                      )}
                                  </div>
                                );
                              })}
                              <Button
                                variant="outlined"
                                className="mt-4"
                                type="button"
                                onClick={() => {
                                  document
                                    .getElementById("media.attachments")
                                    ?.click();
                                }}
                              >
                                Thêm tệp đính kèm
                              </Button>
                              <input
                                id="media.attachments"
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                                style={{ display: "none" }}
                                onChange={handleUploadFile}
                              ></input>
                            </div>
                          );
                        }}
                      </FieldArray>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </BaseDrawer>
  );
};

export default CreateObjectiveDrawer;
