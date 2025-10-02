import ChatView from '@/sections/records/Chat';
import styles from './playvideo.module.scss';
import readS3Object from '@/utils/avatar/readS3Object';
import ReactPlayer from 'react-player'
import { Avatar, Tooltip, Typography } from '@mui/material';
import IcInfo from '@/assets/icons/IcInfo';
import { useParams } from 'react-router-dom';
import { getRecordById, retryChatbot } from '@/repositories/record.repository';
import { readUrl } from '@/utils/readUrl';
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs as codeStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import unescapeJs from 'unescape-js';
import ReactMarkdown from "react-markdown";
import Scrollbars from 'react-custom-scrollbars-2';
import { timeToSeconds } from '@/utils/process_markdown';
import { useEffect, useRef, useState } from 'react';
import { getConversationsByRecordId } from '@/repositories/conversation.repository';
import { useLoading } from '@/contexts/LoadingContextProvider';
import classNames from 'classnames';
import { ChatbotPreparingStateEnum } from '@/constants/app.constants';


const PlayVideoPage = () => {
  const { recordId } = useParams();
  const scrollbarRef = useRef(null);
  const { showLoading, hideLoading, isLoading } = useLoading();
  const [record, setRecord] = useState(null);
  async function getBlobUrl(fileKey) {
    const res = await fetch(readS3Object(fileKey));
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    return url;
  }

  const getRecordDetail = async () => {
    try {
      if (!isLoading) showLoading();
      const _record = await getRecordById(recordId);
      const converstations = await getConversationsByRecordId(recordId);
      const subtitle = await getBlobUrl(_record?.subtitle_url);
      _record.subtitle_url = subtitle;
      _record.converstations = converstations;
      setRecord(_record);
      hideLoading();
    } catch (e) {
      console.log(e);
    } finally {
    }
  }

  useEffect(() => {
    getRecordDetail();
  }, [recordId])

  useEffect(() => {
    const handler = (e) => {
      const target = e.target;
      if (target.matches("a.timestamp")) {
        e.preventDefault();
        const sec = Number(target.getAttribute("data-time"));
        seekTo(sec);
      }
    };

    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    }
  }, []);

  const seekTo = (startTime) => {
    const videoDom = document.getElementsByTagName("video")[0];
    if (videoDom) {
      videoDom.currentTime = startTime;
      scrollbarRef.current?.scrollTop(0);
    }
  }

  const handleRetry = () => {
    setRecord(pre => ({ ...pre, chatbot_preparation_state: ChatbotPreparingStateEnum.PREPARING }));
    retryChatbot(recordId)
      .catch((error) => {
        setRecord(pre => ({ ...pre, chatbot_preparation_state: ChatbotPreparingStateEnum.FAILED }));
        console.log(error);
      })
      .finally(() => { });
  }

  if (isLoading || !record) return null;

  return (
    <div className={classNames(styles.playVideoPage, { [styles.isShowStagingLabel]: process.env.REACT_APP_ENVIRONMENT === "Staging" })}>
      <div className={styles.mainSection}>
        <Scrollbars ref={scrollbarRef} autoHide>
          <div className='flex flex-col pr-2' id='ScrollPanel'>
            <div className={styles.videoContainer}>
              <ReactPlayer width={"100%"} height={"100%"} controls src={readS3Object(record?.url)}>
                <track kind="subtitles" src={record?.subtitle_url} srcLang="vi" default></track>
              </ReactPlayer>
            </div>
            <div className='flex flex-col mt-2'>
              <Typography variant='h5'>{record?.title}</Typography>
              <Typography fontSize="14px" mt="15px" sx={{ wordWrap: 'break-word', hyphens: "auto" }}>{record?.description}</Typography>
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
              {record?.current_version &&
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
                    {unescapeJs(record?.current_version?.summary_content)
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
              }
            </div>
          </div>
        </Scrollbars>
      </div >
      <div className='py-3 pr-3' >
        <div className={styles.chatSection}>
          <ChatView
            record={record}
            state={record?.chatbot_preparation_state}
            onRetry={handleRetry} />
        </div>
      </div>
    </div >
  )
}

export default PlayVideoPage;