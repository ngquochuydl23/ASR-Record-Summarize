import ChatView from '@/sections/records/Chat';
import styles from './playvideo.module.scss';
import readS3Object from '@/utils/avatar/readS3Object';
import ReactPlayer from 'react-player'
import { Avatar, Tooltip, Typography } from '@mui/material';
import IcInfo from '@/assets/icons/IcInfo';
import { useParams } from 'react-router-dom';
import { useAsync } from "react-use";
import { getRecordById } from '@/repositories/record.repository';
import { readUrl } from '@/utils/readUrl';
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs as codeStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import unescapeJs from 'unescape-js';
import ReactMarkdown from "react-markdown";
import { getSummaryVersionById } from '@/repositories/summary-version.repository';
import Scrollbars from 'react-custom-scrollbars-2';
import { ChatbotPreparingStateEnum } from '@/constants/app.constants';
import LoadingScreen from '@/components/LoadingScreen';

const PlayVideoPage = () => {
  const { recordId } = useParams();

  async function getBlobUrl(fileKey) {
    const res = await fetch(readS3Object(fileKey));
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    return url;
  }

  const { loading, value: record } = useAsync(async () => {
    const record = await getRecordById(recordId);
    const summary_version = await getSummaryVersionById(record.current_version_id);
    const vtt = await getBlobUrl(record.subtitle_url);
    record.subtitle_url = vtt;
    record.summary_version = summary_version;
    return record;
  }, [recordId]);

  const handleRetry = () => {

  }

  if (loading) {
    return (
      <LoadingScreen>
        alo
      </LoadingScreen>
    )
  }

  return (
    <div className={styles.playVideoPage}>
      <div className={styles.mainSection}>
        <Scrollbars>
          <div className='flex flex-col pr-2'>
            <div className={styles.videoContainer}>
              <ReactPlayer width={"100%"} height={"100%"} controls src={readS3Object(record?.url)}>
                <track kind="subtitles" src={record?.subtitle_url} srclang="vi" default></track>
              </ReactPlayer>
            </div>
            <div className='flex flex-col mt-2'>
              <Typography variant='h5'>{record?.title}</Typography>
              <Typography fontSize="14px" mt="15px">{record?.description}</Typography>
              <div className='flex my-4 items-center gap-3'>
                <Avatar src={readUrl(record?.creator?.avatar, false)} />
                <div className='flex flex-col'>
                  <Typography fontSize="16px" fontWeight="600">{record?.creator?.full_name}</Typography>
                  <Typography fontSize="14px">{record?.creator?.email}</Typography>
                </div>
              </div>
            </div>
            <div className={styles.summaryContainer}>
              <div className='flex items-center gap-2'>
                <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>Tóm tắt nội dung video</Typography>
                <Tooltip title="Nội dung này được AI tạo tự động - chỉ mang tính tham khảo.">
                  <div><IcInfo /></div>
                </Tooltip>
              </div>
              <div></div>
              {record?.summary_version &&
                <p className={styles.markdown}>
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter style={codeStyle} language={match[1]}
                            PreTag="div" className="rounded-lg my-2"   {...props}>
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (<code className="bg-gray-100 px-1 py-0.5 rounded" {...props}>{children}</code>);
                      },
                    }}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}>
                    {unescapeJs(record?.summary_version?.summary_content)}</ReactMarkdown>
                </p>
              }
            </div>
          </div>
        </Scrollbars>
      </div>
      <div className='py-3 pr-3' style={{ height: 'calc(100vh - 60px)', }}>
        <div className={styles.chatSection}>
          <ChatView
            record={record}
            state={record.chatbot_preparation_state}
            onRetry={handleRetry} />
        </div>
      </div>
    </div>
  )
}

export default PlayVideoPage;