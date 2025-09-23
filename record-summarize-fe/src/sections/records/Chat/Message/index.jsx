import { Button } from '@mui/material';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { CircularProgress } from '@mui/material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import ReactMarkdown from "react-markdown";
import { vs as codeStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import { timeToSeconds } from '@/utils/process_markdown';
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import unescapeJs from 'unescape-js';
import { NotFoundKnowledge } from '@/constants/app.constants';
import IcAgreeAnswer from '@/assets/icons/IcAgreeAnswer';
import { colors } from '@/theme/theme.global';

export const MessageItem = ({ content }) => {
  return (
    <div className={styles.messageItem}>
      {content}
    </div>
  );
};

export const AIAgentMessageItem = ({ id, content, onAgree, onDecline }) => {
  return (
    <div className='flex gap-3 p-2 w-fit'>
      <img alt="chatbot icon" className={styles.chatbotIc} src='/chatbot_icon.png' />
      <div className='flex flex-col'>
        <div className={styles.aiAssistantTitle}>Trợ lý AI</div>
        <div className={classNames(styles.messageItem, styles.isAiResponse)}>
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
              {unescapeJs(content)
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
        </div>
        {content === NotFoundKnowledge &&
          <div className='flex gap-2 w-[80%] justify-end mt-2'>
            <Button variant='outlined' size='small' onClick={() => onDecline(id)}>Từ chối</Button>
            <Button variant='outlined' startIcon={<IcAgreeAnswer />}
              disableElevation size='small'
              onClick={() => onAgree(id)}>
              Đồng ý
            </Button>
          </div>
        }
        <div>
        </div>
      </div>
    </div>
  )
}

export const AIAgentGenerating = () => {
  return (
    <div className='flex gap-3 p-2 w-fit'>
      <img alt="chatbot icon" className={styles.chatbotIc} src='/chatbot_icon.png' />
      <div className='flex flex-col'>
        <div className={styles.aiAssistantTitle}>Trợ lý AI</div>
        <div className="text-[#0842a0] flex items-center gap-2 font-[600] text-[13px]">
          <span><CircularProgress size={14} sx={{ color: '#666' }} /></span>
          Đang trả lời
          <span className="ml-1 flex">
            <span className={styles.dotTyping}></span>
          </span>
        </div>
      </div>
    </div>
  )
}

export const NotificationMsgItem = () => {
  return (
    <div className={styles.notificationMsg}>
      <span style={{ fontWeight: 700 }}>Nguyễn Huy </span>
      {` đã tham gia cuộc họp`}
    </div>
  );
};