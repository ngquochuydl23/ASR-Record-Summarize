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

const PlayVideoPage = () => {
  const { recordId } = useParams();

  async function getBlobUrl(fileKey) {
    const res = await fetch(readS3Object(fileKey));
    const blob = await res.blob(); // convert response to Blob
    const url = URL.createObjectURL(blob); // create temporary URL
    return url;
  }

  const { loading, value: record } = useAsync(async () => {
    const record = await getRecordById(recordId);
    const vtt = await getBlobUrl(record.subtitle_url);
    record.subtitle_url = vtt;
    return record;
  }, [recordId]);

  if (loading) {
    return (
      <div>
        alo
      </div>
    )
  }

  return (
    <div className={styles.playVideoPage}>
      <div className={styles.mainSection}>
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
          <p className={styles.markdown}>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={codeStyle}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg my-2"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-100 px-1 py-0.5 rounded" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}>
              {unescapeJs("Dưới đây là bản tóm tắt bài giảng theo cấu trúc yêu cầu:\n\n## 1. Thông tin chung\n- Tiêu đề: Tổng quan các thuật toán Machine Learning\n- Giảng viên / nguồn: Tổng hợp từ các bài giảng và tài liệu khác nhau\n- Ngày phát hành / bối cảnh: N/A\n- Chủ đề trọng tâm: Giới thiệu và tóm tắt các thuật toán Machine Learning cơ bản: phân loại, hồi quy, phân cụm, giảm chiều dữ liệu.\n\n## 2. Ý chính theo mạch nội dung\n### A. Mở đầu\n- Câu hỏi dẫn nhập / vấn đề đặt ra: Bài toán phân loại, hồi quy, phân cụm và giảm chiều dữ liệu là gì và tại sao cần chúng?\n- Mục tiêu học tập: Hiểu tổng quan về các thuật toán Machine Learning, nắm bắt được ý tưởng cơ bản của từng thuật toán.\n- *Trích dẫn tiêu biểu*: N/A\n\n### B. Khái niệm & Thuật ngữ\n- Định nghĩa quan trọng:\n    - **Phân loại (Classification)**: Gán một nhãn cho một phần tử đầu vào từ một tập nhãn hữu hạn.\n    - **Hồi quy (Regression)**: Xây dựng thuật toán dự đoán một biến liên tục.\n    - **Phân cụm (Clustering)**: Phân chia tập dữ liệu thành các cụm khác nhau, sao cho các phần tử trong một cụm có tính tương đồng cao.\n    - **Giảm chiều dữ liệu (Dimensionality Reduction)**: Giảm số lượng đặc trưng của dữ liệu.\n- Các từ khóa chính: Supervised learning, unsupervised learning, feature extraction, model evaluation.\n- *Trích dẫn*: N/A\n\n### C. Mô hình / Lý thuyết / Công thức\n- **Các thuật toán phân loại:**\n    - Perceptron\n    - Adaline\n    - Logistic Regression\n    - SVM\n    - Decision Tree\n    - Random Forest\n- **Các thuật toán hồi quy:**\n    - Linear Regression\n    - Polynomial Regression\n    - Decision Tree Regression\n    - Random Forest Regression\n- **Các thuật toán phân cụm:**\n    - K-means\n    - Hierarchical Clustering\n    - DBSCAN\n- **Các thuật toán giảm chiều dữ liệu:**\n    - PCA\n    - LDA\n- **Công thức:**\n    - **Hàm sigmoid (Logistic Regression):**  `ϕ(z) = 1 / (1 + e^(-z))`\n    - **Hàm mục tiêu (Linear Regression):** `J(w) = 1/2 * ∑(y(i) - ^y(i))^2`\n    - **Chỉ số Gini (Decision Tree):** `IG = 1 - ∑ p(i)^2`\n    - **Khoảng cách Euclidean (K-means):** `d(x, y) = sqrt(∑(xi - yi)^2)`\n\n### D. Ví dụ minh họa\n- **Phân loại hoa Iris:** Sử dụng Decision Tree để phân loại hoa Iris dựa trên chiều dài và chiều rộng của cánh hoa và đài hoa.\n- **Hồi quy giá nhà Boston:** Sử dụng Linear Regression để dự đoán giá nhà dựa trên các yếu tố như số phòng, vị trí, v.v.\n- **Phân cụm khách hàng:** Sử dụng K-means để phân nhóm khách hàng dựa trên hành vi mua sắm.\n- **Giảm chiều dữ liệu ảnh:** Sử dụng PCA để giảm số chiều của ảnh, giúp giảm dung lượng lưu trữ và tăng tốc độ xử lý.\n- *Trích dẫn*: N/A\n\n### E. Thảo luận & Mở rộng\n- **So sánh PCA và LDA:** PCA là phương pháp unsupervised learning, trong khi LDA là phương pháp supervised learning. LDA thường cho kết quả phân loại tốt hơn khi có labels.\n- **Sự cần thiết của Feature Scaling:** Đưa các đặc tính về cùng một chuẩn để tránh việc một số đặc trưng có ảnh hưởng lớn hơn các đặc trưng khác.\n- **Các vấn đề liên quan đến Overfitting:** Cần sử dụng các phương pháp regularization để tránh overfitting, giúp mô hình hoạt động tốt hơn trên tập test.\n- **Áp dụng Kernel Trick trong SVM:** Biến đổi không gian dữ liệu để có thể phân chia tuyến tính, giúp giải quyết các bài toán phức tạp hơn.\n- *Trích dẫn*: N/A\n\n## 3. Tổng hợp\n- Ba ý chính cần nhớ:\n  1. Các thuật toán Machine Learning có thể được chia thành các loại chính: phân loại, hồi quy, phân cụm và giảm chiều dữ liệu.\n  2. Mỗi thuật toán có những ưu điểm và nhược điểm riêng, cần lựa chọn thuật toán phù hợp với bài toán cụ thể.\n  3. Việc đánh giá và cải thiện mô hình là rất quan trọng để đảm bảo mô hình hoạt động tốt trên dữ liệu mới.\n- Ứng dụng thực tiễn / lời khuyên từ giảng viên: Hiểu rõ bản chất của từng thuật toán và lựa chọn thuật toán phù hợp với dữ liệu và bài toán cụ thể.\n- *Trích dẫn lời nhấn mạnh*: N/A\n\n## 4. Tài liệu liên quan\n- Raschka and Majialili, Python Machine Learning, 3rd edition, Packt Publishing, 2019\n- A. Geron, Hands-on Machine Learning with Scikit-Learn, Keras and Tensorow , 2nd edition, 2019\n- Kevin Murphy, Machine Learning a Probabilistic Perspective, The MIT press, 2012\n- Goodfellow, Ian, Yoshua Bengio, and Aaron Courville. Deep learning. MIT press, 2016.\n- Khoat Than, Lectures on Machine Learning and Data Mining , Hanoi University of Science and Technology.\n")}</ReactMarkdown>
          </p>
        </div>
      </div>
      <div className='p-3'>
        <div className={styles.chatSection}>
          <ChatView />
        </div>
      </div>
    </div>
  )
}

export default PlayVideoPage;