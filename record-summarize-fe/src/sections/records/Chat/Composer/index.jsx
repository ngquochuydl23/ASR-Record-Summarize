import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import styles from './styles.module.scss';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import _ from 'lodash';
import { useCallback, useRef, useState } from 'react';
import classNames from 'classnames';
import { BootstrapInput } from '@/components/fields/BootstrapField';
import { colors } from '@/theme/theme.global';
import IcPdf from '@/assets/icons/IcPdf';
import * as Yup from "yup";
import { FieldArray, Formik } from 'formik';
import { uploadFile } from '@/repositories/storage.repository';

const Composer = ({ onSendMsg, disabled = false }) => {
  const [borderRadius, setBorderRadius] = useState('30px');
  const inputRef = useRef(null);
  const validationSchema = Yup.object({
    msg_content: Yup.string()
      .trim()
      .required("Message is required")
      .max(1000, "Message is too long (max 1000 chars)"),
    attachments: Yup.array()
      .of(
        Yup.object().shape({
          filename: Yup.string().required("File name required"),
          mime: Yup.string().required("File type required"),
          size: Yup.number().max(10 * 1024 * 1024, "File too large (max 10MB)"),
          url: Yup.string().required("File name required"),
          state: Yup.string()
            .oneOf(["success"], "File must be successfully uploaded")
            .required("File upload state required"),
        })
      )
      .max(6, "Maximum 6 attachments allowed"),
  });

  const elementRef = useCallback((node) => {
    if (!node) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setBorderRadius(entry.contentRect.height > 50 ? '15px' : '30px');
      }
    });
    resizeObserver.observe(node);
  }, []);

  const handleSubmit = async (values, { resetForm, setFieldValue }) => {
    resetForm();
    setFieldValue('msg_content', '');
    onSendMsg(values);
  };

  return (
    <Formik
      initialValues={{
        msg_content: null,
        attachments: []
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      {({ values, dirty, isValid, setFieldValue, validateField, submitForm }) => {
        const isDisabled = disabled || !isValid || !dirty;
        return (
          <div className={styles.composerView}>
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
                        replace(index, { ...data, loading: false, state: 'success' });
                        validateField();
                      })
                      .catch((error) => {
                        console.log(error);
                        replace(index, { ...values.attachments[index], loading: false, state: 'error' });
                        validateField();
                      });
                  });
                }
                return (
                  <div>
                    <input
                      multiple ref={inputRef} type="file" accept=".pdf,.docx,.jpeg,.png,.webp"
                      style={{ display: 'none' }} onChange={handleUploadFile} />
                    {_.isEmpty(values.attachments) ? null :
                      <div className={styles.files}>
                        {values.attachments.map((attachment, index) => {
                          const isExcel = attachment?.mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          const isDocx = attachment?.mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || attachment?.mime === "application/msword";
                          const isPdf = attachment?.mime === "application/pdf";
                          return (
                            <div className={styles.attachmentItem} key={attachment.filename}>
                              <div className={styles.fileName}>{attachment.filename}</div>
                              {isPdf &&
                                <div className={styles.fileType}>
                                  <span><IcPdf sx={{ height: '15px', width: '15px', marginRight: '5px' }} /> PDF</span>
                                </div>
                              }
                              {isDocx &&
                                <div className={styles.fileType}>
                                  <span><IcPdf sx={{ height: '15px', width: '15px', marginRight: '5px' }} /> MsWord</span>
                                </div>
                              }
                              {isExcel &&
                                <div className={styles.fileType}>
                                  <span><IcPdf sx={{ height: '15px', width: '15px', marginRight: '5px' }} /> MsExcel</span>
                                </div>
                              }
                              {attachment?.loading &&
                                <div className={styles.loadingSpinner}>
                                  <CircularProgress size={20} />
                                </div>
                              }
                              {(!attachment?.loading && attachment?.state === 'success') &&
                                <div className={styles.iconClose} onClick={remove}>&times;</div>
                              }
                              {(!attachment?.loading && attachment?.state === 'error') &&
                                <div className={styles.iconClose} onClick={remove}>&times;</div>
                              }
                            </div>
                          )
                        })}
                      </div>
                    }
                  </div>
                )
              }}
            </FieldArray>
            <div className='flex w-full gap-2 items-end'>
              <Tooltip title="Tệp đính kèm">
                <IconButton className={styles.iconBtn} onClick={() => inputRef?.current?.click()}>
                  <AttachFileIcon />
                </IconButton>
              </Tooltip>
              <BootstrapInput
                ref={elementRef} placeholder="Soạn tin nhắn"
                multiline maxRows={6} size="small"
                value={values.msg_content}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!disabled && isValid) submitForm();
                  }
                }}
                sx={{
                  padding: 0,
                  width: '100%',
                  ['& .MuiInputBase-input']: {
                    backgroundColor: 'whitesmoke',
                    padding: '15px 10px',
                    borderRadius,
                    fontSize: '14px',
                  },
                }}
                onChange={(e) => setFieldValue('msg_content', e.target.value)}
              />
              <Tooltip title="Gửi tin nhắn">
                <IconButton
                  sx={{
                    ...((!isDisabled) && {
                      backgroundColor: colors.primaryColor,
                      '&:hover': {
                        backgroundColor: colors.trans05Primary
                      }
                    })
                  }}
                  onClick={submitForm}
                  className={classNames(styles.iconBtn, styles.sendBtn)}
                  disabled={isDisabled}
                  type='submit'>
                  <SendIcon sx={{ ...((!isDisabled) && { color: colors.white }) }} />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        )
      }}
    </Formik>
  );
};

export default Composer;