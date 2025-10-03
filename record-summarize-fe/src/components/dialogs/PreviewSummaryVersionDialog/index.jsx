import CloseIcon from '@mui/icons-material/Close';
import { DialogContent, Dialog, DialogTitle, IconButton, DialogActions, Button, Backdrop, Chip } from '@mui/material';
import styles from './styles.module.scss';
import { getSummaryVersionById, publishedSummaryVersion } from '@/repositories/summary-version.repository';
import LoadingBackdrop from '@/components/LoadingBackdrop';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from 'react-syntax-highlighter';
import unescapeJs from 'unescape-js';
import { vs as codeStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { timeToSeconds } from '@/utils/process_markdown';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import LoadingButton from '@/components/buttons/LoadingButton';


const PreviewSummaryVersionDialog = ({ recordId, open, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [summaryVersion, setSummaryVersion] = useState(null);

  const handleClose = () => {
    setSummaryVersion(null);
    onClose();
  }

  const publish = () => {
    setUpdating(true);
    publishedSummaryVersion(recordId)
      .then(() => {
        setTimeout(() => {
          setSummaryVersion({ ...summaryVersion, published: true });
          enqueueSnackbar('Xuất bản thành công', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
          setUpdating(false)
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => { setUpdating(false) }, 500);
        enqueueSnackbar('Có lỗi xảy ra. Vui lòng thử lại', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });
      });
  }

  useEffect(() => {
    if (recordId) {
      setLoading(true);
      getSummaryVersionById(recordId)
        .then((response) => {
          setTimeout(() => {
            setSummaryVersion(response);
            setLoading(false)
          }, 500);
        })
        .catch((error) => {
          console.log(error);
          setSummaryVersion(null);
          enqueueSnackbar('Có lỗi xảy ra. Vui lòng thử lại', {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
        });
    }
  }, [recordId]);

  return (
    <>
      <LoadingBackdrop open={!summaryVersion && loading} />
      <Dialog open={(!loading && open)} maxWidth='md' fullWidth onClose={handleClose}>
        {summaryVersion &&
          <>
            <DialogTitle sx={{ padding: "10px 5px", gap: '20px' }}>
              <IconButton onClick={handleClose}><CloseIcon sx={{ color: '#6B7280' }} /></IconButton>
              <span className='ml-2'>
                {summaryVersion?.record?.title}
                {summaryVersion?.published && <span className='ml-4'><Chip label="Phiên bản hiện tại" /></span>}
              </span>
            </DialogTitle>
            <DialogContent className={styles.dialogContent}>
              <p className={styles.markdown}>
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={codeStyle} language={match[1]}
                          PreTag="div" className="rounded-lg my-2"   {...props}>
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (<code className="bg-gray-100 px-1 py-0.5 rounded" {...props}>{children}</code>);
                    },
                  }}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}>
                  {unescapeJs(summaryVersion?.summary_content)
                    .replace(/\[(\d{1,2}:\d{2}:\d{2})-(\d{1,2}:\d{2}:\d{2})\]/g, (_, t1, t2) => {
                      const start = timeToSeconds(t1);
                      return `<a href="#" class="timestamp" data-time="${start}">[${t1}-${t2}]</a>`;
                    })
                    .replace(/\[(\d{1,2}:\d{2}:\d{2})\]/g, (_, t) => {
                      const sec = timeToSeconds(t);
                      return `<a href="#" class="timestamp" data-time="${sec}">[${t}]</a>`;
                    })
                  }
                </ReactMarkdown>
              </p>
            </DialogContent >
            <DialogActions className={styles.dialogContent}>
              <LoadingButton
                loading={updating}
                disabled={summaryVersion?.published}
                startIcon={<PublishOutlinedIcon />}
                onClick={publish} variant='contained'>
                {"Xuất bản"}
              </LoadingButton>
            </DialogActions>
          </>
        }
      </Dialog>
    </>
  )
}

export default PreviewSummaryVersionDialog;